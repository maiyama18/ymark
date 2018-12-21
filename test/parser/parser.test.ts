import { Lexer } from '../../src/lexer/lexer';
import { Document, Header, Link, List, Paragraph, Text } from '../../src/node/node';
import { Parser } from '../../src/parser/parser';

describe('parser', () => {
    describe('empty document', () => {
        it('should parse empty document', () => {
            const input = '';
            const document = parseDocument(input);

            expect(document.lines.length).toBe(0);
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

    describe('header', () => {
        it('should parse header', () => {
            const input = '## this is header';
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const header = document.lines[0] as Header;

            expect(header.numHashes).toBe(2);
            expect(document.lines[0].inlines.length).toBe(1);

            expect(document.lines[0].inlines[0].nodeType).toBe('TEXT');
            expect((document.lines[0].inlines[0] as Text).text).toBe('this is header');
        });

        it('should parse mix of header and paragraph', () => {
            const input = `### header

paragraph
`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(3);

            const header = document.lines[0] as Header;
            const headerText = header.inlines[0] as Text;
            expect(headerText.text).toBe('header');

            const paragraph = document.lines[2] as Header;
            const paragraphText = paragraph.inlines[0] as Text;
            expect(paragraphText.text).toBe('paragraph');
        });

        it('should parse header including hashes', () => {
            const input = `#### ## header ##`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const header = document.lines[0] as Header;
            expect(header.numHashes).toBe(4);

            const inlines = header.inlines;
            expect(inlines.length).toBe(1);
            expect(inlines[0].text).toBe('## header ##');
        });

        it('should parse header including link', () => {
            const input = `# text1 [link](http://example.com) text2`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const header = document.lines[0] as Header;
            expect(header.numHashes).toBe(1);

            const inlines = header.inlines;
            expect(inlines.length).toBe(3);
            expect(inlines[0].text).toBe('text1 ');
            expect(inlines[2].text).toBe(' text2');
            const link = inlines[1] as Link;
            expect(link.text).toBe('link');
            expect(link.href).toBe('http://example.com');
        });
    });

    describe('paragraph', () => {
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
            const input = `first line

second line`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(3);

            const line1 = document.lines[0] as Paragraph;
            const text1 = line1.inlines[0] as Text;
            expect(text1.text).toBe('first line');

            const line2 = document.lines[2] as Paragraph;
            const text2 = line2.inlines[0] as Text;
            expect(text2.text).toBe('second line');
        });
    });

    describe('lists', () => {
        it('should parse list with single element', () => {
            const input = `- item1`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(1);

            const item = document.lines[0] as List;
            expect(item.isFirst).toBe(true);
            expect(item.isLast).toBe(true);

            const inlines = item.inlines;
            expect(inlines.length).toBe(1);
            expect(inlines[0].text).toBe('item1');
        });

        it('should parse list with multiple element', () => {
            const input = `- item1
- item2
- item3`;
            const document = parseDocument(input);

            expect(document.lines.length).toBe(3);

            const item1 = document.lines[0] as List;
            expect(item1.isFirst).toBe(true);
            expect(item1.isLast).toBe(false);

            const item2 = document.lines[1] as List;
            expect(item2.isFirst).toBe(false);
            expect(item2.isLast).toBe(false);

            const item3 = document.lines[2] as List;
            expect(item3.isFirst).toBe(false);
            expect(item3.isLast).toBe(true);
        });
    });
});

const parseDocument = (input: string): Document => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    return parser.parseDocument();
};
