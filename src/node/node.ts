import {Token} from '../token/token';

export type Node = Line | Inline;

// Line nodes
export type Line = Paragraph | Header;

export class Paragraph {
  public nodeType: 'PARAGRAPH';
  public inlines: Inline[];
}

export class Header {
  public nodeType: 'HEADER';
  public inlines: Inline[];
  public numHashes: number;
}

// Inline nodes
export type Inline = Text | Link;

export class Text {
  public nodeType: 'TEXT';
  public text: string;
}

export class Link {
  public nodeType: 'LINK';
  public text: string;
  public href: string;
}
