localStorage.clear();

const html = document.querySelector('.html-section textarea');
const css = document.querySelector('.css-section textarea');
const js = document.querySelector('.js-section textarea');
const render = document.querySelector('#render');

let tag = "";
let record = false;
let backed = false;
let tags = [];
/*
 * isElementSupported
 * Feature test HTML element support 
 * @param {String} tag
 * @return {Boolean|Undefined}
 */

(function(win){
    'use strict';       

    var toString = {}.toString;

    win.isElementSupported = function isElementSupported(tag) {
        // Return undefined if `HTMLUnknownElement` interface
        // doesn't exist
        if (!win.HTMLUnknownElement) {
            return undefined;
        }
        // Create a test element for the tag
        var element = document.createElement(tag);
        // Check for support of custom elements registered via
        // `document.registerElement`
        if (tag.indexOf('-') > -1) {
            // Registered elements have their own constructor, while unregistered
            // ones use the `HTMLElement` or `HTMLUnknownElement` (if invalid name)
            // constructor (http://stackoverflow.com/a/28210364/1070244)
            return (
                element.constructor !== window.HTMLUnknownElement &&
                element.constructor !== window.HTMLElement
            );
        }
        // Obtain the element's internal [[Class]] property, if it doesn't 
        // match the `HTMLUnknownElement` interface than it must be supported
        return toString.call(element) !== '[object HTMLUnknownElement]';
    };
    
})(this);

function execute() {
    localStorage.setItem('html', html.value);
    localStorage.setItem('css', css.value);
    localStorage.setItem('js', js.value);

    render.contentDocument.body.innerHTML = `<style>${localStorage.css}</style>` + localStorage.html;
    render.contentWindow.eval(localStorage.js);

    if (html.value.slice(-1) == "<") {
        record = true;
    }
    if (html.value.slice(-1) == ">") {
        record = false;
        backed = false;
        if (tag.length != 0) {
            let closing = "</" + tag + ">";
            html.value += closing
            const pos = html.value.length - closing.length;
            html.setSelectionRange(pos, pos);
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
            console.log(closing);
        }
        tag = "";
    }
    if (record) {
        var input = html;
        html.onkeydown = function() {
            const key = event.key;
            if (key === "Backspace") {
                console.log("backspace detected");
                if (html.value.slice(-1) != "<") {
                    tag = tag.slice(0, -1);
                    console.log("back: " + tag);
                    backed = true;
                } else {
                    console.log("Whoops");
                }
                return;
            }
        }
        if (html.value.slice(-1) != "<") {
            if (html.value.slice(-1) === "\n") {
                console.log("newline detected");
            } else {
                if (backed) {
                    backed = false;
                } else {
                    tag = tag.concat(html.value.slice(-1));
                    console.log("tag: " + tag);
                }
            }
        }
    }
    console.log(tags);
}

html.onkeyup = () => execute();
css.onkeyup = () => execute();
js.onkeyup = () => execute();

html.value = localStorage.html_code;
css.value = localStorage.css_code;
js.value = localStorage.js_code;


