

// /**
//  * 騎手の賞金を取得するメイン
//  * @param {object} umabanJockeyUrls 
//  * @param {int} idx 
//  * @param {array} umabanShokinArr
//  * @param {function} getJockeyShokinCallback
//  */
// var getJockeyShokinMain = function(umabanJockeyUrls,idx,umabanShokinArr,getJockeyShokinCallback){
//     var jockeyUrl = umabanJockeyUrls[idx].jockeyUrl;
//     var umaban = umabanJockeyUrls[idx].umaban;
//     var goukeiShokin = 0;


//     var xhr = new XMLHttpRequest();
//     // xhr.onload = function() {
//     //     console.log(this.responseXML.title);
//     // };
//     xhr.open("GET", jockeyUrl, true);
//     // xhr.responseType = "document";

//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             // var resp = eval("(" + xhr.responseText + ")");
//             console.log( xhr.responseText );
//         }
//     }
//     xhr.send();

//     // $.ajax(jockeyUrl, {
//     //     timeout : 1000, // 1000 ms
//     //     datatype:'html',
//     //     async: true
//     // }).then(function(data){
//     //     var ths = $(data).find('table.race_table_01 thead tr th');
//     //     var idxShokin = 0;
//     //     for(var i = 0;i < ths.length;i++){
//     //         if(ths[i].text().indexOf("賞金") > -1){
//     //             idxShokin = i;
//     //         }
//     //     }
//     //     var rows = $(data).find('table.race_table_01 tbody tr');
//     //     for(var i = 0;i < rows.length;i++){
//     //         var row = rows[i];
//     //         var shokinStr = row[idxShokin];
//     //         var shokin = Number(shokinStr);
//     //         if(!isNaN(shokin)){
//     //             goukeiShokin += shokin;
//     //         }
//     //     }
//     //     umabanShokinArr.push({umaban: umaban,goukeiShokin: goukeiShokin});
//     //     //全ての騎手の賞金を取り終えたかチェック。まだなら再帰呼び出し。全て終わったら、最後のコールバックを呼び出す
//     //     if(umabanShokinArr.length < umabanJockeyUrls.length){
//     //         getJockeyShokinMain(umabanJockeyUrls,++idx,umabanShokinArr, getJockeyShokinCallback);
//     //     }else{
//     //         console.log(umabanShokinArr);
//     //         getJockeyShokinCallback();
//     //     }
//     // });
// }