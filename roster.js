var console = require('better-console');
// var roster = require("https://s.haroen.me/rosters/semester-4.json");
var roster = require("https://s.haroen.me/rosters/semester-4.json");

var getDayStr = function(i) {
  return ["zo","ma","di","wo","do","vr","za"][i];
}

var getDayInt = function(i) {
  if (i === undefined ) return undefined;
  else if (!isNaN(i)) return i;
  return ["zo","ma","di","wo","do","vr","za"].indexOf(i);
}

var getHour = function(i) {
  return [" 8u15- 9u45"," 9u45-11u15","11u15-12u45","13u30-15u00","15u00-16u30","16u30-18u00"][i-1];
}

var askedDay = getDayInt(process.argv[2]) || "all";

var prettyPrint = function(table) {
  table.forEach(function(s) {
    var day = [];
    if (askedDay === "all" || askedDay == s.day) {
      total.push([getDayStr(s.day),getHour(s.hour),s.class,s.location,s.prof]);
    };
    console.table(day);
  });
}
