(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[{
  "day": 1,
  "classes": [{
    "hour": 2,
    "class": "R&Sess",
    "prof": "Sanders",
    "location": "LInfo1"
  }, {
    "hour": 3,
    "class": "R&Sess",
    "prof": "Sanders",
    "location": "LInfo1"
  }, {
    "hour": 4,
    "class": "Engels",
    "prof": "Martens",
    "location": ""
  }, {
    "hour": 5,
    "class": "Engels",
    "prof": "Martens",
    "location": ""
  }, {
    "hour": 6,
    "class": "Engels",
    "prof": "Martens",
    "location": ""
  }]
}, {
  "day": 2,
  "classes": [{
    "hour": 2,
    "class": "Bethiek",
    "prof": "Vanderper",
    "location": ""
  }, {
    "hour": 3,
    "class": "OnderN",
    "prof": "Peeters",
    "location": ""
  }, {
    "hour": 4,
    "class": "AdvProg",
    "prof": "Dem/VanA/Verb",
    "location": ""
  }, {
    "hour": 5,
    "class": "LAdvProg",
    "prof": "Dem/Ver",
    "location": ""
  }, {
    "hour": 6,
    "class": "LAdvProg",
    "prof": "Dem/Ver",
    "location": "LInfo4"
  }]
}, {
  "day": 3,
  "classes": [{
    "hour": 4,
    "class": "LDataSec",
    "prof": "Van Steenberghe",
    "location": "LInfo2"
  }, {
    "hour": 5,
    "class": "LNetWebS",
    "prof": "Picalausa",
    "location": "LInfo4"
  }, {
    "hour": 6,
    "class": "LNetWebS",
    "prof": "Picalausa",
    "location": "LInfo4"
  }]
}, {
  "day": 4,
  "classes": [{
    "hour": 2,
    "class": "NetWebS",
    "prof": "Picalausa",
    "location": ""
  }, {
    "hour": 3,
    "class": "SoftMeth",
    "prof": "Dem/Pic",
    "location": ""
  }, {
    "hour": 4,
    "class": "DataSec",
    "prof": "VanSt/San",
    "location": ""
  }, {
    "hour": 5,
    "class": "Frans2",
    "prof": "Bracke",
    "location": ""
  }, {
    "hour": 6,
    "class": "Frans2",
    "prof": "Bracke",
    "location": ""
  }]
}, {
  "day": 5,
  "classes": [{
    "hour": 1,
    "class": "Proj2",
    "prof": "",
    "location": ""
  }]
}]

},{}],2:[function(require,module,exports){

module.exports = require('./lib/cli-table');

},{"./lib/cli-table":3}],3:[function(require,module,exports){

/**
 * Module dependencies.
 */

var utils = require('./utils')
  , repeat = utils.repeat
  , truncate = utils.truncate
  , pad = utils.pad;

require('colors');

/**
 * Table constructor
 *
 * @param {Object} options
 * @api public
 */

function Table (options){
  this.options = utils.options({
      chars: {
          'top': '─'
        , 'top-mid': '┬'
        , 'top-left': '┌'
        , 'top-right': '┐'
        , 'bottom': '─'
        , 'bottom-mid': '┴'
        , 'bottom-left': '└' 
        , 'bottom-right': '┘'
        , 'left': '│'
        , 'left-mid': '├'
        , 'mid': '─'
        , 'mid-mid': '┼'
        , 'right': '│'
        , 'right-mid': '┤'
      }
    , truncate: '…'
    , colWidths: []
    , colAligns: []
    , style: {
          'padding-left': 1
        , 'padding-right': 1
        , head: ['cyan']
        , compact : false
      }
    , head: []
  }, options);
};

/**
 * Inherit from Array.
 */

Table.prototype.__proto__ = Array.prototype;

/**
 * Width getter
 *
 * @return {Number} width
 * @api public
 */

Table.prototype.__defineGetter__('width', function (){
  var str = this.toString().split("\n");
  if (str.length) return str[0].length;
  return 0;
});

/**
 * Render to a string.
 *
 * @return {String} table representation
 * @api public
 */

Table.prototype.render 
Table.prototype.toString = function (){
  var ret = ''
    , options = this.options
    , style = options.style
    , head = options.head
    , chars = options.chars
    , truncater = options.truncate
      , colWidths = options.colWidths || new Array(this.head.length)
      , totalWidth = 0;
    
    if (!head.length && !this.length) return '';

    if (!colWidths.length){
      var all_rows = this.slice(0);
      if (head.length) { all_rows = all_rows.concat([head]) };

      all_rows.forEach(function(cells){
        // horizontal (arrays)
        if (typeof cells === 'object' && cells.length) {
          extractColumnWidths(cells);

        // vertical (objects)
        } else {
          var header_cell = Object.keys(cells)[0]
            , value_cell = cells[header_cell];

          colWidths[0] = Math.max(colWidths[0] || 0, get_width(header_cell) || 0);

          // cross (objects w/ array values)
          if (typeof value_cell === 'object' && value_cell.length) {
            extractColumnWidths(value_cell, 1);
          } else {
            colWidths[1] = Math.max(colWidths[1] || 0, get_width(value_cell) || 0);
          }
        }
    });
  };

  totalWidth = (colWidths.length == 1 ? colWidths[0] : colWidths.reduce(
    function (a, b){
      return a + b
    })) + colWidths.length + 1;

  function extractColumnWidths(arr, offset) {
    var offset = offset || 0;
    arr.forEach(function(cell, i){
      colWidths[i + offset] = Math.max(colWidths[i + offset] || 0, get_width(cell) || 0);
    });
  };

  function get_width(obj) {
    return width = typeof obj == 'object' && obj.width != undefined
         ? obj.width
         : ((typeof obj == 'object' ? utils.strlen(obj.text) : utils.strlen(obj)) + (style['padding-left'] || 0) + (style['padding-right'] || 0))
  }

  // draws a line
  function line (line, left, right, intersection){
    var width = 0
      , line =
          left
        + repeat(line, totalWidth - 2)
        + right;

    colWidths.forEach(function (w, i){
      if (i == colWidths.length - 1) return;
      width += w + 1;
      line = line.substr(0, width) + intersection + line.substr(width + 1);
    });

    ret += line;
  };

  // draws the top line
  function lineTop (){
    line(chars.top
       , chars['top-left'] || chars.top
       , chars['top-right'] ||  chars.top
       , chars['top-mid']);
    ret += "\n";
  };

  function generateRow (items, style) {
    var cells = []
      , max_height = 0;

    // prepare vertical and cross table data
    if (!Array.isArray(items) && typeof items === "object") {
      var key = Object.keys(items)[0]
        , value = items[key]
        , first_cell_head = true;

      if (Array.isArray(value)) {
        items = value;
        items.unshift(key);
      } else {
        items = [key, value];
      }
    }

    // transform array of item strings into structure of cells
    items.forEach(function (item, i) {
      var contents = item.toString().split("\n").reduce(function (memo, l) {
        memo.push(string(l, i));
        return memo;
      }, [])

      var height = contents.length;
      if (height > max_height) { max_height = height };

      cells.push({ contents: contents , height: height });
    });

    // transform vertical cells into horizontal lines
    var lines = new Array(max_height);
    cells.forEach(function (cell, i) {
      cell.contents.forEach(function (line, j) {
        if (!lines[j]) { lines[j] = [] };

        if (style || (first_cell_head && i === 0 && options.style.head)) {
          line = applyStyles(options.style.head, line)
        }

        lines[j].push(line);
      });

      // populate empty lines in cell
      for (var j = cell.height, l = max_height; j < l; j++) {
        if (!lines[j]) { lines[j] = [] };
        lines[j].push(string('', i));
      }
    });

    var ret = "";
    lines.forEach(function (line, index) {
      if (ret.length > 0) {
        ret += "\n" + chars.left;
      }

      ret += line.join(chars.right) + chars.right
    });

    return chars.left + ret;
  };

  function applyStyles(styles, subject) {
    styles.forEach(function(style) {
      subject = subject[style];
    });
    return subject;
  };

  // renders a string, by padding it or truncating it
  function string (str, index){
    var str = String(typeof str == 'object' && str.text ? str.text : str)
      , length = utils.strlen(str)
      , width = colWidths[index]
          - (style['padding-left'] || 0)
          - (style['padding-right'] || 0)
      , align = options.colAligns[index] || 'left';

    return repeat(' ', style['padding-left'] || 0)
         + (length == width ? str :
             (length < width 
              ? pad(str, ( width + (str.length - length) ), ' ', align == 'left' ? 'right' :
                  (align == 'middle' ? 'both' : 'left'))
              : (truncater ? truncate(str, width, truncater) : str))
           )
         + repeat(' ', style['padding-right'] || 0);
  };

  if (head.length){
    lineTop();

    ret += generateRow(head, style.head) + "\n"
  }

  if (this.length)
    this.forEach(function (cells, i){
      if (!head.length && i == 0)
        lineTop();
      else {
        if (!style.compact || i<(!!head.length) ?1:0 || cells.length == 0){
          line(chars.mid
             , chars['left-mid']
             , chars['right-mid']
             , chars['mid-mid']);
             
          ret += "\n" 
        }
      }

      if (cells.hasOwnProperty("length") && !cells.length) {
        return
      } else {
        ret += generateRow(cells) + "\n";
      };
    });

  line(chars.bottom
     , chars['bottom-left'] || chars.bottom
     , chars['bottom-right'] || chars.bottom
     , chars['bottom-mid']);

  return ret;
};

/**
 * Module exports.
 */

module.exports = Table;

module.exports.version = '0.0.1';

},{"./utils":4,"colors":5}],4:[function(require,module,exports){

/**
 * Repeats a string.
 *
 * @param {String} char(s)
 * @param {Number} number of times
 * @return {String} repeated string
 */

exports.repeat = function (str, times){
  return Array(times + 1).join(str);
};

/**
 * Pads a string
 *
 * @api public
 */

exports.pad = function (str, len, pad, dir) {
  if (len + 1 >= str.length)
    switch (dir){
      case 'left':
        str = Array(len + 1 - str.length).join(pad) + str;
        break;
      
      case 'both':
        var right = Math.ceil((padlen = len - str.length) / 2);
        var left = padlen - right;
        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
        break;
 
      default:
        str = str + Array(len + 1 - str.length).join(pad);
    };

  return str;
};

/**
 * Truncates a string
 *
 * @api public
 */

exports.truncate = function (str, length, chr){
  chr = chr || '…';
  return str.length >= length ? str.substr(0, length - chr.length) + chr : str;
};

/**
 * Copies and merges options with defaults.
 *
 * @param {Object} defaults
 * @param {Object} supplied options
 * @return {Object} new (merged) object
 */

function clone(a){
  var b;
  if (Array.isArray(a)){
    b = [];
    for (var i = 0, l = a.length; i < l; i++)
      b.push(typeof a[i] == 'object' ? clone(a[i]) : a[i]);
    return b;
  } else if (typeof a == 'object'){
    b = {};
    for (var i in a)
      b[i] = typeof a[i] == 'object' ? clone(a[i]) : a[i];
    return b;
  }
  return a;
};

exports.options = function (defaults, opts){
  if (!opts) opts = {};

  var c = clone(opts);
  for (var i in defaults)
    if (!(i in opts))
      c[i] = defaults[i];
  return c;
};


//
// For consideration of terminal "color" programs like colors.js,
// which can add ANSI escape color codes to strings,
// we destyle the ANSI color escape codes for padding calculations.
//
// see: http://en.wikipedia.org/wiki/ANSI_escape_code
//
exports.strlen = function(str){
  var code = /\u001b\[\d+m/g;
  var stripped = ("" + str).replace(code,'');
  var split = stripped.split("\n");
  return split.reduce(function (memo, s) { return (s.length > memo) ? s.length : memo }, 0);
}  

},{}],5:[function(require,module,exports){
/*
colors.js 

Copyright (c) 2010 Alexis Sellier (cloudhead) , Marak Squires

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// prototypes the string object to have additional method calls that add terminal colors
['bold', 'underline', 'italic', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'].forEach(function (style) {
  Object.defineProperty(String.prototype, style, {
    get: function () {
      return stylize(this, style);
    }
  });
});

// prototypes string with method "rainbow"
// rainbow will apply a the color spectrum to a string, changing colors every letter
Object.defineProperty(String.prototype, 'rainbow', {
  get: function () {
    var rainbowcolors = ['red','yellow','green','blue','magenta']; //RoY G BiV
    var exploded = this.split("");
    var i=0;
    exploded = exploded.map(function(letter) {
      if (letter==" ") {
        return letter;
      } 
      else {
        return stylize(letter,rainbowcolors[i++ % rainbowcolors.length]);
      }
    });
    return exploded.join("");
  }
});

function stylize(str, style) {
  var styles = {
  //styles
  'bold'      : [1,  22],
  'italic'    : [3,  23],
  'underline' : [4,  24],
  'inverse'   : [7,  27],
  //grayscale
  'white'     : [37, 39],
  'grey'      : [90, 39],
  'black'     : [90, 39],
  //colors
  'blue'      : [34, 39],
  'cyan'      : [36, 39],
  'green'     : [32, 39],
  'magenta'   : [35, 39],
  'red'       : [31, 39],
  'yellow'    : [33, 39]
  };
  return '\033[' + styles[style][0] + 'm' + str +
         '\033[' + styles[style][1] + 'm';
};
},{}],6:[function(require,module,exports){
(function (process){
/**
 * this is the browser version, won't fully work on terminal
 */

// var url = "https://s.haroen.me/rosters/semester-4.json";
var roster = require("./example.json");
// var roster = require(url);
var Table = require('cli-table');

var daysText = ["zo", "ma", "di", "wo", "do", "vr", "za"];
var hoursText = ["8u15-9u45", "9u45-11u15", "11u15-12u45", "13u30-15u00", "15u00-16u30", "16u30-18u00"];

var getDayStr = function (i) {
    'use strict';
    return daysText[i];
};

var getDayInt = function (i) {
    'use strict';
    if (i === undefined) {
        return undefined;
    }
    if (!isNaN(i)) {
        return i;
    }
    return daysText.indexOf(i);
};

/**
 * get the time strings from its index
 * @param  {int} i index (the nth hour)
 * @return {string}   a text description of that hour
 */
var getHour = function (i) {
    'use strict';
    return hoursText[i - 1];
};

/**
 * if an argument has been given, only show that day
 * either command line argument, either a single query string
 */
var askedDay = getDayInt(process.argv[2]) || "all";
if (typeof location !== 'undefined') {
    //after ?day=
    askedDay = location.search.substr(5) || "all";
}

/**
 * pretty prints a table
 * @param  {array} table  the data
 * @param  {bool} output true if outputted to the dom
 */
var prettyPrint = function (table, output) {
    'use strict';
    table.forEach(function (d) {
        // == and not === because one is a string, and the other is an int
        if (askedDay === "all" || askedDay == d.day) {
            var day = new Table({
                head: ['hour', 'class', 'prof', 'location'],
                colWidths: [13, 14, 19, 8]
            });
            d.classes.forEach(function (h) {
                day.push([getHour(h.hour), h.class, h.prof, h.location]);
            });
            if (output) {
                var pre = document.createElement('pre');
                var text = document.createTextNode(day.toString().replace(/\u001b\[\d+m/g, ''));
                pre.appendChild(text);
                document.body.appendChild(pre);
            } else {
                console.log(day.toString());
            }
        }
    });
};

prettyPrint(roster);

/**
 * expose the roster and the print method
 * note: not ideal
 */
if (typeof window !== 'undefined') {
    window.roster = roster;
    window.prettyPrint = prettyPrint;
}

}).call(this,require('_process'))
},{"./example.json":1,"_process":7,"cli-table":2}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[6]);
