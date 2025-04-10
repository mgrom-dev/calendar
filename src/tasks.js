/**
 * @todo Не оптимизированный скрипт, по возможности разобраться с ним
 * не работает изменение заголовка при изменение статуса модификации данных
  */
minifyTerserAddToPageAndGlobalVar(() => {
    /** Глобальная переменная для хранения всех данных о задачах */
    var Tasks = {
        data: [], // массив задач
        _modify: false, // флаг изменения данных задач с момента последнего сохранения / загрузкиъ
        set modify(v) {
            this._modify = v;
            document.title = (v ? "* " : "") + document.title.replace(/\* /, '');
        },
        get modify() { return this._modify; },
        Task: class { // объект - задача
            static REPEAT = "no,day,week,month,quarter".split(",");
            constructor(date, description, repeat) {
                this.dates = {
                    add: (date, status) => { // добавление новой даты
                        var dateRus; // дата в Российском формате текстом
                        if (typeof(date) == "string") { // дата передана в формате 27.01.2023
                            var [d, m, y] = date.split(".").map(v => +v);
                            dateRus = date;
                            date = new Date(y, m - 1, d);
                        } else if (date instanceof Date) { // дата передана в формате класса Даты
                            date.setHours(0, 0, 0, 0);
                            dateRus = date.toLocaleString().split(",")[0];
                        } else if (date instanceof Object && (Object.values(date)[0] == "done" || Object.values(date)[0] == "notDone")) { // массив
                            var last;
                            for (const d in date) last = this.dates.add(d, date[d]);
                            return last;
                        }
                        this.dates[dateRus] = {
                            status: status || "notDone", // корректировка статуса
                            dateRus: dateRus,
                            date: date,
                            setStatus(value) { this.status = value; Tasks.modify = true; }, // изменение статуса
                            remove: () => { // удаление данных
                                delete this.dates[dateRus];
                                if (!Object.values(this.dates).some(v => typeof(v) == "object")) { // дат в задаче больше не осталось, можно удалять
                                    Tasks.data.splice(Tasks.data.findIndex(t => t == this), 1);
                                }
                                Tasks.modify = true;
                            },
                            toJSON() { return this.status; } // выгрузка данных
                        };
                        return this;
                    },
                    toJSON: () => {
                        const json = {};
                        for (const d in this.dates) if ("status" in this.dates[d]) json[d] = this.dates[d].status;
                        return json;
                    }
                };
                this.dates.add(date);
                this.description = description || "";
                this.setDescription = function (value) {
                    this.description = value;
                    Tasks.modify = true;
                };
                this.repeat = Tasks.Task.REPEAT[Tasks.Task.REPEAT.indexOf(repeat)] || Tasks.Task.REPEAT[0];
                this.setRepeat = function (value, date) {
                    var [d, m, y] = date.split(".").map(n => +n),
                        dateObj = new Date(y, --m, d), // переводим текстовую дату в объект даты
                        day = Days.data[date]; // получаем объект дня из модуля days
                    if (value == "no") { // нет повтора
                        Object.values(this.dates).forEach(v => v.date > dateObj && v.remove()); // убираем более поздние даты
                    }
                    else if (value == "day") { // повтор каждый день
                        while(day = day.nextDay()) {
                            if (day.weekend) continue;
                            this.dates.add(day.rus);
                            Calendar.refreshCalendar(day.rus);
                        }
                    }
                    else if (value == "week") { // повтор каждую неделю
                        var mweight = new Array(5).fill(day.weekdayIndex).map((n, i) => i < n ? 7 - n + i + 1 : 7 - i); // массив весов для дней недели
                        while(day = day.newWeek()) {
                            var days = day.getDays(7).filter(d => !d.weekend).map(d => ({day: d, weight: mweight[d.weekdayIndex - 1]})).sort((a, b) => b.weight - a.weight);
                            if (!days.length) continue;
                            this.dates.add(days[0].day.rus);
                            Calendar.refreshCalendar(days[0].day.rus);
                        }
                    }
                    else if (value == "month") { // повтор каждый месяц
                        var dayIndex = day.dayMonth;
                        while(day = day.newMonth()) {
                            var days = day.getDays(day.month.daysCount).filter(d => !d.weekend).map(d => ({day: d, weight: d.dayMonth <= dayIndex ? day.month.daysCount - dayIndex + d.dayMonth + 1 : day.month.daysCount - d.dayMonth})).sort((a, b) => b.weight - a.weight);
                            if (!days.length) continue;
                            this.dates.add(days[0].day.rus);
                            Calendar.refreshCalendar(days[0].day.rus);
                        }
                    }
                    else if (value == "quarter") { // повтор каждый квартал
                        var dayIndex = day.dayMonth;
                        while(day = day.newMonth()?.newMonth()?.newMonth()) {
                            var days = day.getDays(day.month.daysCount).filter(d => !d.weekend).map(d => ({day: d, weight: d.dayMonth <= dayIndex ? day.month.daysCount - dayIndex + d.dayMonth + 1 : day.month.daysCount - d.dayMonth})).sort((a, b) => b.weight - a.weight);
                            if (!days.length) continue;
                            this.dates.add(days[0].day.rus);
                            Calendar.refreshCalendar(days[0].day.rus);
                        }
                    }
                    else throw "Ошибка. Неизвестная периодичность повтора"
                    this.repeat = value;
                    Tasks.modify = true;
                };
                Tasks.data.push(this);
            }
        },
        toJSON: () => Tasks.data,
        getByDate(date) { return this.data.filter(t => t.dates[date]); }, // получение списка задач по дате
        add: (...param) => new Tasks.Task(...param), // добавление новой задачи decription
        load(data) { JSON.parse(data).forEach(t => this.add(t.dates, t.description, t.repeat)); } // загрузка данных, data в формате строки
    }
    Tasks.load(tasks);
    Calendar.refreshCalendar();
});