// var roster = [
//   {
//     "day":1,
//     "hour":1,
//     "class":"C#OO/ WT1",
//     "prof":"Donné/Van Assche/Verb",
//     "location":""
//   },
//   {
//     "day":1,
//     "hour":2,
//     "class":"LC#OO/ LW",
//     "prof":"Donné/Van Assche",
//     "location":"LIn4"
//   },
//   {
//     "day":1,
//     "hour":3,
//     "class":"Webscript1",
//     "prof":"VanderL/Maerv",
//     "location":""
//   },
//   {
//     "day":1,
//     "hour":4,
//     "class":"UXDesign",
//     "prof":"DeWinne/vanderLinde",
//     "location":""
//   },
//   {
//     "day":2,
//     "hour":3,
//     "class":"PrArchit",
//     "prof":"Donné",
//     "location":""
//   },
//   {
//     "day":2,
//     "hour":4,
//     "class":"EloSign2",
//     "prof":"Debbaut",
//     "location":""
//   },
//   {
//     "day":2,
//     "hour":5,
//     "class":"µContr2",
//     "prof":"Wyns",
//     "location":""
//   },
//   {
//     "day":2,
//     "hour":6,
//     "class":"Ethiek ",
//     "prof":"Vanderper",
//     "location":""
//   },
//   {
//     "day":3,
//     "hour":1,
//     "class":"LµContr2",
//     "prof":"Sanders",
//     "location":"LIn3"
//   },
//   {
//     "day":3,
//     "hour":2,
//     "class":"R & Sess",
//     "prof":"De Smet",
//     "location":"LIn2"
//   },
//   {
//     "day":4,
//     "hour":1,
//     "class":"LWebScript1",
//     "prof":"VanderL/Maerv",
//     "location":"LIn2"
//   },
//   {
//     "day":4,
//     "hour":2,
//     "class":"LWebScript1",
//     "prof":"VanderL/Maerv",
//     "location":"LIn2"
//   },
//   {
//     "day":5,
//     "hour":1,
//     "class":"LUXDesign",
//     "prof":"van der Linde",
//     "location":"LIn4"
//   },
//   {
//     "day":5,
//     "hour":2,
//     "class":"LUXDesign",
//     "prof":"van der Linde",
//     "location":"LIn4"
//   },
//   {
//     "day":5,
//     "hour":3,
//     "class":"LEloSign2",
//     "prof":"Debbaut",
//     "location":"B310"
//   },
//   {
//     "day":5,
//     "hour":4,
//     "class":"LEloSign2",
//     "prof":"Debbaut",
//     "location":"B310"
//   }
// ];

var roster = JSON.stringify(require("./roster.json"));

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
      console.log(getDayStr(s.day)+" | "+getHour(s.hour)+" | "+s.class+"\t | "+s.location+"\t | "+s.prof);
    };
  });
  ;
}

print();
