import {Token, TokenType} from '../token/token';

export class Lexer {
  public input: string;
  private currentPosition: number;
  private peekPosition: number;
  private char: string;

  constructor(input: string) {
    this.input = input;
    this.currentPosition = 0;
    this.peekPosition = 1;
    this.char = input.length > 0 ? input[0] : '';
  }

  public nextToken(): Token {
    if (this.processNewlines()) { return new Token('NEWLINE', '\n\n'); }
    this.skipSpaces();

    let token;
    switch (this.char) {
      case '#':
        token = this.readHashes();
        break;
      case '':
        token = new Token('EOF', '');
        break;
      default:
        token = this.readText();
        break;
    }

    this.consumeChar();
    return token;
  }

  private consumeChar() {
    if (this.peekPosition >= this.input.length) {
      this.char = '';
    } else {
      this.char = this.input[this.peekPosition];
    }

    this.currentPosition += 1;
    this.peekPosition += 1;
  }

  private peekChar(): string {
    return this.peekPosition >= this.input.length ? '' : this.input[this.peekPosition];
  }

  // skip single newline.
  // return true if there is successive newlines.
  private processNewlines() {
    if (this.char !== '\n') { return; }

    if (this.peekChar() !== '\n') {
      this.consumeChar();
      return false;
    }

    while (this.peekChar() === '\n') {
      this.consumeChar();
    }
    this.consumeChar();
    return true;
  }

  private skipSpaces() {
    while (this.char === ' ' || this.char === '\t') {
      this.consumeChar();
    }
  }

  private readText(): Token {
    const start = this.currentPosition;
    while (this.peekPosition < this.input.length && !this.isPeekSymbol()) {
      this.consumeChar();
    }

    return new Token('TEXT', this.input.substring(start, this.peekPosition));
  }

  // return hashes token if spaces exist after successive #s
  private readHashes(): Token {
    let count = 1;
    while (this.peekChar() === '#') {
      this.consumeChar();
      count += 1;
    }

    let tokenType: TokenType;
    let literal;
    switch (count) {
      case 1:
        tokenType = 'HASH1';
        literal = '#';
        break;
      case 2:
        tokenType = 'HASH2';
        literal = '##';
        break;
      case 3:
        tokenType = 'HASH3';
        literal = '###';
        break;
      case 4:
        tokenType = 'HASH4';
        literal = '####';
        break;
      case 5:
        tokenType = 'HASH5';
        literal = '#####';
        break;
      default:
        tokenType = 'HASH6';
        literal = '######';
        break;
    }

    return new Token(tokenType, literal);
  }

  private isPeekSymbol(): boolean {
    const peekChar = this.input[this.peekPosition];
    return peekChar === '\n';
  }
}
