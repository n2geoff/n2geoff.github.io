import {h} from "../js/mite.full.min.js";

export const Counter = (state,update) => h('article',{ style: {}}, [
    h("header", {}, [
        h("h3", {}, "Counter"),
        h("em", {}, "The quinisential counter example")
    ]),
    h("div",{},`Count: ${state.count}`),
    h("footer", {class: "grid"}, [
        h('button',{ onclick: () => update({ count: state.count + 1 }) },'Increment'),
        h('button',{ class: "secondary", onclick: () => update({ count: 0 }) },'Reset'),
    ])
]);
