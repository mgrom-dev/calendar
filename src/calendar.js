/** Модуль календаря, создание, навигация по ячейкам, обновление информации */
minifyTerserAddToPageAndGlobalVar(() => {
    var Calendar = {
        cells: {},
        createTableYear(year) { // создание таблицы с календарем, если год не задан, то берется текущий год.
            if (!year) year = new Date().getFullYear(); // получаем текущий год
            this.cells = {};
            $("#months > tbody")[0].innerHTML = "";
            if (!Days.data[year]) Days.load([[Days.convertBase(year + "", 10, 366)]]); // если нет в сохраненных данных текущего года, создаем по умолчанию
            for (var i = 0; i < 4; i++) // подготавливаем строки под месяца
                $("#months > tbody").append(`<tr class="row"><td></td><td></td><td></td></tr>`);
            Days.data[year].months.forEach(m => { // подготавливаем месяцы
                var rows = "пн,вт,ср,чт,пт,сб,вс".split(",").map(w => `<tr><th${w == 'сб' || w == 'вс' ? ' class="weekend"' : ''}>${w}</th>${new Array(m.weeksCount).fill("<td></td>").join("")}</tr>`); // подготовливаем строки таблицы месяца
                $(`#months > tbody > tr:nth-child(${~~(m.index / 3) + 1}) > td:nth-child(${m.index % 3 + 1})`). // добавляем таблицу месяца
                    append(`<table class="cal m${m.index + 1}"><tbody><tr><th colspan="100%">${m.name}</th></tr>${rows.join("")}</tbody></table>`);
            });
            Days.data[year].forEach(d => { // создаем календарь на основе данных о выходных днях в базе
                if (!d.month) return;
                const getWeekDayIndex = day => "0,1,пн,вт,ср,чт,пт,сб,вс".split(",").indexOf(day), // определения индекса дня недели
                      day = +d.rus.split(".")[0],
                      td = $(`table.cal.m${d.month.index + 1} > tbody > tr:nth-child(${getWeekDayIndex(d.weekday)}) > td:nth-child(${d.weekNumberInMonth + 1})`); // получаем нужную ячейку
                td.append(day + "");
                td[0].classList.add("note-day");
                if (d.weekend) td[0].classList.add("weekend");
                this.cells[d.rus] = td[0];
                td[0].addEventListener('click', e => showTasksDay(e, d.rus)); // привязываем событие показа формы редактирования задач на день
            });
            this.cells[new Date().toLocaleString().split(",")[0]].classList.add("today"); // подсвечивание текущего дня
        },
        refreshDay(date) { // обновление количества задач в ячейки дня
            let tasks = Tasks.getByDate(date),
                tasksFinished = tasks.filter(t => t.dates[date].status == "done").length,
                tdDay = this.cells[date],
                sTaskF = tdDay.querySelector(".finished") || tdDay.insertAdjacentHTML("beforeend", `<span class="finished"></span>`) || tdDay.querySelector(".finished"),
                sTask = tdDay.querySelector(".task") || tdDay.insertAdjacentHTML("beforeend", `<span class="task"></span>`) || tdDay.querySelector(".task");
            sTask.innerHTML = (tasks.length - tasksFinished) || "";
            sTaskF.innerHTML = tasksFinished || "";
        },
        refreshCalendar() { // обновление всего календаря
            Object.keys(this.cells).forEach(k => Tasks.getByDate(k).length && this.refreshDay(k));
        }
    }
    Calendar.createTableYear();
});