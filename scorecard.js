const url ="https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/gujarat-titans-vs-chennai-super-kings-1st-match-1359475/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");

const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");


function processScorecard(url){
    request(url, cb);
}





function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractMatchDetails(html);
  }
}




function extractMatchDetails(html) {
  let $ = cheerio.load(html);
  let description = $(
    "div[class='ds-text-tight-m ds-font-regular ds-text-typo-mid3']"
  );
  let result = $(
    "p[class='ds-text-tight-m ds-font-regular ds-truncate ds-text-typo']"
  );
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

  let htmlstring = "";
  for (let i = 0; i < innings.length; i++) {
    //.$("span[class='ds-text-title-xs ds-font-bold ds-capitalize']");
    let teamnameTitle = $(innings[i]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();

    let opponentIndex = i == 0 ? 1 : 0;
    // $("span[class='ds-text-title-xs ds-font-bold ds-capitalize']");
    let opponentTeamNameTitle = $(innings[opponentIndex]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();

    console.log(`${venue}  ${date} ${teamnameTitle} ${opponentTeamNameTitle}  ${result}`);
    

    let cInning = $(innings[i]);
    let allRows = cInning.find("tbody>tr");


   // table[class='ds-w-full ds-table ds-table-md ds-table-auto ci-scorecard-table']>
    //console.log(allRows);
   
   // console.log(allRows.length);
  
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
    // console.log(allCols);

      let isWorthy = $(allCols[0]).hasClass("ds-w-0 ds-whitespace-nowrap ds-min-w-max ds-flex ds-items-center");

      if (isWorthy == true) {
        //console.log(allCols.text());
        let playerName=$(allCols[0]).text().trim();
      
        let outORNot=$(allCols[1]).text().trim();

        let runs=$(allCols[2]).text().trim();
        let balls=$(allCols[3]).text().trim();

        let fours=$(allCols[5]).text().trim();
        let sixes=$(allCols[6]).text().trim();
        let strikeRate=$(allCols[7]).text().trim();

       console.log(`${playerName} ${outORNot} ${runs} ${balls} ${fours}  ${sixes}  ${strikeRate}`);
      
       processPlayer(teamnameTitle,playerName,runs,balls,fours,sixes,strikeRate,opponentTeamNameTitle,venue,date,result);


       
      }
      
    }
    
    console.log("--------------------------------------------");
    //console.log(htmlstring);
  }
}




function processPlayer(teamnameTitle,playerName,runs,balls,fours,sixes,strikeRate,opponentTeamNameTitle,venue,date,result){
  let teamPath=path.join(__dirname,"iplbatsmandetails",teamnameTitle);
  dirCreator(teamPath);
  let filepath=path.join(teamPath,playerName +".xlsx");
  let content=excelReader(filepath,playerName);
  let playerObj={
    teamnameTitle,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    strikeRate,
    opponentTeamNameTitle,
    venue,
    date,
    result
    
  }
  content.push(playerObj);
  excelWriter(filepath,content,playerName);

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
  ps:processScorecard
}