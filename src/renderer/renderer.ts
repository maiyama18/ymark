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

        let preTag;
        let postTag;
        switch (line.nodeType) {
            case 'HEADER':
                preTag = `<h${line.numHashes}>`;
                postTag = `</h${line.numHashes}>`;
                break;
            case 'LIST':
                preTag = `${line.isFirst ? '<ul><li>' : '<li>'}`;
                postTag = `${line.isLast ? '</li></ul>' : '</li>'}`;
                break;
            default: // PARAGRAPH
                preTag = `<p>`;
                postTag = `</p>`;
                break;
        }

        return `${preTag}${content}${postTag}`;
    }
}
