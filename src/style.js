
/** Таблица стилей
 * Minified tool using https://css-minifier.com/ 
                        https://cssminifier.org/ */
dataStyle = `
body {
    text-align: center;
}
table {
    border-collapse: collapse;
    border: 1px solid grey;
    display: inline-block;
    user-select: none;
}
th, td {
    border: 1px solid grey;
    padding: 5px 10px;
}
#months, #months .row > td {
    border: none;
}
.weekend {
    color: red;
}
tr.row > td {
    text-align: center;
}
.cal {
    table-layout: fixed;
    text-align: center;
}
table.cal tr {
    height: 35px;
}
.cal td, .cal th {
    width: 14px;
    max-width: 14px;
}
.calc-weekend, .tasks-day {
    position: fixed;
    padding-top: 5px;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: #878d88eb;
}
.tasks-date {
    text-decoration: underline 2px;
    font-weight: bold;
}
.close-tasks {
    cursor: pointer;
    padding-left: 5px;
    display: inline-block;
}
.close-tasks:hover {
    text-shadow: 1px 1px 5px #006c8d;
    font-size: large;
    animation: spin 2s linear infinite;
    animation-direction: alternate;
}
@keyframes spin {
    0%, 30% {
        transform: rotate(0deg);
    }
    70%, 100% {
        transform: rotate(180deg);
        translate: 5px 5px;
    }
}
.tasks-day .done {
    color: yellowgreen;
}
.tasks-day .delete {
    color: darkred;
}
.tasks-day .description {
    padding: 3px;
}
.tasks-day .delete:hover, .tasks-day span.done:hover {
    animation: looping 0.5s linear infinite;
    animation-direction: alternate;
}
.tasks-day .delete.pushed {
    animation: none;
    color: #e90707;
    transform: scale(1.3, 1.3);
    translate: 0px -1px;
}
.tasks-day .delete, .tasks-day span.done {
    font-weight: bold;
    margin-left: 5px;
    cursor: pointer;
    display: inline-block;
    user-select: none;
}
.tasks-day .num {
    margin-right: 3px;
}
.tasks-day > .tasks > div.done {
    color: yellowgreen;
    text-decoration: line-through;
}
.tasks-day > div.done span.done {
    color: black;
}
@keyframes looping {
    50% {
        transform: scale(1.2, 1.2);
    }
}
.tasks-day .add > strong {
    cursor: pointer;
    text-shadow: 1px 1px 1px black;
}
.tasks-day .add::before {
    content: '';
    position: absolute;
    z-index: -2;
    width: 20px;
    height: 20px;
    border-radius: 35px;
    translate: -5px -1px;
    background-color: #BFE2FF;
    background-repeat: no-repeat;
    background-size: 50% 50%, 50% 50%;
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    background-image: linear-gradient(#e7e209, #e7e209), linear-gradient(#33b76a, #33b76a), linear-gradient(#e7e209, #e7e209), linear-gradient(#33b76a, #33b76a);
    animation: circle 2s linear infinite;
}
.tasks-day .add::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 13px;
    height: 13px;
    background: #909691;
    border-radius: 5px;
    translate: -11px 2px;
}
@keyframes circle {
    100% {
        transform: rotate(1turn);
    }
}
.days-weekend {
    width: 3em;
}
.add-weekend, .remove-weekend {
    padding-left: 5px;
    font-weight: bold;
    cursor: pointer;
}
.add-weekend:hover, .remove-weekend:hover, .massive-weekend:hover, .close-weekend:hover {
    -webkit-text-stroke-width: 1px;
    text-shadow: 0 0 5px #00ff2b;
}
.note-day {
    cursor: pointer;
}
.task {
    display: block;
    translate: -7px -26px;
    font-size: small;
    text-decoration: underline;
    color: crimson;
    font-weight: bold;
    position: absolute;
}
.finished {
    position: absolute;
    display: block;
    translate: 17px -25px;
    font-size: small;
    text-decoration: line-through;
    color: yellowgreen;
    font-weight: bold;
    background: green;
    border-radius: 6px;
}
.note-day:hover {
    -webkit-text-stroke-width: 1px;
    text-shadow: 0 0 5px #00ccff;
}
.massive-weekend {
    position: relative;
    top: 5px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
}
.close-weekend {
    margin-bottom: 5px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
}
.result-weekend {
    margin-top: 10px;
}
.get-code-calendar {
    position: fixed;
    left: 10px;
    top: 5px;
    cursor: pointer;
}
.save-to-file {
    position: fixed;
    left: 98%;
    top: 4px;
    cursor: pointer;
}
.save-to-file.data:hover {
    background: radial-gradient(#ce0f0f, #00000003);
}
.save-to-file:hover {
    font-size: 24px;
    translate: -7px 0px;
    background: radial-gradient(#2175e9, #00000003);
    border-radius: 10px;
}
.today {
    background: radial-gradient(#e5e486f5, #055a2773);
    border-radius: 14px;
}
.select.repeat {
    position: relative;
    display: inline-block;
    left: 5px;
    top: -1px;
}    
.select.repeat select {
    font-family: 'Arial';
    display: inline-block;
    width: 100%;
    cursor: pointer;
    padding: 3px 9px;
    outline: 0;
    border: 0px solid #000000;
    border-radius: 6px;
    background: #e6e6e6;
    color: #7b7b7b;
    appearance: none;
}
.select.repeat select:hover,
.select.repeat select:focus {
    color: #000000;
    background: #cccccc;
}
.select_arrow {
    position: absolute;
    top: 5px;
    right: 7px;
    width: 0px;
    height: 0px;
    border: solid #7b7b7b;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
}
.select.repeat select:hover ~ .select_arrow,
.select.repeat select:focus ~ .select_arrow {
    border-color: #000000;
}
`;

/**
 * @todo добавить минификацию стилей, перед сжатием и сохранением в глобальную переменную
 */
document.head.insertAdjacentElement('beforeend', Object.assign(document.createElement('link'), { // добавляем стили на страницу
    charset: 'utf-8',
    rel: 'stylesheet',
    href: URL.createObjectURL(new Blob([dataStyle], { type: 'text/css' }))
}));
dataStyle = zip.encrypt(dataStyle); // сжимаем и запоминаем стили в глобальной переменной