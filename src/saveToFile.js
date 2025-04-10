/** Сохранение введенных данных в файл */
minifyTerserAddToPageAndGlobalVar(function() {
    document.body.addEventListener("keydown", keyEvents);
    document.body.addEventListener("keyup", keyEvents);
    $(".save-to-file")[0].title = "Зажмите ctrl для сохранения только данных";
    function keyEvents(e){ // меняем стиль иконки сохранения при зажатом ctrl
        if (e.type == "keydown" && e.ctrlKey) $(".save-to-file")[0].classList.add("data");
        if (e.type == "keyup" && e.key == "Control") $(".save-to-file")[0].classList.remove("data");
    }
    $(".save-to-file")[0].addEventListener("click", saveFile); // сохранение данных в файл
    async function saveFile(e) { // сохранение календаря с изменениями в файл
        if (e.ctrlKey) { // зажат ctrl, сохранение только данных в исходном формате
            saveAs(new Blob([`// данные календаря\nwindow.days = '${JSON.stringify(Days)}';\nwindow.tasks =\n\t'${JSON.stringify(Tasks)}'\n;`], {type: "text/plain;charset=utf-8"}), "data.js");
        } else {
            dataBase = zip.encrypt(JSON.stringify(Tasks)); // сжимаем и кодируем данные календаря
            var scriptData = `<script id='data'>var [dataScript,dataStyle,dataBase,dataHead,dataBody,days]=['${dataScript}','${dataStyle}','${dataBase}','${dataHead}','${dataBody}','${JSON.stringify(Days)}'];<\/script>`,
                scripts = [...document.querySelectorAll("body > script:not([src],#data)")].map(s => s.outerHTML).join(""); // все скрипты страницы, которые нужно сохранить в исходном формате
            saveAs(new Blob([`<html><head></head><body>${scriptData + scripts}</body></html>`], {type: "text/plain;charset=utf-8"}), "hello.html");
            Tasks.modify = false;
        }
    }
    window.onbeforeunload = function() {return Tasks.modify ? false : null; }; // предупреждение о не сохраненных изменениях
});