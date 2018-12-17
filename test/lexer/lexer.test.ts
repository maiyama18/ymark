import { Lexer } from '../../src/lexer/lexer';
import { Token } from '../../src/token/token';

describe('lexer', () => {
  describe('simple cases', () => {
    it('should lex empty input', () => {
      const input = '';
      const expected = [
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });

    it('should lex text only input', () => {
      const input = 'this is text.';
      const expected = [
        new Token('TEXT', 'this is text.'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });
  });

  describe('newlines', () => {
    it('should skip single newline', () => {
      const input = `
first line.
second line.
`;
      const expected = [
        new Token('TEXT', 'first line.'),
        new Token('TEXT', 'second line.'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });

    it('should lex two successive newlines', () => {
      const input = `
first line.

second line.
`;
      const expected = [
        new Token('TEXT', 'first line.'),
        new Token('NEWLINE', '\n\n'),
        new Token('TEXT', 'second line.'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });

    it('should lex more than two successive newlines', () => {
      const input = `
first line.



second line.
`;
      const expected = [
        new Token('TEXT', 'first line.'),
        new Token('NEWLINE', '\n\n'),
        new Token('TEXT', 'second line.'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });
  });

  describe('hashes', () => {
    it('should lex hashes', () => {
      const input = `
# ## ###
#### ##### ######
`;
      const expected = [
        new Token('HASH1', '#'),
        new Token('HASH2', '##'),
        new Token('HASH3', '###'),
        new Token('HASH4', '####'),
        new Token('HASH5', '#####'),
        new Token('HASH6', '######'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });

    it('should lex header', () => {
      const input = `
# this is header

## this is header2
`;
      const expected = [
        new Token('HASH1', '#'),
        new Token('TEXT', 'this is header'),
        new Token('NEWLINE', '\n\n'),
        new Token('HASH2', '##'),
        new Token('TEXT', 'this is header2'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });
  });

  describe('symbols', () => {
    it('should lex symbols consist of single char', () => {
      const input = `[]()`;
      const expected = [
        new Token('LBRACKET', '['),
        new Token('RBRACKET', ']'),
        new Token('LPAREN', '('),
        new Token('RPAREN', ')'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });

    it('should lex mix of texts and symbols', () => {
      const input = `
## header

hello [this is link](http://example.com)
`;
      const expected = [
        new Token('HASH2', '##'),
        new Token('TEXT', 'header'),
        new Token('NEWLINE', '\n\n'),
        new Token('TEXT', 'hello '),
        new Token('LBRACKET', '['),
        new Token('TEXT', 'this is link'),
        new Token('RBRACKET', ']'),
        new Token('LPAREN', '('),
        new Token('TEXT', 'http://example.com'),
        new Token('RPAREN', ')'),
        new Token('EOF', ''),
      ];

      testLexer(input, expected);
    });
  });
});

const testLexer = (input: string, expected: Token[]) => {
  const lexer = new Lexer(input);

  const actual = [];
  for (let i = 0; i < expected.length; i++) {
    actual.push(lexer.nextToken());
  }

  expect(actual).toEqual(expected);
};
