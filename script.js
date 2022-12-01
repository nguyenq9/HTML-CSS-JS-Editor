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

function doKeyPress(event) {
    const key = event.key;
    if (key === "Backspace") {
        console.log("backspace detected");
        tag = tag.slice(0, -1);
        backed = true;
    } else if (key === "<") { 
        record = true;
        console.log("Recording is ON");
    } else if (event.keyCode == 190) {
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
        }
        tag = "";
        record = false;
        backed = false;
        console.log("Recording is OFF");
    }  else if ((event.keyCode >= 48 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 111)){
        tag = tag.concat(key);
        console.log(tag + " &&&&&");
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

    // const interval = setInterval(function() {
    //     states[stateIndex] = currVal;
    //     if (stateIndex == 0) {
    //         stateIndex = 4;
    //         console.log(stateIndex);
    //     } else {
    //         stateIndex--;
    //         console.log(stateIndex);
    //     }

    // }, 5000);

    // console.log(tags);
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

html.value = ""
css.value = ""
js.value = ""


