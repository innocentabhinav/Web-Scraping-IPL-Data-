const url="https://www.espncricinfo.com/series/indian-premier-league-2023-1345038";


//for converting into xlsx files
const fs=require("fs");
const path=require("path");

const request=require("request");
const cheerio=require('cheerio');

const AllmatchObj=require("./allmatch");

const iplPath=path.join(__dirname,"iplbowlerdetails");
dirCreater(iplPath);

request(url,cb);

function cb(err,response,html) {
    if (err) {
        console.log(err);
    } else {
        extractLink(html);
    }

}

function extractLink(html) {
    let $=cheerio.load(html);
    let anchorElem=$("a[title='View All Results']");
    let link=anchorElem.attr("href");
    console.log(link);
    let fullLink="https://www.espncricinfo.com"+link;
    console.log(fullLink);


    AllmatchObj.gAllmatches(fullLink);
}



function dirCreater(filepath) {
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}




/*
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
    //let count=0;
    let $=cheerio.load(html);
    //let toreachScorecardElem=$("div[class='ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent']">"a[class='ds-no-tap-higlight']");
   // let toreachScorecardElem=$(abc).attr("a[class='ds-no-tap-higlight']");
   let toreachScorecardElem=$("div[class='ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent']>a[class='ds-no-tap-higlight']");

    for (let i = 0; i < toreachScorecardElem.length; i++) {
        let link=$(toreachScorecardElem[i]).attr("href");
        let finalLink="https://www.espncricinfo.com"+link;
        count++;
        console.log(finalLink);
       // console.log(count);
        
    }
    
}

*/