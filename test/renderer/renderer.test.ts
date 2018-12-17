import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import {Renderer} from '../../src/renderer/renderer';

describe('renderer', () => {
  describe('simple cases', () => {
    it('should render empty document', () => {
      const input = '';
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const document = parser.parseDocument();

      const renderer = new Renderer(document);
      expect(renderer.render()).toBe('<div></div>');
    });
  });
});
