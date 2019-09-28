
/**
 * 騎手の複勝率を取る。標準化して使う事
 */
var funcJockeyWinPer = function(data){
    var rows = $(data).find('table.data_table_01 tr');
    var umabanTable = {};
    var umabanRowsArray = [];
    var umabanJockeyWinPer = {};//馬番と騎手の複勝率
    var currentUmaban = 0;
    for(var i = 0;i < rows.length;i++){
        var row = rows[i];
        var ths = $(row).find('th');
        if(ths.length > 0){
            continue;//ヘッダ行は飛ばす
        }
        var tds = $(row).find('td');
        //馬番の列を取得。rowspan=4となってるはず
        var umabanTd = tds[1];
        if(umabanTd.attributes["rowspan"]){
            //馬番が見つかったので、現在の馬番を更新。行を格納する配列を初期化し、1行追加
            currentUmaban = umabanTd.innerText;
            umabanRowsArray = [];
        }
        umabanRowsArray.push(tds);
        umabanTable[currentUmaban] = umabanRowsArray;
    }
    //馬番ごとの行の情報を元に、騎手の複勝率を求めます。
    var keys = Object.keys(umabanTable);
    keys.forEach(umaban => {
        var rowsArray = umabanTable[umaban];
        var jockeyRow = rowsArray[1];
        var winPerStr = rowsArray[1][8].innerText;
        var winPer = Number(winPerStr.replace(/[^0-9\+\-\.]/g,''));
        umabanJockeyWinPer[umaban] = winPer;
    });
    // console.log(umabanTable);
    return umabanJockeyWinPer;
};