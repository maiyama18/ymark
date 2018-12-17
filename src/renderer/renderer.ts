import { Document } from '../node/node';

export class Renderer {
  public document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  public render(): string {
    return '<div></div>';
  }
}
