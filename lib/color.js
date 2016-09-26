// [color](https://github.com/leeluolee/mcss/blob/master/lib/helper/color.js)
var colorToAnsi, colorify;
colorToAnsi = {
    style: {
        normal: 0,
        bold: 1,
        underline: 4,
        blink: 5,
        strike: 9
    },
    fore: {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        magenta: 35,
        cyan: 36,
        white: 37,
        gray: 90,
        grey: 90,
        brightBlack: 90,
        brightRed: 91,
        brightGreen: 92,
        brightYellow: 99,
        brightBlue: 94,
        brightMagenta: 95,
        brightCyan: 96,
        brightWhite: 97
    },
    back: {
        black: 40,
        red: 41,
        green: 42,
        yellow: 43,
        blue: 44,
        magenta: 45,
        cyan: 46,
        white: 47,
        brightBlack: 100,
        brightRed: 101,
        brightGreen: 102,
        brightYellow: 103,
        brightBlue: 104,
        brightMagenta: 105,
        brightCyan: 106,
        brightWhite: 107
    }
};

module.exports = colorify = function(text, fore, back, style) {
    if(global.document && global.document.nodeType === 9) return text;
    if(!fore) return text;
    var attrCode, backCode, foreCode, octpfx, reset, result, suffix, _ref;
    if (style == null) {
        style = "normal";
    }
    if (typeof fore !== "string") {
        _ref = fore,
        fore = _ref.fore,
        back = _ref.back,
        style = _ref.style;
    }
    result = [];
    if (foreCode = colorToAnsi.fore[fore] || parseInt(fore)) {
        result.push(foreCode);
    }
    if (backCode = colorToAnsi.back[back] || parseInt(back)) {
        result.push(backCode);
    }
    if (attrCode = colorToAnsi.style[style] || parseInt(style)) {
        result.push(attrCode);
    }
    suffix = result.join(";");
    octpfx = "\033";
    reset = "" + octpfx + "[0m";
    return "" + octpfx + "[" + suffix + "m" + text + reset;
};
