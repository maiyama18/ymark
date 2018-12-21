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
                new Token('LETTERS', 'this is text.'),
                new Token('EOF', ''),
            ];

            testLexer(input, expected);
        });
    });

    describe('newlines', () => {
        it('should lex single newline', () => {
            const input = `first line.
second line.`;
            const expected = [
                new Token('LETTERS', 'first line.'),
                new Token('NEWLINE', '\n'),
                new Token('LETTERS', 'second line.'),
                new Token('EOF', ''),
            ];

            testLexer(input, expected);
        });

        it('should lex two successive newlines', () => {
            const input = `first line.

second line.`;
            const expected = [
                new Token('LETTERS', 'first line.'),
                new Token('NEWLINE', '\n'),
                new Token('NEWLINE', '\n'),
                new Token('LETTERS', 'second line.'),
                new Token('EOF', ''),
            ];

            testLexer(input, expected);
        });
    });

    describe('hashes', () => {
        it('should lex hashes', () => {
            const input = `# ## ###
#### ##### ######`;
            const expected = [
                new Token('HASHES1', '#'),
                new Token('LETTERS', ' '),
                new Token('HASHES2', '##'),
                new Token('LETTERS', ' '),
                new Token('HASHES3', '###'),
                new Token('NEWLINE', '\n'),
                new Token('HASHES4', '####'),
                new Token('LETTERS', ' '),
                new Token('HASHES5', '#####'),
                new Token('LETTERS', ' '),
                new Token('HASHES6', '######'),
                new Token('EOF', ''),
            ];

            testLexer(input, expected);
        });

        it('should lex header', () => {
            const input = `# this is header
## this is header2`;
            const expected = [
                new Token('HASHES1', '#'),
                new Token('LETTERS', ' this is header'),
                new Token('NEWLINE', '\n'),
                new Token('HASHES2', '##'),
                new Token('LETTERS', ' this is header2'),
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
            const input = `## header

hello [this is link](http://example.com)`;
            const expected = [
                new Token('HASHES2', '##'),
                new Token('LETTERS', ' header'),
                new Token('NEWLINE', '\n'),
                new Token('NEWLINE', '\n'),
                new Token('LETTERS', 'hello '),
                new Token('LBRACKET', '['),
                new Token('LETTERS', 'this is link'),
                new Token('RBRACKET', ']'),
                new Token('LPAREN', '('),
                new Token('LETTERS', 'http://example.com'),
                new Token('RPAREN', ')'),
                new Token('EOF', ''),
            ];

            testLexer(input, expected);
        });
    });

    describe('list', () => {
        it('should lex list', () => {
            const input = `hello

- first
- second

good bye`;
            const expected = [
                new Token('LETTERS', 'hello'),
                new Token('NEWLINE', '\n'),
                new Token('NEWLINE', '\n'),
                new Token('MINUS', '-'),
                new Token('LETTERS', ' first'),
                new Token('MINUS', '-'),
                new Token('LETTERS', ' second'),
                new Token('NEWLINE', '\n'),
                new Token('NEWLINE', '\n'),
                new Token('LETTERS', 'good bye'),
                new Token('EOF', ''),
            ];

            testLexer(input, expected);
        });

        it('should lex minus during line', () => {
            const input = `3 - 2`;
            const expected = [
                new Token('LETTERS', '3 '),
                new Token('MINUS', '-'),
                new Token('LETTERS', ' 2'),
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
