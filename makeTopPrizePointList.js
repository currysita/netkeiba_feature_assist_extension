/**
 * 上位入賞ポイントを算出する
 */
var makeTopPrizePointList = function(hashiraTds,distance){
    var topPrizePointList = [];
    
    //1つの馬について、1回のループで1回のレースを取得する
    for(var i = 0;i < hashiraTds.length;i++){

        var td = hashiraTds[i];
        
        //順位と頭数
        var hashiraOrder = $(td).find('span.order').text();//順位
        hashiraOrder = hashiraOrder.trim();
        var hashiraHead = $(td).find('span.race_data').text();//何頭立てか
        //着順が正常に表示されていない物は無視する。何頭立てか解らないレースも除外。通常は出走取消や除外の事を指す。
        if(hashiraOrder 
        && hashiraOrder.indexOf("中")　=== -1
        && hashiraOrder.indexOf("取")　=== -1 
        && hashiraOrder.indexOf("除")　=== -1 
        && hashiraHead.indexOf('頭') > -1){
            hashiraHead = hashiraHead.split('頭')[0];
            var racebox = $(td).find('div.racebox');
            if(racebox && racebox.length > 0){
                var raceboxArr = racebox.html().split('<br>');
                var raceTimeTmp = raceboxArr[1].trim();
                var raceInfoArr = raceTimeTmp.split('&nbsp;');
                //レースの情報がちゃんと書かれている場合のみ取得する
                if(raceInfoArr && raceInfoArr.length >= 2){
                    //コースの長さ
                    var hashiraDistance = raceInfoArr[0].replace(/[^0-9]/g,'');
                    //今回のレースの距離より100メートル以内なら、上位入賞ポイントに含める。今回が1400なら1500までは含めて良い
                    
                    if((distance + 100) >= hashiraDistance){
                        //上位入賞ポイント。分散などの計算に使うため、100倍しておく。
                        var topPrizePoint = (1 - (hashiraOrder / hashiraHead)) * 100;
                        topPrizePointList.push(topPrizePoint);
                    }
                }
            }
            
        }
    }
    return topPrizePointList;
};