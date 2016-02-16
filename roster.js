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

var getHour = function (i) {
    'use strict';
    return hoursText[i - 1];
};

var askedDay = getDayInt(process.argv[2]) || "all";

/**
 * pretty prints a table
 * @param  {array} table  the data
 * @param  {bool} output true if outputted to the dom
 */
var prettyPrint = function (table, output) {
    'use strict';
    table.forEach(function (d) {
        if (askedDay === "all" || askedDay === d.day) {
            var day = new Table({
                head: ['hour', 'class', 'prof', 'location'],
                colWidths: [13, 15, 23, 11]
            });
            d.classes.forEach(function (h) {
                day.push([getHour(h.hour), h.class, h.prof, h.location]);
            });
            if (output) {
                var pre = document.createElement('pre');
                var text = document.createTextNode(day.toString().replace(/\[3(6|9)m/g,""));
                pre.appendChild(text);
                document.body.appendChild(pre);
            } else {
                console.log(day.toString());
            }
        }
    });
};

prettyPrint(roster);

window.roster = roster;
window.prettyPrint = prettyPrint;
