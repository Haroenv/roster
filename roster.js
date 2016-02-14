var roster = require("./roster.json");

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

var print = function() {
  roster.forEach(function(s) {
    if (askedDay === "all" || askedDay == s.day) {
      console.log(getDayStr(s.day)+"\t"+getHour(s.hour)+"\t"+s.class+"\t"+s.location+"\t"+s.prof);
    };
  });
  ;
}

print();
