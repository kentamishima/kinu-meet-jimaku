
/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable */

let log = [  '【太陽】鎌田,ありがとうございます。 はい、でてなるとこの職務内容を満たす ってなるといわゆる 経験者でして、もう ズバッと 監査法人\n,',
'【太陽】鎌田,ありがとうございます。 はい、でてなるとこの職務内容を満たす ってなるといわゆる 経験者でして、もう ズバッと\n,',
]

let output = {shitreg:"",currentData:"",outputStack:"",username:""};
let firstCall = true;
let shitreg = "";
for(let n=0;n<log.length;n++){
  // console.log(n,"_____")

  let rawAry = log[n].split(",");
  // console.log("【S_output】",output)
  // console.log("【rawAry】",rawAry)

  let isUserName = rawAry[0];
  if(isUserName != null){
      let shit1Data = kutouten(shitreg);
      let userNameText = rawAry[0];
      let isChangeUser = false;
      if(output.username == userNameText){
          //特に処理する必要ないけどいつかカウンティングするなら利用
      } else if ( output.username != userNameText ) {
          //強制的に新スレッドにする処理をいれねば
          let outputStrChangeUser = output.outputStack + output.shitreg;
          let userNameChangeUser = output.username;
          // console.log("【ユーザー変更】", userNameChangeUser, outputStrChangeUser)
          console.log(userNameChangeUser, ">c> ", outputStrChangeUser)
          isChangeUser = true;

          output = {shitreg:"",currentData:"",outputStack:"",username:userNameText};
      } else {
          output.username = userNameText;
      }
      
      //最後のtoker
      let newData = kutouten(rawAry[1]);
      // console.log(i, output.username, newData);
      if ( newData == "" ){//NewDataが処理されない問題用の検証でしょり
          // console.log("呼び出しチェック")

      } else if (shit1Data != newData || isChangeUser) {
          
          output.currentData = newData;
          // console.log("【output】",output)
          //異なるデータがきている時の処理
          output = margeMessage(output);
      }
      shitreg = newData;
      // console.log("【E_output】",output)

  } else if (output.shitreg) {
      //isUserNameがnullでもデータがある場合outputを利用して書き込む
      let outputStr = output.outputStack + output.shitreg;
      console.log(isUserName, ">n> ", outputStr)
      // console.log("【転送します】", isUserName, outputStr)

      output = {shitreg:"",currentData:"",outputStack:"",username:""};
  }

}

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
          console.log(userName, ">m> ", output)
          // console.log("【転送します】", userName, output)

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

function kutouten (sentence) { // 末尾が句読点である場合は削除する
  if (sentence) {
    if (sentence.endsWith('。')) {
      sentence = sentence.slice(0, -1)
    }
  }
  return sentence
}

function check4Characters (string1, string2) {
  // 文字列の長さが5未満の場合は、一致しないとみなす
  if (string1.length < 4 || string2.length < 4) {
    return true
  }
  const Chars1 = string1.substring(0, 4)
  const Chars2 = string2.substring(0, 4)
  return (Chars1 === Chars2)
}

function removePunctuation (text) {
  const punctuationRegex = /[。、！？]/g
  const spaceRegex = /\s+/g

  const removedPunctuation = text.replace(punctuationRegex, '')
    .replace(spaceRegex, '')

  return removedPunctuation
}

function yyyymmdd () {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

  const result = `${year}-${month}-${day}`
  return result
}
