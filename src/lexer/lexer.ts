import { Token, TokenType } from '../token/token';

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
        let token;
        switch (this.char) {
            case '[':
                token = new Token('LBRACKET', '[');
                break;
            case ']':
                token = new Token('RBRACKET', ']');
                break;
            case '(':
                token = new Token('LPAREN', '(');
                break;
            case ')':
                token = new Token('RPAREN', ')');
                break;
            case '-':
                token = new Token('MINUS', '-');
                break;
            case '#':
                token = this.readHashes();
                break;
            case '\n':
                token = new Token('NEWLINE', '\n');
                break;
            case '':
                token = new Token('EOF', '');
                break;
            default:
                token = this.readLetters();
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

    private readLetters(): Token {
        const start = this.currentPosition;
        while (this.peekPosition < this.input.length && this.isPeekCharLetter()) {
            this.consumeChar();
        }

        return new Token('LETTERS', this.input.substring(start, this.peekPosition));
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
                tokenType = 'HASHES1';
                literal = '#';
                break;
            case 2:
                tokenType = 'HASHES2';
                literal = '##';
                break;
            case 3:
                tokenType = 'HASHES3';
                literal = '###';
                break;
            case 4:
                tokenType = 'HASHES4';
                literal = '####';
                break;
            case 5:
                tokenType = 'HASHES5';
                literal = '#####';
                break;
            default:
                tokenType = 'HASHES6';
                literal = '######';
                break;
        }

        return new Token(tokenType, literal);
    }

    private isPeekCharLetter(): boolean {
        const peekChar = this.input[this.peekPosition];
        const symbols = ['\n', '[', ']', '(', ')', '-', '#'];

        for (const symbol of symbols) {
            if (symbol === peekChar) {
                return false;
            }
        }
        return true;
    }
}
