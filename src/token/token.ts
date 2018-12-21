export type TokenType =
    | 'TEXT'
    | 'LBRACKET'
    | 'RBRACKET'
    | 'LPAREN'
    | 'RPAREN'
    | 'MINUS'
    | 'HASHES1'
    | 'HASHES2'
    | 'HASHES3'
    | 'HASHES4'
    | 'HASHES5'
    | 'HASHES6'
    | 'NEWLINE'
    | 'EOF';

export class Token {
    public tokenType: TokenType;
    public literal: string;

    constructor(tokenType: TokenType, literal: string) {
        this.tokenType = tokenType;
        this.literal = literal;
    }
}
