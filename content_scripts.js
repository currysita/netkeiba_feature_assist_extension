/// <reference path="./ageweighttable.js" />
/// <reference path="./standard.js" />
/// <reference path="./JockeyWinPer.js" />

/**
 * タイム指数を取る。
 */
var funcTimeScore = function(rows){
    
    var logStr = "";
    //タイトル文字列生成
    logStr += "馬番\t名前\tタイム指数\tT(標準化)\n";
    if(rows.length == 0){
        console.log("タイム指数の結果が取得できないよ");
        return;
    }
    var dataRows = rows.slice(2);

    var speedObjectLit = {};

    var funcDataRow = function(idx, dataRow){
        var tds = $(dataRow).find('td');
        var umaban = $(tds[1]).text();
        var umaName = $(tds[2]).text();
        var speedList = [];
        var speedTmp1 = $(tds[11]).text().trim();
        var speedTmp2 = $(tds[12]).text().trim();
        
        var speed2 = Number(speedTmp2.replace('*',''));
        if(!isNaN(speed2)){
            speedList.push(speed2)
        }
        var speedSum = 0;
        $.each(speedList,function(idx,speed){
            speedSum += speed;
        })
        speed = speedSum / speedList.length;

        // logStr += (umaban + "\t" + umaName + "\t" + speed + "\n");
        var oneSpeed = {umaban: umaban, umaName: umaName, speed: speed};
        speedObjectLit[umaban] = oneSpeed;
    }
    $.each(dataRows, funcDataRow);

    
    var keys = Object.keys(speedObjectLit);
    var umabanSpeedTable = {};
    keys.forEach(key => {
        umabanSpeedTable[key] = speedObjectLit[key].speed;
    });
    var speedStandardTable = funcStandard01to2(umabanSpeedTable);
    keys.forEach(key => {
        var currentSpeed = speedStandardTable[key];
        speedObjectLit[key].SpeedStandard = currentSpeed;
    });

    //馬番とタイム指数のオブジェクトにする
    var timeScoreTable = {};
    keys.forEach(umaban => {
        var oneSpeed = speedObjectLit[umaban];
        var obj = {};
        obj["umaban"] = oneSpeed.umaban;
        obj["speed"] = isNaN(oneSpeed.speed) ? 0 : oneSpeed.speed;
        obj["SpeedStandard"] = isNaN(oneSpeed.SpeedStandard) ? 0 : oneSpeed.SpeedStandard;
        timeScoreTable[umaban] = obj;
        // logStr += oneSpeed.umaban + "\t" + oneSpeed.umaName + "\t" + oneSpeed.speed + "\t" + oneSpeed.SpeedStandard + "\n";
    });
    return timeScoreTable;
};

/**
 * コース適性オブジェクト
 * @param int distance
 * @param int order
 * @param int headCount
 */
class CourseTekiseiObj {
    constructor(distance, order, headCount) {
        this.distance = distance;
        this.order = order;
        this.headCount = headCount;
    }
}
/**
 * 合計値を返す
 * @param {馬番号と目的の値のテーブル} targetTable 
 */
var funcSum = function(targetTable){
    var keys = Object.keys(targetTable);
    var sum = 0;
    keys.forEach(key => {
        var current = Number(targetTable[key]);
        sum += current;
    });
    return sum;
}

/**
 * メイン処理
 */
var makeUmahashiraData = function(){
    //レース情報
    var raceData = $('dl.racedata');
    //レースID
    var raceId = getRaceId();
    //レースIDから競馬場IDと競馬場名を取得
    var raceTrackId = getRaceTrackId(raceId);
    var raceTrackName = raceTrackTable[raceTrackId];

    var currentDistance = 0;
    
    if(raceData.find("dd p span").length > 0){ //地方競馬の場合
        var courceData = raceData.find("dd p span");
        var courceDataArr = courceData.html().split('&nbsp;')
        var distanceTmp = courceDataArr[0].replace(/[^0-9\+\-]/g,"");
        currentDistance = Number(distanceTmp);
    }else if(raceData.find("dd p").length > 0){//JRAの場合
        var courceData = raceData.find("dd p:first");
        var courceDataArr = courceData.html().split('&nbsp;');
        var distanceTmp = courceDataArr[0].replace(/[^0-9\+\-]/g,"");
        currentDistance = Number(distanceTmp);
    }

    //馬情報
    var rows = $('table.shutuba_table tr');
    var headerRow = rows[0];
    var idxUmaName = 0;
    var idxOdds = 0;
    var idxZenso = 0;
    var idxKinryo = 0;//斤量、機種名
    //インデクスを探す
    var findIdx = function(headerRow){
        var ths = $(headerRow).find('th');
        for(var i = 0;i < ths.length;i++){
            if(ths[i].textContent.indexOf("馬名") > -1){
                idxUmaName = i;
            }else if(ths[i].textContent.indexOf("単オッズ") > -1){
                idxOdds = i;
            }else if(ths[i].textContent.indexOf("予想オッズ") > -1){
                idxOdds = i;
            }
            else if(ths[i].textContent.indexOf("前走") > -1){
                idxZenso = i;
            }else if(ths[i].textContent.indexOf("斤量") > -1){
                idxKinryo = i;
            }
        }
    }
    findIdx(headerRow);

    var dataRows = rows.slice(1);
    var winPointTable = {};
    var funcDataRow = function(idx, dataRow){
        var tds = $(dataRow).find('td');
        var umabanTd = tds[1];
        var umaban = $(umabanTd).text();
        var topPrizePointList = [];//馬一頭分の上位入賞ポイント。頭数中の何位かを数値化している。
        var umaName = $(tds[idxUmaName]).find("span.h_name").text();
        //馬体重と増減
        var umaTaiju = 0;
        var umaTaijuZougen = 0;
        var umaTaijuStr = $(tds[idxUmaName]).find(".weight").text()
        if(umaTaijuStr.indexOf(" (")){
            var tmpArr = umaTaijuStr.split(" ");
            umaTaiju = Number(tmpArr[0]);
            umaTaijuZougen = Number(tmpArr[1].replace(/[^0-9\+\-]/g,''));
        }
        //斤量と機種名のところ
        var kinryoKisyu = $(tds[idxKinryo]).html();
        var kinryoKisyuArr = kinryoKisyu.split("<br>");
        var kinryoKisyuRow1 = kinryoKisyuArr[0];
        var sex = null;//性別
        var age = null;//年齢
        if(kinryoKisyuRow1.indexOf("/") > -1){
            var sexAndAgeTmp = kinryoKisyuRow1.split("/")[0];
            sex = sexAndAgeTmp.substring(0,1);
            age = sexAndAgeTmp.substring(1,2);
        }
        //騎手のURLを取得
        var jockeyUrl = "";
        if($(kinryoKisyuArr[2]).attr("href").length > 0){
            jockeyUrl = $(kinryoKisyuArr[2]).attr("href");
        }
        // console.log("jockeyUrl = " + jockeyUrl);
        //年齢指数。5歳が最も強く、そこから離れるほど数値が下がる。絶対値のマイナスを使用する。
        var agePoint = Math.abs(age - 5) * -1;

        //オッズ
        //オッズはレースの直前にならないと表示されないため、ないことを想定する
        // if(idxOdds > 0){
            var oddsTmp = $(tds[idxOdds]).html();
            var odds = null;
            if(oddsTmp.indexOf("取消") == -1){
                odds = oddsTmp.split("<br")[0].trim();
            }
        // }else{
        //     odds = 0;
        // }
        /* ここから馬柱 */
        //馬柱生成。前走のインデックス以降を全て取る
        var hashiraTds = tds.slice(idxZenso);
        var timeList = [];//前走のタイムのリスト。メートル毎秒。小数点1桁。
        //直前タイムと、平均タイム
        var prevTime = null;
        var avgTime = null;
        //直前の距離と今回の距離
        var prevDistance = null;
        //上がり3ハロン
        var agari3Haron = null;
        //今回以上の距離を何回走ってるか
        var runCountFromDistanc = 0;
        //コース適性算出オブジェクト
        var courseTekiseiObjList = [];
        //勝利の強さ。2着以内で、着差の秒が-0.2以上をカウントする
        var katikataPointList = [];

        //1つの馬の柱を全てなめて、WinPointを取得していく
        //1つの馬について、1回のループで1回のレースを取得する
        for(var i = 0;i < hashiraTds.length;i++){
            var td = hashiraTds[i];
            
            //順位と頭数
            var hashiraOrder = $(td).find('span.order').text();//順位
            hashiraOrder = hashiraOrder.trim();
            var hashiraHead = $(td).find('span.race_data').text();//何頭立てか
            if(hashiraOrder 
                && hashiraOrder.indexOf("中")　=== -1
                && hashiraOrder.indexOf("取")　=== -1 
                && hashiraOrder.indexOf("除")　=== -1 
                && hashiraHead.indexOf('頭') > -1){
                hashiraHead = hashiraHead.split('頭')[0];
                
                //勝利馬の名前と、着差のspan。勝ち方の算出に使用する。
                var tyakusa = 0;
                if($(td).find('span.h_name_01').length > 0){
                    var tyakusaSpan = $(td).find('span.h_name_01')[0];
                    var tyakusaStr = tyakusaSpan.innerHTML.split('(')[1].replace(/[^0-9\+\-\.]/g,"");
                    tyakusa = Number(tyakusaStr);
                }
                
                var racebox = $(td).find('div.racebox');
                if(racebox && racebox.length > 0){
                    var raceboxArr = racebox.html().split('<br>');
                    if(raceboxArr && raceboxArr.length >= 1){
                        var raceTimeTmp = raceboxArr[1].trim();
                        var raceInfoArr = raceTimeTmp.split('&nbsp;');
                        if(raceInfoArr && raceInfoArr.length >= 2){
                            //コースの長さ
                            var hashiraDistance = Number(raceInfoArr[0].replace(/[^0-9]/g,''));
                            var minuteStrArr = raceInfoArr[1].split(':');
                            var minute = Number(minuteStrArr[0]);
                            var second = Number(minuteStrArr[1]);
                            var time = hashiraDistance / ((minute * 60) + second);
                            timeList.push(time);
                            //直前のレースのタイムを算出
                            if(prevTime === null){
                                prevTime = time;
                            }
                            //直前のレースの距離を算出
                            if(prevDistance === null){
                                prevDistance = hashiraDistance;
                            }
                            //コース適性オブジェクトの生成。後でコース適性を判断するため。
                            courseTekiseiObjList.push(new CourseTekiseiObj(hashiraDistance, hashiraOrder, hashiraHead));
                            //勝ち方ポイントリストに追加。2着以内、着差-0.2以上
                            if(hashiraOrder <= 2 && tyakusa <= 0.2){
                                katikataPointList.push(tyakusa);
                            }
                            //今回以上の距離で何度走った事があるか
                            if(hashiraDistance >= currentDistance){
                                runCountFromDistanc++;
                            }
                        }
                    }
                }
                if(!agari3Haron){//上がり3ハロンは1度しか取らない事    
                    var raceCorner = $(td).find('span.race_corner');
                    if(raceCorner && raceCorner.length > 0 && raceCorner[0].innerHTML.indexOf("&nbsp;") > -1){
                        var haronTmpArr = raceCorner[0].innerHTML.split("&nbsp;");
                        agari3Haron = haronTmpArr[1].replace(/[^0-9\.]/g,'');
                    }
                }
            }
        }
        if(timeList && timeList.length > 0){
            var avgTimeSumTmp = 0;
            for(var i = 0;i < timeList.length;i++){
                avgTimeSumTmp += Number(timeList[i]);
            }
            avgTime = avgTimeSumTmp / timeList.length;
        }
        var courseTekiseiFlg = 0;
        var courseTekisei2Avg = 0;
        //コース適性を算出。
        if(courseTekiseiObjList.length > 0){
            //コース適性その1。より長いコースで不調であった馬を見つけ出す
            var greaterTyakujunPointList = [];
            var lesserTyakujunPointList = [];
            for(var i = 0;i < courseTekiseiObjList.length;i++){
                var courseTekisei = courseTekiseiObjList[i];
                //今回のコースより長い距離の平均着順ポイント
                if(currentDistance < courseTekisei.distance){
                    var greaterTyakujunPoint = courseTekisei.order / courseTekisei.headCount;
                    greaterTyakujunPointList.push(greaterTyakujunPoint);
                }else{//今回のコースと同じか、より短いコースの着順ポイント。後で平均を取る
                    var lesserTyakujunPoint = courseTekisei.order / courseTekisei.headCount;
                    lesserTyakujunPointList.push(lesserTyakujunPoint);
                }
            }
            //着順を割合で算出する。低いほど良い着順。
            var tmpGreaterAvg = 0.0;
            if(greaterTyakujunPointList.length > 0){
                tmpGreaterAvg = funcSum(greaterTyakujunPointList) / greaterTyakujunPointList.length;
            }
            var tmpLesserAvg = 0.0;
            if(lesserTyakujunPointList.length > 0){
                tmpLesserAvg = funcSum(lesserTyakujunPointList) / lesserTyakujunPointList.length;
                if(!isNaN(tmpGreaterAvg) && !isNaN(tmpLesserAvg)){
                    if(tmpGreaterAvg > tmpLesserAvg){
                        courseTekiseiFlg = 1;
                    }
                }
            }
            //コース適性を算出、その2。より近い距離を走っている。
            var courseTekisei2Sum = 0;
            for(var i = 0;i < courseTekiseiObjList.length;i++){
                var courseTekisei = courseTekiseiObjList[i];
                courseTekisei2Sum += currentDistance - courseTekisei.distance;
            }
            courseTekisei2Avg = courseTekisei2Sum / courseTekiseiObjList.length;
        }

        //勝ち方ポイントの平均値
        var katikataPointAvg = 0;
        if(katikataPointList.length > 0){
            var katikataPointSum = funcSum(katikataPointList);
            katikataPointAvg = katikataPointSum / katikataPointList.length;
        }else{
            katikataPointAvg = 0.3;//0.2以下を評価するので、値が無いものはそれより悪くしないといけません。
        }

        //上位入賞ポイントを算出する
        topPrizePointList = makeTopPrizePointList(hashiraTds, currentDistance);

        //オブジェクト生成
        var tmp = {};
        tmp["umaban"] = umaban;
        tmp["umaName"] = umaName;
        tmp["sex"] = sex;
        tmp["age"] = age;
        tmp["jockeyUrl"] = jockeyUrl;
        tmp["agePoint"] = agePoint;
        tmp["odds"] = odds;
        tmp["oddsStd"] = null;
        tmp["umaTaiju"] = umaTaiju;
        tmp["umaTaijuStd"] = 0;
        tmp["umaTaijuZougen"] = umaTaijuZougen;
        tmp["umaTaijuZougenStd"] = 0;
        tmp["haron"] = (agari3Haron === null) ? 0 : agari3Haron;
        tmp["currentDistance"] = currentDistance;
        tmp["prevDistance"] = (prevDistance === null) ? 0 : prevDistance;
        // tmp["prevWinPoint"] = (prevWinPoint === null) ? 0 : prevWinPoint;
        tmp["topPrizePointList"] = topPrizePointList;
        // tmp["winPointAverage"] = winPointAverage;
        // tmp["winPointBunsan"] = winPointBunsan;
        tmp["courseTekiseiFlg"] = courseTekiseiFlg;
        tmp["courseTekisei2Avg"] = courseTekisei2Avg;
        tmp["prevTime"] = (prevTime === null) ? 0 : prevTime;
        tmp["avgTime"] = avgTime;
        tmp["katikataPointAvg"] = katikataPointAvg;
        tmp["runCountFromDistanc"] = runCountFromDistanc;//今回のコース以上の距離を何回走ったか
        tmp["runCountFromDistancAvg"] = runCountFromDistanc / hashiraTds.length;
        winPointTable[umaban] = tmp;
    };

    //データの生成 標準偏差など全体のデータの作成は、これより後にしてください
    $.each(dataRows,funcDataRow);
    
    //馬番の配列を取得
    var keys = Object.keys(winPointTable);

    //年齢Pを標準化します
    var agePointTable = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        agePointTable[key] = oneWinPoint.agePoint;
    });
    var agePointStandardTable = funcStandard01to2(agePointTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var agePointStandard = agePointStandardTable[key];
        if(isNaN(agePointStandard))
            agePointStandard = 0;
        oneWinPoint["agePointStandard"] = agePointStandard.toFixed(2);
    });

    //ハロンを標準化します
    var haronTable = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        haronTable[key] = Number(oneWinPoint.haron) * -1; //低いほど強いので、マイナスの値にする
    });
    var haronStandardTable = funcStandard01to2(haronTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var haronStandard = haronStandardTable[key];
        oneWinPoint["haronStandard"] = haronStandard.toFixed(5);
    });
    //オッズを標準化。低いほど強い
    var oddsTable = {};//オッズランクを生成するため、オッズをテーブルに格納する
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        if(oneWinPoint.odds !== null){
            oddsTable[key] = Number(oneWinPoint.odds);
        }else {
            oddsTable[key] = 0;
        }
    });
    //オッズランクをテーブルで返す
    var funcOddsRank = function(umabanValueTable){
        var keys = Object.keys(umabanValueTable);
        var oddsList = [];
        keys.forEach(key => {
            oddsList.push(Number(umabanValueTable[key]));
        });
        oddsList.sort(function(a,b){ return a - b});
        var oddsRankTable = {};
        for(var i = 0;i < oddsList.length;i++){
            keys.forEach(key => {
                if(oddsList[i] == umabanValueTable[key]){
                    oddsRankTable[key] = i+1;
                }
            });
        }
        return oddsRankTable;
    }
    //オッズランクを生成して結果に追加する
    var oddsRankTable = funcOddsRank(oddsTable);
    if(oddsRankTable){
        keys.forEach(key => {
            var oneWinPoint = winPointTable[key];
            var oneOddsRank = oddsRankTable[key];
            if(!isNaN(Number(oneOddsRank))){
                oneWinPoint["oddsRank"] = oneOddsRank;
            }
        });
    }
    //オッズランクの正規化のためのテーブル
    var oddsTableForStd = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        if(!isNaN(oneWinPoint.oddsRank)){
            oddsTableForStd[key] = oneWinPoint.oddsRank * -1;
        }
    });

    var oddsRankStdTable = funcStandard01to2(oddsTableForStd);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var oddsRankStd = oddsRankStdTable[key];
        if(!isNaN(oddsRankStd)){
            oneWinPoint["oddsRankStd"] = oddsRankStd.toFixed(5);
        }else{
            oneWinPoint["oddsRankStd"] = 0;
        }
    });

    //体重を標準化します
    var umabanTaijuTable = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        umabanTaijuTable[key] = oneWinPoint.umaTaiju;
    });
    var umaTaijuStandardTable = funcStandard01to2(umabanTaijuTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var umaTaijuStandard = umaTaijuStandardTable[key];
        oneWinPoint["umaTaijuStd"] = umaTaijuStandard.toFixed(2);
    });

    //体重増減標準化 他の標準化と異なり、専用の値を使用する事
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var age = oneWinPoint.age;
        var umaTaijuZougen = oneWinPoint.umaTaijuZougen;
        oneWinPoint["umaTaijuZougenStd"] = getAgeDhWeightStd(age, umaTaijuZougen);
    });

    //直前タイムを標準化
    var umabanPrevTimeTable = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        umabanPrevTimeTable[key] = oneWinPoint.prevTime;
    });
    var prevTimeStandardTable = funcStandard01to2(umabanPrevTimeTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var prevTimeStandard = prevTimeStandardTable[key];
        oneWinPoint["prevTimeStandard"] = prevTimeStandard.toFixed(3);
    });

    //平均タイムを標準化
    var umabanAvgTimeTable = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        umabanAvgTimeTable[key] = oneWinPoint.avgTime;
    });
    var avgTimeStandardTable = funcStandard01to2(umabanAvgTimeTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var avgTimeStandard = avgTimeStandardTable[key];
        oneWinPoint["avgTimeStandard"] = avgTimeStandard.toFixed(2);
    });

    //勝ち方ポイントを標準化。低いほどよい。一着はマイナスの値が入っている。値を計算する前に-1をかけて+-を逆転させてください。
    var katikataPointAvgTable = {};

    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        katikataPointAvgTable[key] = oneWinPoint.katikataPointAvg * -1;         
    });
    var katikataPointStandardTable = funcStandard01to2(katikataPointAvgTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var katikataPointStg = katikataPointStandardTable[key];
        if(isNaN(katikataPointStg)){
            katikataPointStg = 0;
        }
        oneWinPoint["katikataPointStg"] = katikataPointStg.toFixed(2);
    });

    //コース適性2の標準化。+-がありますが、離れているほど不利なので、絶対値にした後-1して計算してください。
    var courseTekisei2AvgTable = {};
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        courseTekisei2AvgTable[key] =　Math.abs(oneWinPoint.courseTekisei2Avg) * -1;
    });
    var courseTekisei2StdTable = funcStandard01to2(courseTekisei2AvgTable);
    keys.forEach(key => {
        var oneWinPoint = winPointTable[key];
        var courseTekisei2Std = courseTekisei2StdTable[key];

        oneWinPoint["courseTekisei2Std"] = (isNaN(courseTekisei2Std)) ? 0 : courseTekisei2Std.toFixed(2);
    });

    //上位入賞ポイントを標準化する
    var topPrizePointAvgTable = {};
    keys.forEach(umaban => {
        var oneWinPoint = winPointTable[umaban];
        var topPrizeList = oneWinPoint.topPrizePointList;//上位入賞ポイントのリスト
        var topPrizeSum = 0;
        topPrizeList.forEach(topPrize => {
            topPrizeSum += topPrize;
        });
        var topPrizeAvg = topPrizeSum / topPrizeList.length;
        topPrizePointAvgTable[umaban] = topPrizeAvg;
    });
    var topPrizePointTable = funcStandard01to2(topPrizePointAvgTable);
    keys.forEach(umaban => {
        var oneWinPoint = winPointTable[umaban];
        var topPrizePointStd = topPrizePointTable[umaban];
        
        oneWinPoint["topPrizePointStd"] = isNaN(topPrizePointStd) ? 0 : topPrizePointStd.toFixed(2);
    });

    //タイム指数を取得するAjax呼び出し。
    //その後にコンソール出力
    var funcJockeyWinPerAjax = function(raceId,timeScoreTable){
        $.ajax('/?pid=data&id=c' + raceId + '&mode=top', {
            timeout : 1000, // 1000 ms
            datatype:'html',
            async: true
        }).then(function(data){
            var jockeyWinPerTable = funcJockeyWinPer(data);
            console.log("戻り値" + jockeyWinPerTable);
            //標準化
            var jockeyWinPerStdTable = funcStandard01to2(jockeyWinPerTable);
            consoleOutput(winPointTable, timeScoreTable,jockeyWinPerStdTable);
        });
    };
    var rows = [];
    $.ajax('/?pid=speed&id=c' + raceId, {
        timeout : 1000, // 1000 ms
        datatype:'html',
        async: true
    }).then(function(data){
        rows = $(data).find('table.race_table_01 tr');
        var timeScoreTable = funcTimeScore(rows);
        funcJockeyWinPerAjax(raceId, timeScoreTable);
        // var callback2 = consoleOutput(winPointTable, timeScoreTable);
        // var jockeyWinPObj = new JockeyWinPer(raceId,winPointTable, timeScoreTable,consoleOutput)
        // jockeyWinPObj.requestAjax();

    });
    
    
};

/**
 * URLからレースIDを取得する
 */
var getRaceId = function(){
    //レースID取得
    var urlParamStr = location.search;
    var urlParams = urlParamStr.substring(urlParamStr.indexOf("?") + 1).split("&");
    var raceId = "";
    for(var i = 0;i < urlParams.length;i++){
        if(urlParams[i].indexOf("id=") > -1){
            raceId = urlParams[i].replace(/[^0-9]/g,"");
        }
    }
    return raceId;
};

/**
 * レースIDから競馬場IDを取得する
 */
var getRaceTrackId = function(raceId){
    var tmpRaceTrackId = raceId.substring(4,2);
    return tmpRaceTrackId;
};

/**
 * 取得した情報をまとめてコンソールに表示する
 */
var consoleOutput = function(winPointTable,timeScoreTable,jockeyWinPerStdTable){

    var logStr = "";
    //タイトル文字列
    logStr += "馬番\t"
        + "名前\t" 
        + "性\t"
        + "歳\t"
        + "歳P標\t"
        + "オッズ\t" 
        + "オ標\t" 
        + "体重\t" 
        // + "体重標準化\t" 
        + "体重増減\t" 
        + "体重増減標準化\t" 
        + "今距離\t"
        + "前距離\t"
        // + "直近WinP\t" 
        + "上位P標\t"
        + "上3ハロ\t" 
        + "ハロ標\t"
        // + "平均WinP\t"
        // + "WinP分散\t" 
        // + "平均WinP標準化\t" 
        + "コース適性\t"
        + "コース適性2\t"
        + "直前タイム\t" 
        // + "平均タイム\t" 
        + "直前タイム標準化\t" 
        // + "平均タイム標準化" +
        + "勝ち方ポイント\t"
        + "より長い距離の割合\t"
        + "馬番(T側)\t"
        + "T指数\t"
        + "T指数標\t"
        + "騎手複勝率標準"
        + "\n";
    $.each(winPointTable,function(idx,winPointData){
        if(!winPointData.odds){
            return;
        }
        var timeScoreObj = timeScoreTable[winPointData.umaban];
        var jockeyWinPerStd = jockeyWinPerStdTable[winPointData.umaban];//騎手ごとの複勝率の正規化
        var tmp = "";
        tmp += winPointData.umaban + "\t";
        tmp += winPointData.umaName + "\t";
        tmp += winPointData.sex + "\t";
        tmp += winPointData.age + "\t";
        tmp += winPointData.agePointStandard + "\t";
        tmp += winPointData.odds + "\t";
        tmp += winPointData.oddsRankStd + "\t";
        tmp += winPointData.umaTaiju + "\t";
        tmp += winPointData.umaTaijuZougen + "\t";
        tmp += winPointData.umaTaijuZougenStd + "\t";
        tmp += winPointData.currentDistance + "\t";
        tmp += winPointData.prevDistance + "\t";
        // tmp += winPointData.prevWinPoint + "\t";
        tmp += winPointData.topPrizePointStd + "\t";
        tmp += winPointData.haron + "\t";
        tmp += winPointData.haronStandard + "\t";
        tmp += winPointData.courseTekiseiFlg + "\t";
        tmp += winPointData.courseTekisei2Std + "\t";
        tmp += winPointData.prevTime + "\t";
        tmp += winPointData.prevTimeStandard + "\t";
        tmp += winPointData.katikataPointStg + "\t";
        // tmp += winPointData.runCountFromDistanc + "\t";
        tmp += winPointData.runCountFromDistancAvg + "\t";
        tmp += timeScoreObj.umaban + "\t";
        tmp += timeScoreObj.speed + "\t";
        tmp += timeScoreObj.SpeedStandard + "\t";
        tmp += jockeyWinPerStd;

        tmp += "\n";
        logStr += tmp;
        
    });
    console.log(logStr);
};

makeUmahashiraData();

// funcTimeScore();