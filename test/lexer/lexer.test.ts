import {Lexer} from '../../src/lexer/lexer';
import {Token} from '../../src/token/token';

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
});

const testLexer = (input: string, expected: Token[]) => {
  const lexer = new Lexer(input);

  const actual = [];
  for (let i = 0; i < expected.length; i++) {
    actual.push(lexer.nextToken());
  }

  expect(actual).toEqual(expected);
};
