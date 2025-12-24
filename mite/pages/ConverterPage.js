import {h} from "../js/mite.min.js";
import { htmlToH } from "../js/converter.js";

export const TranspilerTool = (state,update) => {

    const handleConvert = () => {
        const input = document.getElementById('html-input').value;
        const code = htmlToH(input);
        update({
            rawHtml: input,
            convertedCode: code
        });
    };

    const handleReset = () => {
        update({ rawHtml: '',convertedCode: '' });
        document.getElementById('html-input').value = '';
    };

    const copyToClipboard = () => {
        if (!state.convertedCode) return;
        navigator.clipboard.writeText(state.convertedCode).then(() => {
            alert("Code copied!");
        });
    };

    // Prepare Live Preview VNode
    let previewContent = h('p',{ style: 'color: var(--pico-muted-color); text-align: center;' },'Renders will appear here after conversion.');

    if (state.convertedCode) {
        try {
            // Execute the string to get a real VNode object
            const generatedVNode = new Function('h',`return ${state.convertedCode}`)(h);
            previewContent = generatedVNode;
        } catch (e) {
            previewContent = h('p',{ style: 'color: var(--pico-error-color)' },'Execution Error: Check for unclosed tags or invalid HTML.');
        }
    }

    return h('div',{ class: 'grid' },[
            h('div',{},[
                h('article',{},[
                    h('header',{},[h('strong',{},'HTML Source')]),
                    h('textarea',{
                        id: 'html-input',
                        placeholder: '<section>...</section>',
                        rows: '10',
                        style: 'font-family: monospace;'
                    },[]),
                    h('footer',{},[
                        h('div',{ class: 'grid' },[
                            h('button',{ onclick: handleConvert },[
                                h("i",{ class: "ft-package" }),
                                h("span","Convert")
                            ]),
                        ]),
                        h("br"),
                        h('div',{ class: 'grid' },[
                            h('button',{ class: 'secondary',onclick: copyToClipboard,disabled: !state.convertedCode }, [
                                h("i", {class: "ft-copy"}),
                                h("span", "Copy")
                            ]),
                            h('button',{ class: 'outline contrast',onclick: handleReset },[
                                h("i",{ class: "ft-refresh-cw" }),
                                h("span", "Reset")
                            ])
                        ]),

                    ])
                ]),

                state.convertedCode ? h('article',{},[
                    h('header',{},[h('strong',{},'Mite.js Syntax')]),
                    h('pre',{ style: 'font-size: 0.75rem; background: #1e2227;' },[
                        h('code',{},state.convertedCode)
                    ])
                ]) : null
            ]),

            // Right Column: Live Render
            h('div',{},[
                h('article',{ style: 'min-height: 500px;' },[
                    h('header',{},[h('strong',{},'Live Visual Preview')]),
                    h('div',{ id: 'preview-sandbox' },[
                        previewContent
                    ])
                ])
            ])
        ])
};