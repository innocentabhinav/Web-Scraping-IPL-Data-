const request=require("request");
const cheerio=require('cheerio');

//const scorecardObj=require("./scorecard");
const bowlerscorecardObj=require("./bowlerScorecard");
const { url } = require("inspector");


function getAllMatchesLink(url){
    request(url,function(err,response,html){
        if (err) {
            console.log(err);
        } else {
            extractAllLink(html);
        }
    })
        

}


function extractAllLink(html) {
    
    let $=cheerio.load(html);
    //let toreachScorecardElem=$("div[class='ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent']">"a[class='ds-no-tap-higlight']");
   // let toreachScorecardElem=$(abc).attr("a[class='ds-no-tap-higlight']");
   let toreachScorecardElem=$("div[class='ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent']>a[class='ds-no-tap-higlight']");

    for (let i = 0; i < toreachScorecardElem.length; i++) {
        let link=$(toreachScorecardElem[i]).attr("href");
        let finalLink="https://www.espncricinfo.com"+link;
        
        //console.log(finalLink);
       // console.log(count);
       //scorecardObj.ps(finalLink);
       bowlerscorecardObj.pbs(finalLink);
        
    }
}  

module.exports={
    gAllmatches:getAllMatchesLink
}


