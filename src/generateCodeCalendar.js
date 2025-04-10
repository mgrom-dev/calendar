/** показать форму для кодирования выходных дней за год в 16 с.с. Например выходные с 5 по 9 января код - 105, первым числом закодирован год
 *  Minified tool using https://jsminify.org/ */
 minifyTerserAddToPageAndGlobalVar(() => {
    $(".get-code-calendar")[0].addEventListener("click", showCodingWeekendForm);
    function showCodingWeekendForm(){ // показать таблицу генерации выходных дней
        function addWeekend(e) { // добавить новый выходной день
            let newRow = $(`<div class="row-weekend"><input type="date"><input type="number" class="days-weekend" max="63"><span class="remove-weekend">➖</span><span class="add-weekend">➕</span></div>`)[0];
            e.target.parentElement.after(newRow);
            $(".add-weekend", newRow)[0].addEventListener("click", addWeekend);
            $(".remove-weekend", newRow)[0].addEventListener("click", removeWeekend);
        }
        function removeWeekend(e) { // удалить выходной день
            if ($(".calc-weekend > .row-weekend").length > 1) e.target.parentElement.remove();
            else $(".days-weekend, input[type=date]", e.target.parentElement).each(e => e.value = "");
        }
        function getCodeWeekend() { // получить закодированный массив выходных
            let codemas = [];
            $(".calc-weekend > .row-weekend").each(r => {
                if ($("input[type=date]", r)[0].value == "" || $(".days-weekend", r)[0].value == "") return ;
                let day = dayInYear(...$("input[type=date]", r)[0].value.split("-").map(v => +v)), days = +$(".days-weekend", r)[0].value;
                if (days > 63) return ;
                if (!codemas.length) codemas.push($("input[type=date]", r)[0].valueAsDate.getFullYear().toString(16));
                codemas.push(((day << 7) + days).toString(16));
            });
            $(".calc-weekend > .result-weekend")[0].innerHTML = '[' + codemas.map(v => `'${v}'`).join(",") + "]";
        }
        let form = $(`<div class="calc-weekend"><span class="close-weekend">закрыть форму</span><div class="row-weekend"><input type="date"><input type="number" class="days-weekend" max="63"><span class="remove-weekend">➖</span><span class="add-weekend">➕</span></div><span class="massive-weekend">получить код</span><div class="result-weekend"></div></div>`);
        $(".add-weekend", form)[0].addEventListener("click", addWeekend);
        $(".remove-weekend", form)[0].addEventListener("click", removeWeekend);
        $(".massive-weekend", form)[0].addEventListener("click", getCodeWeekend);
        $(".close-weekend", form)[0].addEventListener("click", () => $(".calc-weekend")[0].remove());
    }
});