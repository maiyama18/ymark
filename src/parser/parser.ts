import { Lexer } from '../lexer/lexer';
import { Document, Header, Inline, Line, Link, List, Paragraph, Text } from '../node/node';
import { Token, TokenType } from '../token/token';

export class Parser {
    public lexer: Lexer;
    private currentToken: Token;
    private peekToken: Token;
    private document: Document;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.document = new Document();

        const firstToken = lexer.nextToken();
        this.currentToken = firstToken;
        this.peekToken = firstToken;

        this.consumeToken();
    }

    public parseDocument(): Document {
        while (!this.isCurrentTokenType('EOF')) {
            const line = this.parseLine();
            this.document.addLine(line);

            this.consumeToken();
        }

        return this.document;
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

    private lastLine(): Line | null {
        if (this.document.lines.length === 0) {
            return null;
        }
        return this.document.lines.slice(-1)[0];
    }

    private parseLine(): Line {
        switch (this.currentToken.tokenType) {
            case 'HASHES1':
            case 'HASHES2':
            case 'HASHES3':
            case 'HASHES4':
            case 'HASHES5':
            case 'HASHES6':
                return this.parseHeaderLine();
            case 'MINUS':
                return this.parseListLine();
            default:
                return this.parseParagraphLine();
        }
    }

    private parseHeaderLine(): Header {
        // this.currentToken.tokenType = HASH[1-6]
        const numHashes = parseInt(this.currentToken.tokenType.slice(-1), 10);
        const header = new Header(numHashes);

        this.consumeToken();
        let count = 0;
        while (!this.isCurrentTokenType('NEWLINE') && !this.isCurrentTokenType('EOF')) {
            const inline = this.parseInline(count++);
            header.addInline(inline);

            this.consumeToken();
        }

        return header;
    }

    private parseListLine(): List {
        const list = new List();

        const lastLine = this.lastLine();
        list.isFirst = lastLine === null || lastLine.nodeType !== 'LIST';

        this.consumeToken();
        let count = 0;
        while (!this.isCurrentTokenType('NEWLINE') && !this.isCurrentTokenType('EOF')) {
            const inline = this.parseInline(count++);
            list.addInline(inline);

            this.consumeToken();
        }
        if (this.isCurrentTokenType('EOF') || !this.isPeekTokenType('MINUS')) {
            list.isLast = true;
        }

        return list;
    }

    private parseParagraphLine(): Paragraph {
        const paragraph = new Paragraph();

        let count = 0;
        while (!this.isCurrentTokenType('NEWLINE') && !this.isCurrentTokenType('EOF')) {
            const inline = this.parseInline(count++);
            paragraph.addInline(inline);

            this.consumeToken();
        }

        return paragraph;
    }

    private parseInline(count: number): Inline {
        // remove spaces if this is the first inline element of line
        if (count === 0) {
            this.currentToken.literal = this.currentToken.literal.replace(/^\s*/, '');
        }

        switch (this.currentToken.tokenType) {
            case 'LBRACKET':
                return this.parseLink();
            default:
                let text = this.currentToken.literal;
                while (
                    !this.isPeekTokenType('LBRACKET') &&
                    !this.isPeekTokenType('NEWLINE') &&
                    !this.isPeekTokenType('EOF')
                ) {
                    this.consumeToken();
                    text += this.currentToken.literal;
                }
                return new Text(text);
        }
    }

    private parseLink(): Inline {
        let literal = '[';

        this.consumeToken();
        literal += this.currentToken.literal;
        if (!this.isCurrentTokenType('LETTERS')) {
            return new Text(literal);
        }
        const text = this.currentToken.literal;

        this.consumeToken();
        literal += this.currentToken.literal;
        if (!this.isCurrentTokenType('RBRACKET')) {
            return new Text(literal);
        }

        this.consumeToken();
        literal += this.currentToken.literal;
        if (!this.isCurrentTokenType('LPAREN')) {
            return new Text(literal);
        }

        this.consumeToken();
        literal += this.currentToken.literal;
        if (!this.isCurrentTokenType('LETTERS')) {
            return new Text(literal);
        }
        const href = this.currentToken.literal;

        this.consumeToken();
        literal += this.currentToken.literal;
        if (!this.isCurrentTokenType('RPAREN')) {
            return new Text(literal);
        }

        return new Link(text, href);
    }
}
