//標準化の関数群です。

//標準化します。引数に馬番をキーとした値を入れる事
//最小値0、最大値1
var funcStandard0To1 = function(targetTable){
    var keys = Object.keys(targetTable);
    var max = null;
    var min = null;
    var standardTable = {};
    //最大値を作る
    keys.forEach(key => {
        var current = Number(targetTable[key]);
        if(!isNaN(current)){
            if(max === null || max < current){
                max = current;
            }
        }
    });
    //最小値を作る
    min = max;
    keys.forEach(key => {
        var current = Number(targetTable[key]);
        if(!isNaN(current)){
            if(min === null || current < min){
                min = current;
            }
        }
    });
    keys.forEach(key => {
        if(isNaN(targetTable[key])){
            standardTable[key] = 0;
        }else{
            standardTable[key] = (targetTable[key] - min) / (max - min);
        }
    });
    return standardTable;
};


//標準化します。引数に馬番をキーとした値を入れる事
//最小値1、最大値2
var funcStandard1to2 = function(targetTable){
    var from = 1;
    var to = 2;
    var keys = Object.keys(targetTable);
    var max = null;
    var min = null;
    var standardTable = {};
    //最大値を作る
    keys.forEach(key => {
        var current = Number(targetTable[key]);
        if(!isNaN(current)){
            if(max === null || max < current){
                max = current;
            }
        }
    });
    //最小値を作る
    min = max;
    keys.forEach(key => {
        var current = Number(targetTable[key]);
        if(!isNaN(current)){
            if(min === null || current < min){
                min = current;
            }
        }
    });
    keys.forEach(key => {
        if(isNaN(targetTable[key])){
            standardTable[key] = from;
        }else{
            var stdTmp = (targetTable[key] - min) / (max - min);

            standardTable[key] = stdTmp * (to - from) + from;
        }
    });
    return standardTable;
};