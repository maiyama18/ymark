import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import { Renderer } from '../../src/renderer/renderer';

describe('renderer', () => {
    describe('simple cases', () => {
        it('should render empty document', () => {
            const input = '';
            const html = renderHTML(input);

            expect(html).toBe('<div></div>');
        });

        it('should render document consists of one-line text', () => {
            const input = 'hello world.';
            const html = renderHTML(input);

            expect(html).toBe('<div><p><span>hello world.</span></p></div>');
        });

        it('should render document consists of one-line link', () => {
            const input = '[hello](http://hello.world)';
            const html = renderHTML(input);

            expect(html).toBe('<div><p><a href="http://hello.world">hello</a></p></div>');
        });

        it('should render document consists of one-line header', () => {
            const input = '### hello';
            const html = renderHTML(input);

            expect(html).toBe('<div><h3><span>hello</span></h3></div>');
        });

        it('should render document consists of list', () => {
            const input = '- item';
            const html = renderHTML(input);

            expect(html).toBe('<div><ul><li><span>item</span></li></ul></div>');
        });
    });

    describe('more realistic cases', () => {
        it('should render document consists of header and paragraph with link', () => {
            const input = `## header

this is paragraph. link is [here](http://example.com).

- item1
- item2
- item3

#### header2`;
            const html = renderHTML(input);

            expect(html).toBe(
                '<div><h2><span>header</span></h2>' +
                '<p></p>' +
                '<p><span>this is paragraph. link is </span><a href="http://example.com">here</a><span>.</span></p>' +
                '<p></p>' +
                '<ul><li><span>item1</span></li>' +
                '<li><span>item2</span></li>' +
                '<li><span>item3</span></li></ul>' +
                '<p></p>' +
                '<h4><span>header2</span></h4></div>');
        });
    });
});

const renderHTML = (input: string): string => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const document = parser.parseDocument();

    const renderer = new Renderer(document);

    return renderer.renderHTML();
};
