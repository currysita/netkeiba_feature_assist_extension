var ageWeightTable = {};
/**
 * 年齢と体重のテーブルを作成する
 */
var makeAgeWeightTable = function(){
    var age2Table = {};
    var age3Table = {};
    var age4Table = {};
    var age5Table = {};
    var age6Table = {};
    var age7Table = {};
    var age8Table = {};
    //2歳だけは特別に、他の年齢とわけて標準化している。2歳の馬が他の年齢の馬と出走する事はない。
    age2Table[-12] = 0;
    age2Table[-11] = 0.0288473811596487;
    age2Table[-10] = 0.140271733309641;
    age2Table[-9] = 0.251696085459634;
    age2Table[-8] = 0.363120437609627;
    age2Table[-7] = 0.474544789759619;
    age2Table[-6] = 0.585969141909612;
    age2Table[-5] = 0.672785751201077;
    age2Table[-4] = 0.759602360492541;
    age2Table[-3] = 0.798025482123907;
    age2Table[-2] = 0.836448603755274;
    age2Table[-1] = 0.862572828880647;
    age2Table[0] = 0.888697054006021;
    age2Table[1] = 0.94434852700301;
    age2Table[2] = 1;
    age2Table[3] = 0.939514061096641;
    age2Table[4] = 0.879028122193282;
    age2Table[5] = 0.816361231165997;
    age2Table[6] = 0.753694340138711;
    age2Table[7] = 0.677547746462456;
    age2Table[8] = 0.6014011527862;
    age2Table[9] = 0.525254559109944;
    age2Table[10] = 0.449107965433689;
    age2Table[11] = 0.372961371757433;
    age2Table[12] = 0.296814778081178;
    age2Table[13] = 0.220668184404922;
    age2Table[14] = 0.144521590728666;
    age2Table[15] = 0;
    
    //3歳以降は、複数の年齢層にまたがるレースで、サンプル数が300を超えるもののみを対象とする。
    age3Table[-20] = 0;
    age3Table[-18] = 0.20597450353816;
    age3Table[-16] = 0.340839361396389;
    age3Table[-14] = 0.361494725214515;
    age3Table[-12] = 0.476085399633587;
    age3Table[-10] = 0.539535204673507;
    age3Table[-8] = 0.60824697993883;
    age3Table[-6] = 0.691626194954497;
    age3Table[-4] = 0.776107700757278;
    age3Table[-2] = 0.825658791094081;
    age3Table[-1] = 0.194185440307034;
    age3Table[0] = 0.675544404498965;
    age3Table[2] = 0.853994088927869;
    age3Table[4] = 0.813440893383683;
    age3Table[6] = 0.753514512918913;
    age3Table[8] = 0.673936237495593;
    age3Table[10] = 0.632150964275764;
    age3Table[12] = 0.636309767346829;
    age3Table[14] = 0.608070128804006;
    age3Table[16] = 0.474894013510366;
    age3Table[18] = 0.394711920492007;
    age3Table[20] = 0.424149995854505;
    age3Table[22] = 0.445640515593066;
    age3Table[24] = 0.44054483721759;
    age4Table[-18] = 0.517745494301229;
    age4Table[-16] = 0.515021673709352;
    age4Table[-14] = 0.678829693225221;
    age4Table[-12] = 0.597495327471825;
    age4Table[-10] = 0.753932657389314;
    age4Table[-8] = 0.792329354460561;
    age4Table[-6] = 0.908557301647073;
    age4Table[-4] = 0.957513741603155;
    age4Table[-2] = 0.933109235469726;
    age4Table[0] = 1;
    age4Table[2] = 0.995441678782325;
    age4Table[4] = 0.961222791239297;
    age4Table[6] = 0.929765271168126;
    age4Table[8] = 0.828354665853705;
    age4Table[10] = 0.816621655643319;
    age4Table[12] = 0.778180985493639;
    age4Table[14] = 0.755404442558824;
    age4Table[16] = 0.556981468764164;
    age4Table[18] = 0.66325435438999;
    age4Table[20] = 0.65009167583425;
    age4Table[22] = 0.479710189367836;
    age5Table[-16] = 0.381470722492242;
    age5Table[-14] = 0.502828955481564;
    age5Table[-12] = 0.56239455456497;
    age5Table[-10] = 0.633117511687056;
    age5Table[-8] = 0.639370645659954;
    age5Table[-6] = 0.797591026160722;
    age5Table[-4] = 0.77613763189155;
    age5Table[-2] = 0.797304333778614;
    age5Table[0] = 0.78276924353136;
    age5Table[2] = 0.772693684678065;
    age5Table[4] = 0.710976269711088;
    age5Table[6] = 0.669119125049922;
    age5Table[8] = 0.600656459775956;
    age5Table[10] = 0.608602036731731;
    age5Table[12] = 0.546366356680822;
    age5Table[14] = 0.508841256933202;
    age5Table[16] = 0.534843152847056;
    age5Table[18] = 0.440370618774374;
    age5Table[20] = 0.466350193177345;
    age6Table[-14] = 0.196124635612862;
    age6Table[-12] = 0.404322482625308;
    age6Table[-10] = 0.373413424129335;
    age6Table[-8] = 0.378593070733588;
    age6Table[-6] = 0.496087203446306;
    age6Table[-4] = 0.557841295158461;
    age6Table[-2] = 0.460087198330249;
    age6Table[0] = 0.515695813665563;
    age6Table[2] = 0.485922967157055;
    age6Table[4] = 0.438114370730271;
    age6Table[6] = 0.367100598742937;
    age6Table[8] = 0.351513288196463;
    age6Table[10] = 0.35333628425081;
    age6Table[12] = 0.376709606030687;
    age6Table[14] = 0.377662749084133;
    age6Table[16] = 0.293808499407217;
    age7Table[-12] = 0.28177854510078;
    age7Table[-10] = 0.279103375703906;
    age7Table[-8] = 0.249168931961172;
    age7Table[-6] = 0.267605459170853;
    age7Table[-4] = 0.323417623668083;
    age7Table[-2] = 0.282858642258356;
    age7Table[0] = 0.413574638837247;
    age7Table[2] = 0.273134704542256;
    age7Table[4] = 0.222858790775246;
    age7Table[6] = 0.346851273923911;
    age7Table[8] = 0.135785716006926;
    age7Table[10] = 0.22252676927433;
    age7Table[12] = 0.0607281347199955;
    age8Table[-6] = 0.228402276601753;
    age8Table[-4] = 0.121169526139458;
    age8Table[-2] = 0.280405561185371;
    age8Table[0] = 0.0739614297485319;
    age8Table[2] = 0.213118306564274;
    age8Table[4] = 0.141713920283857;
    age8Table[6] = 0.227312651062002;
       
    ageWeightTable[2] = age2Table;
    ageWeightTable[3] = age3Table;
    ageWeightTable[4] = age4Table;
    ageWeightTable[5] = age5Table;
    ageWeightTable[6] = age6Table;
    ageWeightTable[7] = age7Table;
    ageWeightTable[8] = age8Table;
};

//年齢と馬体重変動値のテーブルを生成する
makeAgeWeightTable();


/**
 * 動作確認用
 */
var funcAgeWTableOutput = function(){
    var ageKeys = Object.keys(ageWeightTable);
    var sortedAgeKeys = ageKeys.sort((x,y) => (x - y));
    sortedAgeKeys.forEach(age => {
        console.log(age);
        var dhWeightTable = ageWeightTable[age];
        var dhWeightKeys = Object.keys(dhWeightTable);
        var sortedDhWeightKeys = dhWeightKeys.sort((x,y) => (x - y));
        sortedDhWeightKeys.forEach(dhWeightKey=>{
            console.log(dhWeightKey + ":" + dhWeightTable[dhWeightKey]);
        });
    });
};

// funcAgeWTableOutput();

/**
 * 年齢と馬体重増減を与えると、それっぽい値を返してくれる。
 * @param {*} age 年齢
 * @param {*} dhweight 体重増原料
 */
var getAgeDhWeightStd = function(age, dhweight){
    //もし年齢でテーブルがみつからなければ0を返す。評価に値しない。
    var dhWeightTable = ageWeightTable[age];
    if(!dhWeightTable){
        return 0;
    }
    var dhweightKinjiti;//体重増原料近似値
    var keys = Object.keys(dhWeightTable);
    // console.log(keys);
    keys = keys.sort((x,y) => (x - y));
    // console.log(keys);
    dhweightKinjiti = keys[0];
    //体重増原料の値が近いものを取り出す
    keys.forEach(dhWeightKey => {
        // var dhWeightStd = dhWeightTable[dhWeightKey];
        var abs1 = Math.abs(dhweight - dhweightKinjiti);
        var currentValueAbs = Math.abs(dhweight - dhWeightKey);
        if(currentValueAbs < abs1){
            dhweightKinjiti = dhWeightKey;
        }
    });
    //体重増原料の近似値が取れたので、その体重増原料の標準化値を取得する。
    return dhWeightTable[dhweightKinjiti];
};

// function getClosestNum(num, ar){
//     //近似値を保持しておく変数
//     var closest;
//     //配列かどうか、要素があるか判定
//     if(Object.prototype.toString.call(ar) ==='[object Array]' && ar.length>0){
//       //まず配列の最初の要素を近似値として保持する
//       closest = ar[0];
//       //配列の要素を順次比較していく
//       for(var i=0;i<ar.length;i++){ 
//          //この時点での近似値と、指定値の差異を絶対値で保持しておく
//          var closestDiff = Math.abs(num - closest);
//          //読み込んだ値と比較し、差異を絶対値で保持しておく
//          var currentDiff = Math.abs(num - ar[i]);
//          //新しく比較した値のほうが近かったら、近似値として保持しておく
//          if(currentDiff < closestDiff){
//              closest = ar[i];
//          }
//        }
//       //ループが終わったら、近似値を返す
//        return closest;
//      }
//   //配列じゃなかったらfalse
//   return false;
//  }