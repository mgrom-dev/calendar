/** аналог JQuery, но более простой
 *  Minified tool using https://jsminify.org/ */
 minifyTerserAddToPageAndGlobalVar(() => {
    function $(p1, p2){
        let jQuery = [],
            target = typeof(p2) == "object" ? (Array.isArray(p2) ? p2[0] : p2) : document.body;
        if (typeof(p1) == "string"){
            if (p1.match(/[<]/)) jQuery = target.insertAdjacentHTML("beforeend", p1) || [target.lastChild];
            else jQuery = [...target.querySelectorAll(p1)];
        } else if (typeof(p1) == "object") jQuery = [...p1]; 
        jQuery.append = function(node) {
            let to = jQuery[0] || target;
            if (typeof(node) == "string"){
                if (node.match(/[<>]/)) to.insertAdjacentHTML("beforeend", node);
                else to.insertAdjacentText("beforeend", node);
            } else to.insertAdjacentElement("beforeend", node);
            return jQuery;
        };
        jQuery.first = () => (jQuery.splice(1, jQuery.length), jQuery);
        jQuery.last = () => (jQuery.splice(0, jQuery.length - 1), jQuery);
        jQuery.each = f => (jQuery.forEach(f), jQuery);
        return jQuery;
    }
});