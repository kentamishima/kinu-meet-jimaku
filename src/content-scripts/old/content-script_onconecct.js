/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable */



let myname = "me"
if(document.getElementsByClassName("ASy21 Duq0Bf").length != 0){
    myname = document.getElementsByClassName("ASy21 Duq0Bf")[0].title
}
console.log(myname);
//対象のDOMが呼び出されるまで待機
function waitForElement(selector, callback) {
    let element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
            let nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
                if (node.matches && node.matches(selector)) {
                observer.disconnect();
                callback(node);
                break;
                }
            }
            });
        })
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
}
const JimakuMainEle = 'div[jsname="EaZ7Cc"] div[jscontroller="yEvoid"][jsname="NeC6gb"]'; 
let port = chrome.runtime.connect({name: "meetJimaku"});

waitForElement(JimakuMainEle, async function(element) {

    if(document.querySelector('button[jscontroller="xzbRj"]').innerText == 'closed_caption_off'){
        document.querySelector('button[jscontroller="xzbRj"]').click() //字幕の設定
    }
    
    let observerTarget = document.getElementsByClassName("a4cQT")[0];
    // オブザーバの設定
    const config = {
        characterData: true,
        subtree: true,
        childList: true
        };
    // オブザーバインスタンスを作成
    let shitreg = "";
    let i = 0;
    let output = {shitreg:"",currentData:"",outputStack:"",username:""};
    let firstCall = true;
    let observer = new MutationObserver(() => {
        //初回呼び出しはNotionPage作成
        if(firstCall){
            let roomTitle = document.querySelector(JimakuMainEle).textContent;
            let YMD = yyyymmdd();
            let meetID = location.pathname.split("/")[1];

            console.log(roomTitle,YMD,meetID,myname);
            let fileobj ={
                roomTitle:roomTitle,
                YMD:YMD,
                meetID:meetID,
                writer:myname
            }
            // chrome.runtime.sendMessage({ type:"create",file:fileobj });
            port.postMessage({ type:"create",file:fileobj }, function (item) {
                // sendMessageのレスポンスが item で取得できるのでそれを使って処理する
                if (!item) {
                  return;
                } else {
                  if (item.flag) {
                    console.log(item.flag);
                  }
                }
            });
            firstCall = false;
        
            //ついでにchrome.storageのデータクリア
            chrome.storage.local.clear(function() {
                console.log("chrome.storage.localの中身がクリアされました");
              });          
        }
        ////////////
        //テスト修正20230530 
        //ここを会話形式の際に変更しないとな
        let tolkerElement = document.getElementsByClassName("TBMuR bj4p3b");
        let lasttolkerElement = tolkerElement[tolkerElement.length - 1];
        let isUserName 
        try {
            isUserName = lasttolkerElement.getElementsByClassName("zs7s8d jxFHg")[0];            
        } catch (error) {
            isUserName = null;
        }

        
        if(isUserName != null){
            let shit1Data = kutouten(shitreg);
            let userNameText = lasttolkerElement.getElementsByClassName("zs7s8d jxFHg")[0].innerText;
            let isChangeUser = false;
            if(output.username == userNameText){
                //特に処理する必要ないけどいつかカウンティングするなら利用
            } else if (output.username != userNameText){
                //強制的に新スレッドにする処理をいれねば

                let outputStrChangeUser = output.outputStack + output.shitreg;
                let userNameChangeUser = output.username;
                console.log("【ユーザー変更のため転送します】", outputStrChangeUser)
                isChangeUser = true;
                // chrome.runtime.sendMessage({ msg:outputStrChangeUser, userName:userNameChangeUser });
                port.postMessage({ msg:outputStrChangeUser, userName:userNameChangeUser }, function (item) {
                    // sendMessageのレスポンスが item で取得できるのでそれを使って処理する
                    if (!item) {
                      return;
                    } else {
                      if (item.flag) {
                        console.log(item.flag);
                      }
                    }
                  });
                output = {shitreg:"",currentData:"",outputStack:"",username:userNameText};
            } else {
                output.username = userNameText;
            }
            // //テスト修正20230530 
            // //ここを会話形式の際に変更しないとな
            // let tolkerElement = document.getElementsByClassName("TBMuR bj4p3b");
            // let lasttolkerElement = tolkerElement[tolkerElement.length - 1];
            
            //最後のtoker
            let newData = kutouten(lasttolkerElement.getElementsByClassName("iTTPOb VbkSUe")[0].innerText);
            console.log(i, output.username, newData);

            //いったん全てのログをchrome.strageにはきだしてみる
            chrome.storage.local.get('all', function(result) {
                let data = result.all || []; // キーに関連付けられたデータを取得します（なければ空の配列を作成）
                let adddata = `${output.username},${newData}\n`
                data.push(adddata); // 新しい情報を配列に追加します
              
                // 更新されたデータを保存する
                chrome.storage.local.set({ 'all': data }, function() {
                  // データが正常に保存された場合の処理
                  console.log("all_追記されました")
                });
              });

            if (newData == ""){//NewDataが処理されない問題用の検証でしょり
                console.log("呼び出しチェック")
            // if (shit1Data == "" || newData == ""){
            } else if (shit1Data != newData || isChangeUser) {
            
                output.currentData = newData;
                // console.log("【output】",output)
                //異なるデータがきている時の処理
                output = margeMessage(output);
            }
            shitreg = newData;
            i++;
        } else if(output.shitreg) {
            //isUserNameがnullでもデータがある場合outputを利用して書き込む
            let outputStr = output.outputStack + output.shitreg;
            let userName = output.username;
            console.log("【転送します】", outputStr)
            // chrome.runtime.sendMessage({ msg:outputStr, userName:userName });
            port.postMessage({ msg:outputStr, userName:userName }, function (item) {
                // sendMessageのレスポンスが item で取得できるのでそれを使って処理する
                if (!item) {
                  return;
                } else {
                  if (item.flag) {
                    console.log(item.flag);
                  }
                }
              });
            output = {shitreg:"",currentData:"",outputStack:"",username:""};

        }
    });
    observer.observe(observerTarget, config);
});


function margeMessage(obj){
    let shitreg = obj.shitreg
    let currentData = obj.currentData
    let output = obj.outputStack
    let userName = obj.username
 
    let shit1Data = kutouten(shitreg);
    let newData  = kutouten(currentData);

    let shit1Data_remove = removePunctuation(shitreg);
    let newData_remove  = removePunctuation(currentData);   

    //この辺りが悪さをして転送エラーを起こしている気がするのでいったん外し
    if (shit1Data == ""){
         //特にしょりなし
    } else if (shit1Data_remove.includes(newData_remove)) {
        currentData = shitreg;
         //特にしょりなし
    } else if (check4Characters(shit1Data_remove,newData_remove)) {
        //初めの４文字が一緒なので一連の文字列である認識、より長い文字列を残す
        currentData = (shit1Data.length >= newData.length) ? shitreg : currentData;

    } else if (shit1Data_remove != newData_remove) {
        let stackText = textDiff(shit1Data, newData);
        if(stackText.statusJIMAKU == "continue"){
            output += stackText.outputText.trim();
        } else {
            output += stackText.outputText.trim();

            console.log("【転送します】", output)
            //いったんここで全部chrome.strageにはきだしてみる
            chrome.storage.local.get('outputlog', function(result) {
                let data = result.outputlog || []; // キーに関連付けられたデータを取得します（なければ空の配列を作成）
                let adddata = `${userName},${output}\n`
                data.push(adddata); // 新しい情報を配列に追加します
              
                // 更新されたデータを保存する
                chrome.storage.local.set({ 'outputlog': data }, function() {
                  // データが正常に保存された場合の処理
                  console.log("outputlog_追記されました")
                });
              });

            // chrome.runtime.sendMessage({ type:"update",msg:output, userName:userName });
            port.postMessage({ type:"update",msg:output,userName:userName }, function (item) {
                // sendMessageのレスポンスが item で取得できるのでそれを使って処理する
                if (!item) {
                  return;
                } else {
                  if (item.flag) {
                    console.log(item.flag);
                  }
                }
              });
            //新規作り直し
            output = "";
        }

    } 
    shitreg = newData;
    return {shitreg:currentData, currentData:"",outputStack:output,username:obj.username}
}


function textDiff (pre, post) {
    let pre_trim = pre.trim();
    let post_trim = post.trim();
  
    const concatText = pre_trim + post_trim
    // 正規表現を使用して5文字以上連続して繰り返している部分を検索
    const regex = /(.{4,})\1/g
    const matches = concatText.match(regex);
  
    let statusJIMAKU = ''
    if (matches) {
      const textlength = (-1) * (matches[0].length) / 2
      //   let matchTar = matches[0].substring(0, textlength);
      outputText = pre_trim.slice(0, textlength)
      statusJIMAKU = 'continue'
    } else {
      const concatTextRe = post_trim + pre_trim
      const matchesRe = concatTextRe.match(regex);
  
      if ( matchesRe ) {
        // リバース一致の場合も同じく抽出
        // const textlengthRe = (-1) * (matchesRe[0].length) / 2
        // outputText = post_trim.slice(0, textlengthRe)
        outputText = "" ;
        statusJIMAKU = 'continue';
      } else {
        outputText = pre
        statusJIMAKU = 'done'
      }
    }
    return { outputText: outputText, statusJIMAKU: statusJIMAKU }
  }
    
function kutouten(sentence){// 末尾が句読点である場合は削除する
    if(sentence){
        if (sentence.endsWith("。")) {
            sentence = sentence.slice(0, -1);
        }
    }
    return sentence
}

function check4Characters(string1, string2) {
    // 文字列の長さが5未満の場合は、一致しないとみなす
    if (string1.length < 4 || string2.length < 4) {
      return true;
    }
    const Chars1 = string1.substring(0, 4);
    const Chars2 = string2.substring(0, 4);
    return (Chars1 === Chars2);
  }


function removePunctuation(text){
  const punctuationRegex = /[。、！？]/g;
  const spaceRegex = /\s+/g;

  const removedPunctuation = text.replace(punctuationRegex, "")
    .replace(spaceRegex, "")

  return removedPunctuation;
}

function yyyymmdd (){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');

    let result = `${year}-${month}-${day}`;
    return result
}