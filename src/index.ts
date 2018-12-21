import { Lexer } from './lexer/lexer';
import { Parser } from './parser/parser';
import { Renderer } from './renderer/renderer';

export const render = (md: string): string => {
    const lexer = new Lexer(md);
    const parser = new Parser(lexer);

    const document = parser.parseDocument();

    const renderer = new Renderer(document);

    return renderer.renderHTML();
};
