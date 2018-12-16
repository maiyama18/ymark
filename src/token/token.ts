export type TokenType =
  | 'TEXT'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'LPAREN'
  | 'RPAREN'
  | 'HASH1'
  | 'HASH2'
  | 'HASH3'
  | 'HASH4'
  | 'HASH5'
  | 'HASH6'
  | 'NEWLINE'
  | 'EOF'
  | 'ILLEGAL';

export class Token {
  public tokenType: TokenType;
  public literal: string;

  constructor(tokenType: TokenType, literal: string) {
    this.tokenType = tokenType;
    this.literal = literal;
  }
}
