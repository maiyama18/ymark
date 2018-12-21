import { Lexer } from '../../src/lexer/lexer';
import { Document, Header, Link, Text } from '../../src/node/node';
import { Parser } from '../../src/parser/parser';

describe('parser', () => {
    describe('empty document', () => {
        it('should parse empty document', () => {
            const input = '';
            const document = parseDocument(input);

            expect(document.lines.length).toBe(0);
        });
    });

    describe('text only simple documents', () => {
        it('should parse header', () => {
            const input = '## this is header';
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const line = document.lines[0];

            expect(line.nodeType).toBe('HEADER');
            expect((line as Header).numHashes).toBe(2);
            expect(line.inlines.length).toBe(1);
            expect(line.inlines[0].nodeType).toBe('TEXT');
            expect((line.inlines[0] as Text).text).toBe('this is header');
        });

        it('should parse paragraph with single line', () => {
            const input = `single line`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const line = document.lines[0];

            expect(line.nodeType).toBe('PARAGRAPH');
            expect(line.inlines.length).toBe(1);
            expect(line.inlines[0].nodeType).toBe('TEXT');
            expect((line.inlines[0] as Text).text).toBe('single line');
        });

        it('should parse paragraph with multiple lines', () => {
            const input = `
first line

second line
`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(2);

            const line1 = document.lines[0];

            expect(line1.nodeType).toBe('PARAGRAPH');
            expect(line1.inlines.length).toBe(1);
            expect(line1.inlines[0].nodeType).toBe('TEXT');
            expect((line1.inlines[0] as Text).text).toBe('first line');

            const line2 = document.lines[1];

            expect(line2.nodeType).toBe('PARAGRAPH');
            expect(line2.inlines.length).toBe(1);
            expect(line2.inlines[0].nodeType).toBe('TEXT');
            expect((line2.inlines[0] as Text).text).toBe('second line');
        });

        it('should parse mix of header and paragraph', () => {
            const input = `
### header

paragraph
`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(2);

            const header = document.lines[0];

            expect(header.nodeType).toBe('HEADER');
            expect((header as Header).numHashes).toBe(3);
            expect(header.inlines.length).toBe(1);
            expect(header.inlines[0].nodeType).toBe('TEXT');
            expect((header.inlines[0] as Text).text).toBe('header');

            const line = document.lines[1];

            expect(line.nodeType).toBe('PARAGRAPH');
            expect(line.inlines.length).toBe(1);
            expect(line.inlines[0].nodeType).toBe('TEXT');
            expect((line.inlines[0] as Text).text).toBe('paragraph');
        });
    });

    describe('links', () => {
        it('should parse single link', () => {
            const input = `[this is link](http://example.com)`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const link = document.lines[0];

            expect(link.nodeType).toBe('PARAGRAPH');
            expect(link.inlines.length).toBe(1);
            expect(link.inlines[0].nodeType).toBe('LINK');
            expect((link.inlines[0] as Link).text).toBe('this is link');
            expect((link.inlines[0] as Link).href).toBe('http://example.com');
        });

        it('should parse single link and text', () => {
            const input = `link is [here](http://example.com)`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const link = document.lines[0];

            expect(link.nodeType).toBe('PARAGRAPH');
            expect(link.inlines.length).toBe(2);

            expect(link.inlines[0].nodeType).toBe('TEXT');
            expect((link.inlines[0] as Text).text).toBe('link is ');

            expect(link.inlines[1].nodeType).toBe('LINK');
            expect((link.inlines[1] as Link).text).toBe('here');
            expect((link.inlines[1] as Link).href).toBe('http://example.com');
        });
    });
});

const parseDocument = (input: string): Document => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    return parser.parseDocument();
};
