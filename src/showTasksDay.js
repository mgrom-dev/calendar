/** Форма задач на день */
minifyTerserAddToPageAndGlobalVar(() => {
    function showTasksDay({target}, date){
        if (target.classList.contains("task")) target = target.parentElement;
        let form = $(`<div class="tasks-day"><div class='tasks-date'>${date}г. <span class='close-tasks'>✖</span></div><div class='tasks'></div></div>`),
            addTask = task => { // добавление новой задачи на форму
                let desc, t = $(".tasks", form),
                    num = t[0].childElementCount + 1,
                    finished = task.dates[date].status == "done" ? "done" : "",
                    repeatOpt = e => { // добавить, убрать опции выбора повтора событии
                        function getPos(t) { // получить номер позиции в списке
                            return $(".num", t.closest("div:not(.select.repeat)")).first()[0].innerText.replace(/[^0-9]/g, "");
                        }
                        if (e.type == "focus") { // выбрана строка
                            if (!$(".select.repeat", e.target.parentElement).length) { // элемент повтора еще не добавлен
                                var options = 'нет повтора,ежедневно,еженедельно,ежемесячно,ежеквартально'.split(',').map((c, i) => `<option ${i != 0 && task.repeat == Tasks.Task.REPEAT[i] ? "selected " : ""}value="${Tasks.Task.REPEAT[i]}">${c}</option>`).join(''),
                                    select = $([e.target.parentElement]).append(`<div class="select repeat"><select>${options}</select><div class="select_arrow"></div></div>`);
                                $("select", select).first()[0].addEventListener("blur", repeatOpt);
                                $("select", select).first()[0].addEventListener("change", e => task.setRepeat(e.target.value, date)); // изменение периодичности повтора
                            }
                        }
                        if (e.type == "blur") {
                            if (!e.relatedTarget || getPos(e.relatedTarget) != getPos(e.target)) $(".select.repeat", e.target.closest("div:not(.select.repeat)")).first()[0]?.remove();
                        }
                    };
                t.append(`<div class="${finished}"><span class="num">${num})</span><span class="description" contenteditable="true">${task.description}</span><span class="done">☑</span><span class="delete">⌫</span></div>`);
                desc = $(".description", t).last()[0];
                desc.addEventListener("input", e => task.setDescription(e.target.innerHTML)); // изменение описания задачи
                desc.addEventListener("focus", repeatOpt);
                desc.addEventListener("blur", repeatOpt);
                desc.addEventListener("keypress", e => {if (e.which === 13) e.preventDefault();});
                $(".done", t).last()[0].addEventListener("click", e => { // изменение статуса задачи
                    let cl = e.target.parentElement.classList;
                    cl.toggle("done");
                    task.dates[date].setStatus(cl.contains("done") ? "done" : "notDone");
                    Calendar.refreshDay(date);
                });
                $(".delete", t).last()[0].addEventListener("click", e => { // удаление задачи
                    if (e.target.classList.contains("pushed")) {
                        e.target.parentElement.remove();
                        task.dates[date].remove();
                        Calendar.refreshDay(date);
                        $(".num", t).each((s, i) => s.innerHTML = i + 1 + ")");
                    } else e.target.classList.add("pushed");
                });
                $(".delete", t).last()[0].addEventListener("mouseout", e => { e.target.classList.remove("pushed"); }); // для подтверждения удаления
            };

        $(".close-tasks", form)[0].addEventListener("click", () => $(".tasks-day")[0].remove()); // дейстивие кнопки закрытия формы задач на день
        Tasks.getByDate(date).forEach(t => addTask(t)); // добавляем задачи текущего дня
        $(form).append(`<div class="add"><strong>+</strong></div>`); // кнопка добавления новой задачи
        $(".add > strong", form).last()[0].addEventListener("click", e => { // действие кнопки добавление новой задачи
            var newTask = Tasks.add(date, "Добавьте описание", "no");
            addTask(newTask);
            Calendar.refreshDay(date);
            Tasks.modify = true;
        });
    }
});