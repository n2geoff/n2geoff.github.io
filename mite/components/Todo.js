import { h } from "../js/mite.min.js";

export const Todo = ({state,update}) => {

    const add = () => {
        if (!state.draftText.trim()) return;
        const newTodo = { id: Date.now(),text: state.draftText,done: false };
        update({ todos: [...state.todos,newTodo],draftText: "" });
    };

    const toggle = (id) => {
        const todos = state.todos.map(t =>
            t.id === id ? { ...t,done: !t.done } : t
        );
        update({ todos });
    };

    const del = (id) => {
        update({ todos: state.todos.filter(t => t.id !== id) });
    };

    return h('article',{ }, [
        h("header", {}, [
            h('h3',{},'Todos'),
            h("em", {}, "got to have a todo example, right?")
        ]),

        h('div',{ role: 'group' },
            h('input',{
                type: 'text',
                placeholder: 'What needs doing?',
                value: state.draftText || "",
                oninput: (e) => update({ draftText: e.target.value }),
                onkeyup: (e) => e.key === 'Enter' && add()
            }),
            h('button',{ onclick: add },'Add')
        ),

        // List Area
        h('div',{ style: {"listStyle": "none"}},
            state.todos.map(todo => h('div',{}, [
                h("div", {role: "group"}, [
                    h('input', {
                        style: `margin: auto auto;
                                width: 5rem;
                                height: 3rem;`,
                        type: 'checkbox',
                        checked: todo.done,
                        onchange: () => toggle(todo.id)
                    }),
                    h('input',{ value: todo.text,readonly: true,style: `text-decoration: ${ todo.done ? 'line-through' : 'none' }`}),
                    h('button',{ style:"width: 5rem", onclick: () => del(todo.id) },'×')
                ])
            ]))
        )
    ]);
};