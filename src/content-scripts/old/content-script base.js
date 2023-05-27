/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable */

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

waitForElement(JimakuMainEle, function(element) {
    let roomTitle = document.querySelector(JimakuMainEle).textContent;
    console.log(roomTitle);
    let downloadDatetime = new Date();
    
    let observerTarget = document.getElementsByClassName("a4cQT")[0];
    // オブザーバの設定
    const config = {
        characterData: true,
        subtree: true,
        childList: true
        };
    // オブザーバインスタンスを作成
    shitreg = "";
    let i = 0;
    let output = {shitreg:"",currentData:"",outputStack:"",username:""};
    let observer = new MutationObserver(() => {
        let isUserName = document.getElementsByClassName("zs7s8d jxFHg")[0];
        if(isUserName != null){
            let shit1Data = kutouten(shitreg);
            let userNameText = document.getElementsByClassName("zs7s8d jxFHg")[0].innerText;
            if(output.username == userNameText){
                //特に処理する必要ないけどいつかカウンティングするなら利用
            } else if (output.username != userNameText){
                //強制的に新スレッドにする処理をいれねば
                output.username = userNameText;

            } else {
                output.username = userNameText;
            }

            let newData = kutouten(document.getElementsByClassName("iTTPOb VbkSUe")[0].innerText);

            if (shit1Data == "" || newData == ""){
                // console.log("空データ",shitreg,newData);
            } else if (shit1Data != newData) {
                console.log(i, newData);
                // console.log("newData");
                output.currentData = newData;

                console.log("【output】",output)
                output = margeMessage(output);
                // console.log("対象データ",shitreg,newData,tmp);
            } else {
                // console.log("例外",shitreg,newData);
            }
            shitreg = newData;
            // console.log(i, newData);
            i++;
        }
    });
    observer.observe(observerTarget, config);
}
);


function margeMessage(obj){
    let shitreg = obj.shitreg
    let currentData = obj.currentData
    let output = obj.outputStack
 
    let shit1Data = kutouten(shitreg);
    let newData = kutouten(currentData);

    if (shit1Data == ""){
         //特にしょりなし
    } else if (shit1Data.includes(newData)) {
         //特にしょりなし
    } else if (shit1Data != newData) {
        let stackText = textDiff(shit1Data, newData);
        if(stackText.statusJIMAKU == "continue"){
            output += stackText.outputText.trim();
        } else {
            //outputの転送
            // let tmpText = stackText.outputText;
            // console.log("転送します",tmpText)
            output += stackText.outputText.trim();

            chrome.runtime.sendMessage({ msg:output }, function (item) {
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
            // output = stackText.outputText.trim();
            output = "";

        }

    } else {
        // console.log("例外",shitreg,newData);
    }
    shitreg = newData;
    return {shitreg:currentData, currentData:"",outputStack:output,username:obj.username}
}


function textDiff(pre, post){
    let concatText = pre + post;
    // 正規表現を使用して5文字以上連続して繰り返している部分を検索
    let regex = /(.{4,})\1/g;
    let matches = concatText.match(regex);
    let statusJIMAKU = "";
    if (matches) {
      let textlength = (-1)*(matches[0].length) / 2;
    //   let matchTar = matches[0].substring(0, textlength);
        outputText = pre.slice(0, textlength);
        statusJIMAKU = "continue";
    } else {
        let concatTextRe = post + pre;
        let matchesRe = concatTextRe.match(regex);
        if (matchesRe) {
         //ロード問題の可能性あるためいったん放置

            statusJIMAKU = "continue";
            outputText = ""

        } else {
            outputText = pre;
            statusJIMAKU = "done";
        }
    }
    return {outputText:outputText,statusJIMAKU:statusJIMAKU}
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
      return false;
    }
    const Chars1 = string1.substring(0, 4);
    const Chars2 = string2.substring(0, 4);
    return (Chars1 === Chars2);
  }