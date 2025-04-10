/** Инициализация для работы скриптов */
function init() {
    /**
     * Функция zip - Сжатие данных с кодировкой для любого текста
     */
    function zip() {
        const SDICTB = []; // 255 символов юникода для кодировки в битах
        for (i = 48; SDICTB.length <= 255; i++) // заполняем таблицу символов юникода
            if (i == 60) i = 63;
            else if (i == 92) i = 96;
            else if (i == 123) i = 191;
            else if (i == 215 || i == 305) continue;
            else SDICTB.push(String.fromCharCode(i));
        
        /**
         * Функция encryptTable сжатие таблицы уникальных символов входной строки в строку
         * команды (первые 2 бита): прибавить единицы - 01, прибавить сотни - 10, умножить - 11, идет последовательность - 00
         * максимальное значение указателя - 63
         * @param {Object[]} table - table - таблица с уникальными символами и кодами
         * @returns {String} возвращает строку сжатой таблицы символов
         */
        function encryptTable(table) {
            if (!table || typeof(table) != "object") return console.log("Ошибка! Неправильно передана таблица");
            var i, repeat = 0, result = "", num = 0;
            for (i = table.length - 1; i >= 0; i--) {
                var code = table[i].code; // код UTF символа
                if (num == 0) { // первый символ в таблице символов
                    if (code >= 255 || code == 0) return console.log("Ошибка! Непредсказуемый первый символ");
                    num = code;
                    result += SDICTB[code];
                } else if (code - 1 == table[i + 1].code) {
                    repeat++;
                    if (repeat > 62) {
                        num += repeat;
                        result += SDICTB[63];
                        repeat = 0;
                    }
                } else {
                    if (repeat > 0) { // последовательность больше 0
                        num += repeat;
                        result += SDICTB[repeat];
                        repeat = 0;
                    }
                    while(code - num >  1) {
                        if (~~(code / num) > 1 && num > 100) { // следующий код больше в несколько раз
                            var mult = ~~(code / num);
                            if (mult > 63) mult = 63;
                            num *= mult;
                            result += SDICTB[(3 << 6) + mult];
                        }
                        if (code - num > 100) { // следующий код больше минимум на 100
                            var p100 = ~~((code - num) / 100);
                            if (p100 > 63) p100 = 63;
                            num += p100 * 100;
                            result += SDICTB[(2 << 6) + p100];
                        }
                        if (code - num > 1 && code - num <= 100) { // следующий код больше единицы
                            var ones = code - num - 1;
                            if (ones > 63) ones = 63;
                            num += ones;
                            result += SDICTB[(1 << 6) + ones];
                        }
                    }
                    if (code - num == 1) repeat++;
                }
            }
            return result + SDICTB[repeat] + SDICTB[0];
        }
    
        /**
         * Функция decryptTable распаковка исходной таблицы уникальных символов в массив объектов
         * @param {String} str - str - запакованная строка
         * @returns {Object[]} возвращает таблицу уникальных символов в виде массива объектов и номер индекса конца таблицы
         */
        function decryptTable(str) {
            if (!str || typeof(str) != "string") return console.log("Ошибка! Неправильно передана строка");
            var i, result = [], num = 0;
            for (i = 0; i < str.length; i++) {
                var code = SDICTB.indexOf(str[i]); // зашифрованный код
                if (code == -1) return console.log("Ошибка! Непредсказуемый символ в исходной строке");
                if (num == 0) { // первый символ в таблице символов
                    num = code;
                    result.push(code);
                } else if ((code >> 6) == 3) num *= code ^ (3 << 6);
                else if ((code >> 6) == 2) num += (code ^ (2 << 6)) * 100;
                else if ((code >> 6) == 1) num += code ^ (1 << 6);
                else if (code > 0) for ( ; code > 0; code--) {num++; result.push(num);}
                else break; // конец таблицы символов, код 0
            }
            return [result.reverse().map((s, i) => ({symb: String.fromCharCode(s), code: s, sdict: SDICTB[i], dex: i})), i];
        }
    
        /**
         * Функция toR255 переводит number в 255 с.с. в соответствии с таблицей символов кодировки UTF
         * @param {number} number - number - исходное число
         * @param {boolean} maybeNegative - maybeNegative - число со знаком true/false, правый бит 1 - минус, 0 - плюс
         * @returns {String} возвращает строку, число в 255 с.с.
         */
        function toR255(number, maybeNegative) {
            var i, result = "", bin = Math.abs(number).toString(2);
            if (maybeNegative || number < 0) {
                if (number < 0) bin += "1";
                else bin += "0";
            }
            for (i = bin.length; i > 0; i -= 8) result = SDICTB[Number("0b" + bin.substring(i - 8, i))] + result;
            return result;
        }
    
        /**
         * Функция fromR255 переводит стркоу из 255 с.с. в соответствии с таблицей символов кодировки UTF, в 10 с.с.
         * @param {String} str - str - строка в 255 с.с.
         * @param {boolean} maybeNegative - maybeNegative - число со знаком true/false, правый бит 1 - минус, 0 - плюс
         * @returns {number} возвращает число в 10 с.с.
         */
        function fromR255(str, maybeNegative) {
            var i, bin = "0b", negative = false;
            for (i = 0; i < str.length; i++) {
                var bn = SDICTB.indexOf(str[i]).toString(2);
                bin += "0".repeat(8 - bn.length) + bn;
            }
            if (maybeNegative) {
                negative = bin.slice(-1) == "1" ? true : false;
                bin = bin.substring(0, bin.length - 1) + (str == "0" ? "0" : ""); // заглушка, если нулевое смещение
            }
            return Number(bin) * (negative ? -1 : 1);
        }
    
        /**
         * Функция encrypt сжатие строки
         * повторяющиеся строки, старшие биты 1111, правые биты, первые 2 - длина строки, вторые 2 - смещение. Максимум 4 байта, если больше то возврат ошибка]
         * @param {String} str - любая строка
         */
        function encrypt(str) {
            var i, base = 4, // base - минимальное количество символов для совпадения
                sourceSymb = (() => { // уникальные символы исходной строки
                    var i, symbs = {}, // уникальные символы
                        result = []; // остортированный массив уникальных символов по убыванию кода символа
                    for (i = 0; i < str.length; i++) symbs[str[i]] = symbs[str[i]] ? symbs[str[i]] + 1 : 1;
                    for (i in symbs) result.push({symb: i, count: symbs[i], code: i.charCodeAt(0)});
                    if (result.length > SDICTB.length - 15 || !result.length) return console.log("Ошибка! Слишком много уникальных символов в входных данных для сжатия строки");
                    return result.sort((s1, s2) => s2.code - s1.code).map((s, i) => (s.sdict = SDICTB[i], s.dex = i, s));
                })(),
                getCodeBySymbol = symbol => sourceSymb.find(item => item.symb == symbol).sdict, // поиск кода символа в таблице
                zipTable = encryptTable(sourceSymb), // сжимаем таблицу символов входного текста
                matches = [], // массив с данными по совпадениям
                result = zipTable; // сжатая строка
            if (!sourceSymb || !zipTable) return ;
            for (i = 0; i < str.length; i++) {
                var key = str.substring(i, i + base), // искомая подстрока
                    dict = str.substring(0, i), // строка в которой будет вестись поиск подстроки
                    matchIndex = dict.lastIndexOf(key); // ищем совпадение с конца строки
                if (matchIndex != -1 && key.length >= base) { // совпадение найдено
                    while (i + key.length < str.length) { // пытаемся увеличить длину ключа
                        if (dict.lastIndexOf(str.substring(i, i + key.length + 1)) != -1) {
                            key = str.substring(i, i + key.length + 1);
                            matchIndex = dict.lastIndexOf(key);
                        }
                        else break;
                    }
                    var index = i - matchIndex > matchIndex ? matchIndex : (i - matchIndex) * -1,
                        len255R = toR255(key.length), // длина повтора в 255 с.с.
                        index255R = toR255(index, true); // индекс смещения в 255 с.с.
                    if (len255R.length + index255R.length + 1 < key.length) { // количество сжимаемых символов, больше чем в исходной строке, есть смысл сжатия
                        matches.push({i: index, l: key.length});
                        result += SDICTB[0b11110000 + ((len255R.length - 1) << 2) + (index255R.length - 1)] + len255R + index255R;
                    } else { // нету смысла сжатия, исходная строка меньше или равняется сжимаемой
                        for (var k of key) result += getCodeBySymbol(k);
                    }
                    i += key.length - 1; // идем дальше по строке
                }
                else result += getCodeBySymbol(str[i]);
            }
            return result;
        }
    
         /**
         * Функция decrypt распаковки строки
         * @param {String} str - сжатая строка с помощью таблицы символов UTF[255]
         */
        function decrypt(str) {
            var i, result = "",
                [sourceSymb, offsetTable] = decryptTable(str), // определяем исходную таблицу символов и смещение для текста после таблицы
                getSymbolByDex = number => sourceSymb.find(s => s.dex == number).symb; // поиск символа по коду 10 с.с.
            if (!sourceSymb) return ;
            for (i = offsetTable + 1; i < str.length; i++) {
                var dex = SDICTB.indexOf(str[i]); // сжатый код символа в 10 с.с.
                if (dex >> 4 == 15) { // первые биты 1111, значит это повтор
                    var lenB = (0b00000011 & (dex >> 2)) + 1, // длина повтора в байтах
                        indexB = (0b00000011 & dex) + 1, // длина индекса в байтах
                        len = fromR255(str.substring(i + 1, i + 1 + lenB)), // длина повтора в 10 с.с.
                        index = fromR255(str.substring(i + 1 + lenB, i + 1 + lenB + indexB), true); // индекс смещения в 10 с.с.
                    index = index >= 0 ? index : result.length + index; // поправка, если отрицательное смещение
                    result += result.substring(index, index + len);
                    i += lenB + indexB; // пропускаем байты повтора и смещения
                } else result += getSymbolByDex(dex);
            }
            return result;
        }
        return {encrypt: encrypt, decrypt: decrypt};
    }

    var zip = zip(); // получаем функции упаковки и распаковки текста

    if (typeof(dataStyle) == 'string' && dataStyle.length > 0) { // распаковываем стили
        document.head.insertAdjacentElement('beforeend', Object.assign(document.createElement('link'), {
            charset: 'utf-8',
            rel: 'stylesheet',
            href: URL.createObjectURL(new Blob([zip.decrypt(dataStyle)], { type: 'text/css' }))
        }));
    }

    if (typeof(dataScript) == 'string' && dataScript.length > 0) { // распаковываем скрипты
        document.body.insertAdjacentElement('beforeend', Object.assign(document.createElement('script'), {
            charset: 'utf-8',
            src: URL.createObjectURL(new Blob([zip.decrypt(dataScript)], { type: 'text/javascript' }))
        }));
    }

    if (typeof(dataBase) == 'string' && dataBase.length > 0) { // распаковываем данные календаря
        window.tasks = zip.decrypt(dataBase);
    }

    if (typeof(dataHead) == 'string' && dataHead.length > 0) { // добавляем данные головы
        document.head.insertAdjacentHTML('beforeend', dataHead);
    }

    if (typeof(dataBody) == 'string' && dataBody.length > 0) { // добавляем данные тела
        document.body.insertAdjacentHTML('beforeend', dataBody);
    }
}

/**
 * Функция minifyTerserAddToPageAndGlobalVar минифицирует переданную функцию, добавляет ее на страницу и записывает в глобальную переменную
 */
function minifyTerserAddToPageAndGlobalVar(func) {
    if (typeof(func) != 'function') return;
    var innerText = func.toString();
    innerText = innerText.substring(innerText.indexOf("{") + 1, innerText.lastIndexOf("}") - 1); // выбираем только текст внутри функции
    Terser.minify(innerText).then(({code: t}) => { // минифицируем текст функции
        window.dataScript += t; // записываем сжатый текст функции в глобальную переменную
        document.body.insertAdjacentElement('beforeend', Object.assign(document.createElement('script'), { // добавляем сжатую функцию на страницу
            charset: 'utf-8',
            src: URL.createObjectURL(new Blob([t], { type: 'text/javascript' }))
        }));
    });
}

(() => { // вызываем анонимную функцию для добавления основного скрипта на страницу и инициализацию основных переменных
    var mainFunctionText = init.toString(),
        textHead = [...document.querySelectorAll("head > *:not(link[rel=stylesheet])")].map(e => e.outerHTML).join(""), // получаем текст головы
        textBody = [...document.querySelectorAll("body > *:not(script[id=data],[src])")].map(e => e.outerHTML).join(""); // получаем текст тела
    mainFunctionText = mainFunctionText.substring(mainFunctionText.indexOf("{") + 1, mainFunctionText.lastIndexOf("}") - 1); // выбираем только текст внутри функции
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    Terser.minify(mainFunctionText).then(({code: t}) => { // минифицируем текст основной функции
        window.mainFunc = t; // записываем текст основной функции в глобальную переменную
        document.body.insertAdjacentElement('beforeend', Object.assign(document.createElement('script'), { // данные скрипта
            id: 'data',
            innerHTML: `var [dataScript,dataStyle,dataBase,dataHead,dataBody]=['','','','${textHead}','${textBody}'];`
        }));
        document.body.insertAdjacentElement('beforeend', Object.assign(document.createElement('script'), { // основной скрипт
            innerHTML: t
        }));
    });
})();

window.onload = () => { // финальная функция, выполняющиеся после загрузки всех элементов страницы для сжатия и кодирования функции в глобальной переменной
    dataScript = zip.encrypt(dataScript);
};