var console = require('better-console');
// var url = "https://s.haroen.me/rosters/semester-4.json";
var roster = require("./example.json");
var Table = require('cli-table');

var getDayStr = function(i) {
  return ["zo","ma","di","wo","do","vr","za"][i];
}

var getDayInt = function(i) {
  if (i === undefined ) return undefined;
  else if (!isNaN(i)) return i;
  return ["zo","ma","di","wo","do","vr","za"].indexOf(i);
}

var getHour = function(i) {
  return ["8u15-9u45","9u45-11u15","11u15-12u45","13u30-15u00","15u00-16u30","16u30-18u00"][i-1];
}

var askedDay = getDayInt(process.argv[2]) || "all";

var table = new Table({
    head: ['Rel', 'Change', 'By', 'When']
  , colWidths: [6, 21, 25, 17]
});

table.push(
    ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
  , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
);
console.log(table.toString());

var prettyPrint = function(table) {
  table.forEach(function(d) {
    if (askedDay === "all" || askedDay == d.day) {
    var day = [];
     d.classes.forEach(function(h){
       day.push([getHour(h.hour),h.class,h.prof,h.location]);
     });
    console.table(day);
    };
  });
}

prettyPrint(roster);
