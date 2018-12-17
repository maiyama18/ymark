import { Lexer } from '../lexer/lexer';
import { Document, Header, Inline, Line, Paragraph, Text } from '../node/node';
import { Token, TokenType } from '../token/token';

export class Parser {
  public lexer: Lexer;
  private currentToken: Token;
  private peekToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;

    const firstToken = lexer.nextToken();
    this.currentToken = firstToken;
    this.peekToken = firstToken;

    this.consumeToken();
  }

  public parseDocument(): Document {
    const document = new Document();

    while (!this.isCurrentTokenType('EOF')) {
      const line = this.parseLine();
      console.log(line);
      document.lines.push(line);

      this.consumeToken();
    }

    return document;
  }

  private consumeToken(): void {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private isCurrentTokenType(tokenType: TokenType): boolean {
    return this.currentToken.tokenType === tokenType;
  }

  private isPeekTokenType(tokenType: TokenType): boolean {
    return this.peekToken.tokenType === tokenType;
  }

  private parseLine(): Line {
    switch (this.currentToken.tokenType) {
      case 'HASH1':
      case 'HASH2':
      case 'HASH3':
      case 'HASH4':
      case 'HASH5':
      case 'HASH6':
        return this.parseHeaderLine();
      default:
        return this.parseParagraphLine();
    }
  }

  private parseHeaderLine(): Header {
    let numHashes;
    switch (this.currentToken.tokenType) {
      case 'HASH1':
        numHashes = 1;
        break;
      case 'HASH2':
        numHashes = 2;
        break;
      case 'HASH3':
        numHashes = 3;
        break;
      case 'HASH4':
        numHashes = 4;
        break;
      case 'HASH5':
        numHashes = 5;
        break;
      default:
        numHashes = 6;
        break;
    }

    const header = new Header(numHashes);

    this.consumeToken();
    while (!this.isCurrentTokenType('NEWLINE') && !this.isCurrentTokenType('EOF')) {
      const inline = this.parseInline();
      header.inlines.push(inline);

      this.consumeToken();
    }

    return header;
  }

  private parseParagraphLine(): Paragraph {
    const paragraph = new Paragraph();

    while (!this.isCurrentTokenType('NEWLINE') && !this.isCurrentTokenType('EOF')) {
      const inline = this.parseInline();
      paragraph.inlines.push(inline);

      this.consumeToken();
    }

    return paragraph;
  }

  private parseInline(): Inline {
    switch (this.currentToken.tokenType) {
      case 'TEXT':
        return new Text(this.currentToken.literal);
    }

    return new Text('');
  }
}
