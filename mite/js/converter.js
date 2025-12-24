/**
 * Converts a string of HTML into mite-compatible h() syntax
 */
export const htmlToH = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString.trim(),'text/html');
    const root = doc.body.firstChild;

    const serialize = (node) => {
        // Handle Text Nodes
        if (node.nodeType === 3) {
            const text = node.nodeValue.trim();
            return text ? `'${text}'` : null;
        }

        // Handle Elements
        if (node.nodeType === 1) {
            const tag = node.tagName.toLowerCase();

            // Extract attributes into an object
            const attrs = {};
            Array.from(node.attributes).forEach(attr => {
                attrs[attr.name] = attr.value;
            });

            const propsStr = Object.keys(attrs).length > 0
                ? JSON.stringify(attrs,null,2).replace(/"([^"]+)":/g,'$1:')
                : 'null';

            // Process Children
            const children = Array.from(node.childNodes)
                .map(serialize)
                .filter(Boolean);

            const childrenStr = children.length > 0
                ? `[\n    ${children.join(',\n    ').replace(/\n/g,'\n    ')}\n  ]`
                : '[]';

            return `h('${tag}', ${propsStr}, ${childrenStr})`;
        }
        return null;
    };

    return serialize(root);
};
