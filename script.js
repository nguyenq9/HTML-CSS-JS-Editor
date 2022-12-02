localStorage.clear();

const html = document.querySelector('.html-section textarea');
const css = document.querySelector('.css-section textarea');
const js = document.querySelector('.js-section textarea');
const render = document.querySelector('#render');

let tag = "";
let record = false;
let backed = false;
let tags = [];
let htmlLen = 0;
let states = [""];
let numKeyClicks = 10;
let closed = false;

(function(win){
    'use strict';       
    var toString = {}.toString;
    win.isElementSupported = function isElementSupported(tag) {
        if (!win.HTMLUnknownElement) {
            return undefined;
        }
        var element = document.createElement(tag);
        if (tag.indexOf('-') > -1) {
            return (
                element.constructor !== window.HTMLUnknownElement &&
                element.constructor !== window.HTMLElement
            );
        }
        return toString.call(element) !== '[object HTMLUnknownElement]';
    };
})(this);

function doKeyPress(event) {
    const key = event.key;
    if (key === "Backspace") {
        console.log("backspace detected");
        tag = tag.slice(0, -1);
        backed = true;
    } else if (key === "<") { 
        closed = false;
        record = true;
        if (!closed) {
            tag = tag.concat(key);
        }
        console.log("Recording is ON");
    } else if (event.keyCode == 190) {
        tag = tag.replace("<", "");
        tag = tag.replace(">", "");
        if (tag.length != 0 && isElementSupported(tag)) {
            let closing = "</" + tag + ">";
            html.value += closing;
            const pos = html.value.length - closing.length;
            html.setSelectionRange(pos, pos);
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
            html.removeEventListener('keydown', doKeyPress);
            console.log(closing);
            closed = true;
            tag = "";
        } else {
            if (!closed) {
                tag = tag.concat(key);
            }
            console.log(tag + " not supported");
        }
        if (closed) {
            record = false;
            backed = false;
            console.log("Recording is OFF");
        }
    }  else if ((event.keyCode >= 48 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 111)){
        tag = tag.concat(key);
        console.log(tag);
    }
}

function execute() {
    let currVal = html.value;
    numKeyClicks--;
    if (numKeyClicks == 0) {
        states.unshift(currVal);
        numKeyClicks = 10;
    }
    localStorage.setItem('html', html.value);
    localStorage.setItem('css', css.value);
    localStorage.setItem('js', js.value);

    render.contentDocument.body.innerHTML = `<style>${localStorage.css}</style>` + localStorage.html;
    render.contentWindow.eval(localStorage.js);

    html.addEventListener('keydown', doKeyPress);

}

function ctrlZ(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        html.value = states.pop();
        console.log(states);
    }
}

document.onkeydown = ctrlZ;

html.onkeyup = () => execute();
css.onkeyup = () => execute();
js.onkeyup = () => execute();

// html.value = localStorage.html_code;
// css.value = localStorage.css_code;
// js.value = localStorage.js_code;

html.value = "<h1 onclick=\"sayHello()\">Hello World!<h1>"
css.value = "h1 {\ncolor: green;\n}"
js.value = "function sayHello() {\nalert(\"Hello\")\n}"

execute()


