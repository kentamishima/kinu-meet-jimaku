/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable */


console.log('Hello from the content-script')
clrHL() // とりあえずいれとかないとClasskinusama祭り
searchin()
function searchin () {
    chrome.storage.local.get(["chromememo", "highlight", "highlight_set"], function (value) {
        console.log("hoge",value)
        let value_data = value.chromememo.text;
        let highlight = value.highlight.mode;
        let ng_set = value.highlight_set.ngsales.ary;
        console.log("モード", highlight);

        if (value_data != "" || ng_set != []) {
            let sword = [];
            let not_word = [];
            let keyary = [];
            let detailary = [];

            let tar_Sentence = { alert: false, alert_words: {} };
            //改行の時の処理
            let temp_sword = [];
            if (highlight == "indention") {
                temp_sword = value_data.split("\n");
                for (let i = 0; i < temp_sword.length; i++) {
                    if (temp_sword[i] != "") {
                        if (temp_sword[i][0] != "-") {
                            sword.push(temp_sword[i]);
                            tar_Sentence[temp_sword[i]] = {};
                        } else {
                            not_word.push(temp_sword[i].slice(1));
                            tar_Sentence[temp_sword[i].slice(1)] = {};
                        }

                    }
                }
            } else {//ブーリアンの処理
                //          temp_sword = value_data.split(/ NOT /gi)[0].slice(2).slice(0, -2).split(/\" OR \"/gi);
                temp_sword = value_data.split(/ NOT /gi)[0].replace(/\(\"|\"\)|^"|"$/ig, "").split(/\" OR \"/gi);

                for (let i = 0; i < temp_sword.length; i++) {
                    if (temp_sword[i] != "") {
                        sword.push(temp_sword[i]);
                        tar_Sentence[temp_sword[i]] = {};
                    }
                }
                if (value_data.indexOf(" NOT ") > -1) {
                    let tmp_not = value_data.split(/ NOT /gi)[1];
                    let not_tmpary = [];
                    not_tmpary = tmp_not.replace(/\(\"|\"\)|^"|"$/ig, "").split(/\" OR \"/gi);

                    for (let i = 0; i < not_tmpary.length; i++) {
                        if (not_tmpary[i] != "") {
                            not_word.push(not_tmpary[i]);
                            tar_Sentence[not_tmpary[i]] = {};
                        }
                    }
                }
            }

            if (ng_set) {
                not_word = not_word.concat(ng_set);
                for (let i = 0; i < ng_set.length; i++) {
                    tar_Sentence[ng_set[i]] = {};
                }
            }

            console.log("検索対象", sword);
            console.log("not対象", not_word);

            let parts = document.querySelector("body");

            let node_ary = searchNodes(parts);
            let alert_flag = false;
            let alert_ctr = 0;
            //console.log(node_ary);
            for (let y = 0; y < node_ary.length; y++) {
                let idname = "newSpan" + y;
                // let idname_n = "newSpan_n" + y;
                //検索対象
                tar_Sentence = multihighlight(
                    node_ary[y],
                    idname,
                    sword,
                    tar_Sentence,
                    keyary,
                    detailary,
                    "idename",
                    "red",
                    not_word
                );
                if (tar_Sentence.alert == true) {
                    alert_flag = true;
                    alert_ctr++
                }
            }

            // chrome.runtime.sendMessage(
            //   { message: tar_Sentence, mode: "highlight" },
            //   function (item) {
            //     // sendMessageのレスポンスが item で取得できるのでそれを使って処理する
            //     if (!item) {
            //       detailary = [];
            //       return;
            //     } else {
            //       if (item.flag) {
            //         console.log(item.flag);
            //       }
            //     }
            //   }
            // );
        }
    });
}

// 再帰を使ったノード探査
function searchNodes(root) {
    var list = [];
    var search = function (node) {
        while (node != null) {
            // 自分を処理
            if (
                node.nodeValue &&
                !node.nodeValue.match(/^\n+$/) &&
                node.parentNode.tagName != "SCRIPT" &&
                node.parentNode.tagName != "NOSCRIPT" &&
                node.parentNode.tagName != "STYLE"
            ) {
                if (node.nodeType == 3) {
                    list.push(node);
                }
            }
            // 子供を再帰
            search(node.firstChild);
            // 次のノードを探査
            node = node.nextSibling;
        }
    };
    search(root.firstChild);
    return list;
}

//いろんなワードでハイライトかつHTMLの崩壊を防いでがんばるよ
function multihighlight(
    tar_node,
    idname,
    sword,
    tar_Sentence,
    keyary,
    detailary,
    // eslint-disable-next-line no-unused-vars
    idename,
    op_color,
    op_word
) {
    let colormap = [
        "#B4CAE0",
        "#B4B4E0",
        "#CAB4E0",
        "#E0B4E0",
        "#E0B4CA",
        "#E0B4B4",
        "#E0CAB4",
        "#E0E0B4",
        "#CAE0B4",
        "#B4E0B4",
        "#B4E0CA",
        "#B4E0E0"
    ];

    if (!idname) { idename = "newSpan" }
    if (!op_word) {
        op_word = [];
    }

    // 対象のタグテキストにSpanの属性を持たせるよ、ダミーをつくって入れ込むながれだね
    var sp1 = document.createElement("span");
    sp1.setAttribute("id", idname);
    sp1.setAttribute("class", "kinusama");

    let sp1_content = document.createTextNode(tar_node.nodeValue);
    sp1.appendChild(sp1_content);

    // 置換に先んじ、参照を代入
    let sp2 = tar_node; // 既存の置換対象ノード
    let parentDiv = sp2.parentNode; // 置換対象ノードの親要素

    // eslint-disable-next-line no-unused-vars
    let hitflag = false;
    let tar_word = sword.concat(op_word);
    let ng_idx = sword.length - 1;
    tar_Sentence.alert = false;

    for (let w = 0; w < tar_word.length; w++) {
        let egexp_low = new RegExp(tar_word[w], "ig");
        if (tar_node.nodeValue.search(egexp_low) >= 0) {
            try {
                parentDiv.replaceChild(sp1, sp2);
                //ここで対象の情報を置換
                let temp_span = document.querySelector("#" + idname);
                for (let x = 0; x < tar_word.length; x++) {
                    let temp_color
                    if (x <= ng_idx) {
                        temp_color = colormap[x % 12];
                    } else if (op_color == "green") {
                        temp_color = "#4ced59";
                    } else if (op_color == "red") {
                        temp_color = "#db0f0f";
                    } else {
                        temp_color = "#db0f0f";
                    }

                    if (temp_span.innerHTML) {
                        //検索結果の前後文の取得
                        let tmp_sen = tar_word[x];
                        //対象のワードがあるかどうか確認
                        if (temp_span.innerText.search(tmp_sen) != -1) {
                            //if (temp_span.innerText.indexOf(tmp_sen) != -1) {
                            //追記リストに指定ワードがないことを確認
                            let temp_point = detailary.indexOf(temp_span.innerText);
                            let len = Object.keys(tar_Sentence[tmp_sen]).length;
                            if (temp_point == -1) {
                                tar_Sentence[tmp_sen][len] = temp_span.innerText;
                                detailary.push(temp_span.innerText);
                                keyary.push(tmp_sen);
                                if (x > ng_idx) {
                                    tar_Sentence.alert = true;

                                    if (!tar_Sentence.alert_words[tar_word[x]]) {
                                        tar_Sentence.alert_words[tar_word[x]] = 0;
                                    }
                                    tar_Sentence.alert_words[tar_word[x]]++;
                                }
                                //console.log(keyary);
                            } else if (keyary[temp_point] != tmp_sen) {
                                tar_Sentence[tmp_sen][len] = temp_span.innerText;
                                detailary.push(temp_span.innerText);
                                keyary.push(tmp_sen);
                                //console.log(keyary);
                                if (x > ng_idx) {
                                    tar_Sentence.alert = true;
                                    if (!tar_Sentence.alert_words[tar_word[x]]) {
                                        tar_Sentence.alert_words[tar_word[x]] = 0;
                                    }
                                    tar_Sentence.alert_words[tar_word[x]]++;
                                }

                            }
                        }
                        hitflag = true;
                        temp_span.innerHTML = str_highlight_text(
                            temp_span.innerHTML,
                            tar_word[x],
                            temp_color
                        );
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return tar_Sentence;
}

function str_highlight_text(string, str_to_highlight, temp_color) {
    var reg = new RegExp(str_to_highlight, "gi");
    return string.replace(reg, function (str) {
        return (
            '<font style="background-color:' + temp_color + '">' + str + "</font>"
        );
    });
}

function clrHL() {
    var cl_list = document.getElementsByClassName("kinusama");
    while (cl_list.length != 0) {
        cl_list[0].parentNode.innerHTML = cl_list[0].parentNode.innerHTML.replace(
            /<("[^"]*"|'[^']*'|[^'">])*>/g,
            ""
        );
    }
}
