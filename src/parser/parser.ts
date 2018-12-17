import { Lexer } from '../lexer/lexer';
import { Token } from '../token/token';

export class Parser {
  public lexer: Lexer;
  private currentToken: Token;
  private peekToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;

    const firstToken = lexer.nextToken();
    this.currentToken = firstToken;
    this.peekToken = firstToken;

    this.nextToken();
  }

  public parseDocument():

  public nextToken() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

}
