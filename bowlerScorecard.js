const url =
  "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/gujarat-titans-vs-chennai-super-kings-1st-match-1359475/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");

const path = require("path");
const fs = require("fs");
const xlsx=require("xlsx");


function processBowlerScorecard(url){
    request(url, bowlerCb);
}



function bowlerCb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractBowlerMatchDetails(html);
  }
}

function extractBowlerMatchDetails(html) {
  let $ = cheerio.load(html);


  let description = $("div[class='ds-text-tight-m ds-font-regular ds-text-typo-mid3']");
    let result = $("p[class='ds-text-tight-m ds-font-regular ds-truncate ds-text-typo']");
    let stringArr = description.text().split(",");
    let venue = stringArr[1].trim();
    let date = (stringArr[2] + stringArr[3]).trim();
    result = result.text();
  //console.log(venue);
  //console.log(date);

  //console.log(result);

  //now targeting the collapsuble class to get the score innings wise
  //let toreachScorecardElem=$("div[class='ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent']>a[class='ds-no-tap-higlight']");

  let innings = $("div[class='ds-rounded-lg ds-mt-2']");
  //console.log("eror spotted");

  //let htmlstring = "";
  for (let i = 0; i < innings.length; i++) {
    //.$("span[class='ds-text-title-xs ds-font-bold ds-capitalize']");
    let opponentTeam = $(innings[i]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();

    let opponentIndex = i == 0 ? 1 : 0;
    // $("span[class='ds-text-title-xs ds-font-bold ds-capitalize']");
   let BowlersTeamName = $(innings[opponentIndex]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();

    console.log(`${venue}  ${date} ${BowlersTeamName}    ${result}`);
   // 

    let cInning = $(innings[i]);
    let allRows = cInning.find("table[class='ds-w-full ds-table ds-table-md ds-table-auto ']>tbody>tr");
   // console.log("again error");


   // table[class='ds-w-full ds-table ds-table-md ds-table-auto ci-scorecard-table']>
    //console.log(allRows);
   
   // console.log(allRows.length);
  
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
    // console.log(allCols);

      let isWorthy = $(allCols[0]).hasClass("ds-flex ds-items-center");

      if (isWorthy == true) {
        //console.log(allCols.text());
        let bowlerName=$(allCols[0]).text().trim();
      
        let OversBowled=$(allCols[1]).text().trim();

        let Maiden=$(allCols[2]).text().trim();
        let runsConceeded=$(allCols[3]).text().trim();
        let wicketsTaken=$(allCols[4]).text().trim();
        let economy=$(allCols[5]).text().trim();
        let foursConceeded=$(allCols[7]).text().trim();
        let sixesConceeded=$(allCols[8]).text().trim();
        let wideballs=$(allCols[9]).text().trim();
        let noBalls=$(allCols[10]).text().trim();

        console.log(`${bowlerName} ${OversBowled} ${Maiden} ${runsConceeded} ${wicketsTaken}  ${economy}  ${foursConceeded}  ${sixesConceeded}  ${wideballs}  ${noBalls}`);
        processPlayer(BowlersTeamName,bowlerName,OversBowled,Maiden,runsConceeded,wicketsTaken,economy,foursConceeded,sixesConceeded,wideballs, noBalls,venue,date,result);
        //,opponentTeamNameTitle

       
      }
      
    }
    
    //console.log(htmlstring);
    console.log("--------------------------------------------");

  }
  //console.log("bowler scorecard details");
}





function processPlayer(BowlersTeamName,bowlerName,OversBowled,Maiden,runsConceeded,wicketsTaken,economy,foursConceeded,sixesConceeded,wideballs, noBalls,venue,date,result){
    let teamPath=path.join(__dirname,"iplbowlerdetails",BowlersTeamName);
    dirCreator(teamPath);
    let filepath=path.join(teamPath,bowlerName +".xlsx");
    let content=excelReader(filepath,bowlerName);
    let playerObj={
        BowlersTeamName,
        bowlerName,
        OversBowled,
        Maiden,
        runsConceeded,
        wicketsTaken,
        economy,
        foursConceeded,
        sixesConceeded,
        wideballs, 
        noBalls,
       // opponentTeamNameTitle,
        venue,date,result
      
    }
    content.push(playerObj);
    excelWriter(filepath,content,bowlerName);
  
  }
  
  
  
  
  function dirCreator(filepath) {
    if(fs.existsSync(filepath)==false){
      fs.mkdirSync(filepath);
    }
  }
  
  
  
  function excelWriter(filepath,json,sheetname){
    let newWorkBook=xlsx.utils.book_new();
    let newWorkSheet=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,sheetname);
    xlsx.writeFile(newWorkBook,filepath);
  } 
  
  
  function excelReader(filepath,sheetname) {
    if(fs.existsSync(filepath)==false){
      return [];
    }
  
    let workBook=xlsx.readFile(filepath);
    let excelData=workBook.Sheets[sheetname];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
    
  }
  
  
  
  





module.exports={
    pbs:processBowlerScorecard
  }
