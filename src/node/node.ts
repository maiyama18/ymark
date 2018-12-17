export type Node = Line | Inline;

// Line nodes
export type Line = Paragraph | Header;

export class Paragraph {
  public readonly nodeType = 'PARAGRAPH';
  public inlines: Inline[];

  constructor(inlines?: Inline[]) {
    this.inlines = inlines || [];
  }
}

export class Header {
  public readonly nodeType = 'HEADER';
  public numHashes: number;
  public inlines: Inline[];

  constructor(numHashes: number, inlines?: Inline[]) {
    this.numHashes = numHashes;
    this.inlines = inlines || [];
  }
}

// Inline nodes
export type Inline = Text | Link;

export class Text {
  public readonly nodeType = 'TEXT';
  public text: string;

  constructor(text?: string) {
    this.text = text || '';
  }
}

export class Link {
  public readonly nodeType = 'LINK';
  public text: string;
  public href: string;

  constructor(text?: string, href?: string) {
    this.text = text || '';
    this.href = href || '';
  }
}
