/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable */

// browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('Hello from the background')

//   browser.tabs.executeScript({
//     file: 'content-script.js'
//   })
// })
console.log('Hello from the background')


let userColorAry = [];
let colorList = ["green","orange","brown","blue","purple","pink","red","yellow","gray"];

// let page = "5924e9a8-8e9b-4afa-aef7-f73be93d644d"
// let page = "9193ba20-0306-43b3-81e9-dec31ccb3173"

let page = ""
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if(request.type == "update"){
        let user = request.userName;
        let index = userColorAry.indexOf(user);
        if (index === -1) {
            userColorAry.push(user);
            index = userColorAry.indexOf(user);
        }

        let remainder = index % 8;
        let useColor = colorList[remainder];


        if (request.msg != "") {
            let msgObj = {"children": [{
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                        {
                            "type": "text",
                            "text": {
                            "content": user + " >>  ",
                            },
                            "annotations": {
                                "color": useColor
                            }
                        },
                        {
                            "type": "text",
                            "text": {
                            "content": request.msg,
                            }
                        }
                        ]
                    }
                }]}

            //CF経由にしないとAPIKEY隠せないな問題
            let myHeaders = new Headers();
            myHeaders.append("authorization", "Bearer secret_FinxnkTIieHY4nJj9JDmRiq6VxyvKTl8fFfZKAWijP4");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Notion-Version", "2022-02-22");
            let raw = JSON.stringify(msgObj);
            let requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
            const notionURL = `https://api.notion.com/v1/blocks/${page}/children` 
            console.log(notionURL)

            fetch(notionURL, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    
        sendResponse("書き込み完了")
        return true
        }
    } else if (request.type == "create"){
        let roomTitle = request.file.roomTitle;
        let meetID = request.file.meetID;
        let YMD = request.file.YMD;
        let writer = request.file.writer;
        let title = roomTitle + YMD
        let myHeaders = new Headers();
        myHeaders.append("authorization", "Bearer secret_FinxnkTIieHY4nJj9JDmRiq6VxyvKTl8fFfZKAWijP4");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Notion-Version", "2022-06-28");

        let raw = JSON.stringify({
            "cover": {
                "type": "external",
                "external": {
                    "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
                }
            },
            "icon": { "type": "emoji", "emoji": "🥬" },
            "parent": {
                "type": "database_id",
                "database_id": "394113276b0d45ea977b0e7d6d19fb50"
            },
            "properties": {
                "title": {"title": [{"text": {"content": title} } ]},
                "roomTitle": { "rich_text": [ { "text": { "content": roomTitle } } ] },
                "meetID": { "rich_text": [ { "text": { "content": meetID } } ] },
                "YMD": { "rich_text": [ { "text": { "content": YMD } } ] },
                "writer": { "rich_text": [ { "text": { "content": writer } } ] },
                "date": {"date": {"start": YMD } },
            },
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          
        await fetch("https://api.notion.com/v1/pages", requestOptions)
            .then(response => response.json())
            .then(result => (page = result.id))
            .catch(error => console.log('error', error));
        console.log("newPage",page)

    }
  })
  