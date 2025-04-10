/** Хранение данных о выходных днях в годах */
/** @TODO упорядочить загрузку и хранение данных о выходных днях  */
minifyTerserAddToPageAndGlobalVar(() => {
    var Days = {
        data: {}, // праздничные дни ... 2023: [2, 3, 4, 5, 6, 54, 55, 67, 121, 128, 129, 163, 310]
        // конвертация символов из одной с.с. в другую (устойчиво работает до основания 366), value - строка
        convertBase: (value, from_base, to_base) => {
            var gen = (from, to) => Array(to - from + 1).fill(from).map((v, i) => v + i), // генерация последовательностей
                range = (len => { for (var r = [], i = 48; r.length < len; i++) { if ([...gen(60, 63), ...gen(92, 96), ...gen(123, 191), 215, 305, 383, 388, 397, 422, 423, 439, 444, 445, 448, 451].includes(i)) continue; r.push(String.fromCharCode(i)); } return r; })(Math.max(from_base, to_base)),
                from_range = range.slice(0, from_base);
                to_range = range.slice(0, to_base);
                dec_value = value.split('').reverse().reduce((carry, digit, index) => carry += from_range.indexOf(digit) * (Math.pow(from_base, index)), 0);
                new_value = '';
            while (dec_value > 0) {
              new_value = to_range[dec_value % to_base] + new_value;
              dec_value = (dec_value - (dec_value % to_base)) / to_base;
            }
            return new_value || '0';
        },
        load: data => { // загрузка данных
            data = JSON.parse(data);
            var weekdays = "вс,пн,вт,ср,чт,пт,сб".split(","),
                months = "Январь,Февраль,Март,Апрель,Май,Июнь,Июль,Август,Сентябрь,Октябрь,Ноябрь,Декабрь".split(",");
            for (var m of data) { // массивы годов
                m = m.map(v => +Days.convertBase(v, 366, 10));
                var year = m[0],
                    weekNumber = 0;
                Days.data[year] = [year];
                Days.data[year].months = [];
                for (var currentDate = new Date(year, 0, 1), i = 1; currentDate.getFullYear() == year; currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1)), i++) {
                    const rusDate = currentDate.toLocaleString().split(",")[0],
                          indexMonth = currentDate.getMonth(),
                          indexDay = i;
                    Days.data[rusDate] = {
                        rus: rusDate, // день в формате 01.01.2023
                        date: new Date(currentDate), // день в формате объекта даты
                        day: indexDay, // день по счету в году
                        dayMonth: currentDate.getDate(), // день по счету в месяце
                        weekday: weekdays[currentDate.getDay()], // название дня недели
                        weekdayIndex: currentDate.getDay() || 7, // индекс дня недели по порядку 1-7
                        get weekend() { return ["сб", "вс"].includes(this.weekday) || m.includes(indexDay); }, // выходной или праздничный день
                        weekNumber: weekNumber, // номер недели с начала года
                        get weekNumberInMonth() { // номер недели с начала месяца
                            var number = 1;
                            for (const d of this.month.days) {
                                if (d.weekday == "пн" && d != d.month.firstDay()) number++;
                                if (d.rus == this.rus) return number;
                            }
                            return undefined;
                        },
                        nextDay() { // следующий день
                            var nextDate = new Date(this.date);
                            nextDate.setDate(this.date.getDate() + 1);
                            if (nextDate.getFullYear() == this.date.getFullYear()) return Days.data[nextDate.toLocaleString().split(",")[0]];
                            return undefined;
                        },
                        newWeek() { // новая неделя
                            var nextDate = new Date(this.date);
                            nextDate.setDate(this.date.getDate() + 8 - (this.date.getDay() || 7));
                            if (nextDate.getFullYear() == this.date.getFullYear()) return Days.data[nextDate.toLocaleString().split(",")[0]];
                            return undefined;
                        },
                        newMonth() { // новый месяц
                            var nextDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
                            if (nextDate.getFullYear() == this.date.getFullYear()) return Days.data[nextDate.toLocaleString().split(",")[0]];
                            return undefined;
                        },
                        getDays(count) { // возвращает выбранное количество следующих дней по порядку
                            for (var result = [], nextDate = Days.data[this.rus]; count > 0; count--) {
                                if (nextDate && nextDate.date.getFullYear() == this.date.getFullYear()) result.push(nextDate);
                                else break;
                                nextDate = nextDate.nextDay();
                            }
                            return result;
                        }
                    };
                    if (Days.data[rusDate].weekday == "вс") weekNumber++;
                    Days.data[year].push(Days.data[rusDate]); // добавляем дни в массив объекта года
                    if (!Days.data[year].months[indexMonth]) Days.data[year].months[indexMonth] = {
                        name: months[indexMonth], // представление месяца
                        index: indexMonth, // индекс месяца по счету
                        days: [], // дни месяца
                        firstDay() { return this.days[0]; }, // первый день месяца
                        lastDay() { return this.days[this.daysCount - 1]; }, // последний день месяца
                        get daysCount() { return this.days.length; }, // количество дней в месяце
                        get weeksCount() { return this.days.reduce((a, b) => a += b.weekday == "пн" && b != b.month.firstDay(), 1); } // количество недель в месяце
                    };
                    Days.data[year].months[indexMonth].days.push(Days.data[rusDate]); // добавляем дни в месяца в массиве объекта года
                    Days.data[rusDate].month = Days.data[year].months[indexMonth]; // делаем ссылку на месяц
                }
            }
        },
        toJSON: () => Object.values(Days.data).filter(v => v instanceof Array).map(m => m.filter(d => !d.day || (d.weekend && !["сб", "вс"].includes(d.weekday))).map(d => Days.convertBase((d.day || d) + "", 10, 366)))
    }
    Days.load(days); // загружаем данные
});