
/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable */
// let log = [
//   "ロープ 落ちてたなあと 魚もいた こいつを調理できれば話は早いんだけどね。 残念ながら肉が望まれている。 箱も拾った大砲も何かありそうですが、ダメか？\n",
//   "箱も拾った大砲も何かありそうですが、ダメか？ ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 ふむ\n",
//   "箱も拾った大砲も何かありそうですが、ダメか？ ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？\n",
//   "ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ロープ\n",
//   "ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ くっついた\n",
//   "ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ\n",
//   "これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ロープ くっついた。 これは うってつけた？\n",
//   "これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ くっついた。 これは\n",
//   "そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ くっついた。 これは うってつけた木箱もいけるかな？ 行けたわえ。 あとどうするんだ。 残り かそうと\n",
// ]

let log = [
  "ロープ 落ちてたなあと 魚もいた こいつを調理できれば話は早いんだけどね。 残念ながら肉が望まれている。 箱も拾った大砲も何かありそうですが、ダメか？ ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 ふむ\n",
  "箱も拾った大砲も何かありそうですが、ダメか？ ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？\n",
  "ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ロープ\n",
  "ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ くっついた\n",
  "ブーツの底に詰まってた海藻を入手した。 これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ\n",
  "これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ロープ くっついた。 これは うってつけた？\n",
  "これを食わされるのか？ 素材ではないなあ ってことだろうね。 そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ くっついた。 これは\n",
  "そこら辺調べ直してみるか？ うってつけのシャックルがあった。 ープ くっついた。 これは うってつけた木箱もいけるかな？ 行けたわえ。 あとどうするんだ。 残り かそうと\n",
]

// for(let i=1;i<log.length;i++){
//   let sentence1 = log[i-1];
//   let sentence2 = log[i];
//   const similarity = calculateCosineSimilarity(sentence1, sentence2);
//   console.log("Cosine similarity:", similarity);
//   console.log("wordAryMAtch:", wordAryMAtch(sentence1, sentence2));
// }

const delimiterPattern = /[\s]+/;
// テキストを区切り文字で分割し、単語の配列を取得する
let w0 = log[0].split(delimiterPattern);
let w1 = log[1].split(delimiterPattern);
let w2 = log[2].split(delimiterPattern);

let x1 = wordAryMAtch(w0, w1);
console.log(x1)
// let x2 = wordAryMAtch(x1, w2);
// console.log(x2)


// wordAryMAtch(log[1], log[2]);
function wordAryMAtch(preWords, postWords){
  let diffAry = [];
  let outdata = [];
  //pre  post 正順チェック
  let fwd_action = [], back_action
  for(let i=0;i<preWords.length;i++){
    let index = postWords.indexOf(preWords[i]);
    console.log(index,preWords[i])
    if(index != -1){
      fwd_action.push({idxBase:i, idxTar:index,word:preWords[i]});
    } 
  }
  console.log(fwd_action)
  //pre  post 逆順チェック
  for(let i=0;i<postWords.length;i++){
    let index = preWords.indexOf(postWords[i]);
    console.log(index,postWords[i])
    if(index == -1){
      back_action = {idx:i, word:postWords[i]};
    }
  }
  console.log("【diffAry】",fwd_action,back_action)


  let post_2
  if(fwd_action.length > 0){
    //位置の検証をした方がいいがとりあえずはファースト一致のみ
    let shitnum = fwd_action[0].idxBase
    let shiftpos = fwd_action[0].idxTar
    console.log("shiftpos,shitnum",shiftpos,shitnum)
    let firstPart = postWords.slice(0, shiftpos);
    let secondPart = postWords.slice(shiftpos);

    post_2 = [...firstPart,...Array(shitnum),...secondPart]
    console.log(post_2)
  }

  for(let i=0;i<post_2.length;i++){
    if(post_2[i]){
      diffAry.push(post_2[i]);
    } else if(preWords[i]){
      diffAry.push(preWords[i]);
    } else {

    }
  }
  return diffAry

}



function calculateCosineSimilarity(a, b) {
  const getWordFrequencies = (text) => {
    const delimiterPattern = /[、。，．！？\s]+/;
    // テキストを区切り文字で分割し、単語の配列を取得する
    const words = text.split(delimiterPattern);
    const frequencies = {};
    for (const word of words) {
      frequencies[word] = (frequencies[word] || 0) + 1;
    }
    return frequencies;
  };

  const dotProduct = (a, b) => {
    let product = 0;
    for (const key in a) {
      if (b.hasOwnProperty(key)) {
        product += a[key] * b[key];
      }
    }
    return product;
  };

  const norm = (vector) => {
    let sumOfSquares = 0;
    for (const key in vector) {
      sumOfSquares += vector[key] ** 2;
    }
    return Math.sqrt(sumOfSquares);
  };

  const frequencyA = getWordFrequencies(a);
  const frequencyB = getWordFrequencies(b);

  const dotProd = dotProduct(frequencyA, frequencyB);
  const normA = norm(frequencyA);
  const normB = norm(frequencyB);

  return dotProd / (normA * normB);
}

