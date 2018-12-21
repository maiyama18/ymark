import { Document, Line } from '../node/node';

export class Renderer {
    public document: Document;

    constructor(document: Document) {
        this.document = document;
    }

    public renderHTML(): string {
        let content = '';
        for (const line of this.document.lines) {
            content += this.renderLine(line);
        }

        return `<div>${content}</div>`;
    }

    private renderLine(line: Line): string {
        let content = '';
        for (const inline of line.inlines) {
            content += inline.html();
        }

        let wrapper;
        switch (line.nodeType) {
            case 'HEADER':
                wrapper = `h${line.numHashes}`;
                break;
            default:
                wrapper = `p`;
                break;
        }

        return `<${wrapper}>${content}</${wrapper}>`;
    }
}
