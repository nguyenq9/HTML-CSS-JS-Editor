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

html.value = "<h1 onclick=\"sayHello()\">Hello World!<h1>";
css.value = "h1 {\ncolor: green;\n}";
js.value = "function sayHello() {\nalert(\"Hello\")\n}";

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
    } else if (event.keyCode == 190 && record) {
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
            console.log(closing);
            closed = true;
            tag = "";
            html.removeEventListener('keydown', doKeyPress);
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
        if (record) {
            tag = tag.concat(key);
            console.log(tag);
        }
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
        tag = tag.slice(0, -1);
    }
}

function loadEx1() {
    html.value = "<p><button onclick=\"myMove()\">Click Me</button>\n</p>\n<div id=\"myContainer\">\n<div id =\"myAnimation\"></div>\n</div>";
    css.value = "#myContainer \{ \nwidth: 400px; \nheight: 400px\; \nposition: relative\; \nbackground: yellow\;\n\} \n#myAnimation \{\nwidth: 50px\;\nheight: 50px\;\nposition: absolute\;\nbackground-color: red\;\n\}";
    js.value = "var id = null\;\nfunction myMove() \{\nvar elem = document.getElementById(\"myAnimation\")\;   \nvar pos = 0\;\nclearInterval(id)\;\nid = setInterval(frame, 10)\;\nfunction frame() \{\nif (pos == 350) \{\nclearInterval(id)\;\n\} else \{\npos++; elem.style.top = pos + 'px'\; elem.style.left = pos + 'px'\; \}\}\}";
    execute();
    console.log("loaded new text");
}

function loadEx2() {
    html.value = "<h1>HTML DOM Events</h1>\n<h2>The onclick Event</h2>\n<p>The onclick event triggers a function when an element is clicked on.</p>\n<p>Click to trigger a function that will output \"Hello World\":</p>\n<button onclick=\"myFunction()\">Click me</button>\n<p id=\"demo\"></p>"
    css.value = "button {\n background-color:red;\n}"
    js.value = "function myFunction() { document.getElementById(\"demo\").innerHTML = \"Hello World\"\;}"
    execute();
}
 
function loadEx3() {
    html.value = "<body>\n<iframe width=\"420\" height=\"345\" src=\"https://www.youtube.com/embed/tgbNymZ7vqY\"></iframe>\n</body>"
    css.value = ""
    js.value = ""
    execute();
}

document.onkeydown = ctrlZ;

html.onkeyup = () => execute();
css.onkeyup = () => execute();
js.onkeyup = () => execute();

execute();


