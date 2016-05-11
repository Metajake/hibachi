music = {};
sndfx = {};
tracks = {
    //####################MAKE SURE TO CHANGE NAME OF NEW TRACKS
    btstu:{
        bpm:1333*4,
        name: 'btstu',
        etb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]},{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]}],
        startMS: 13610,
        durationMS: 171651
    },
    mch:{
        bpm:694*4,
        name: 'mch',
        etb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]},{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]}],
        startMS: 13610,
        durationMS: 171651
    },
    witit:{
        bpm:857,
        name: 'witit',
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]},{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]}],
        startMS: 13610,
        durationMS: 171651
    },
    work:{
        bpm:625,
        name: 'work',
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]},{"q":[1,2,4],"e":[1,2,3,4,5,6,8],"s":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]}],
        startMS: 13610,
        durationMS: 171651
    },
    carlos:{
        bpm:923*2,
        name: 'carlos',
        startMS: 3737,
        etb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,1,0,1],"e":[1,1,1,1,1,0,1,0],"s":[1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1]},{"q":[0,0,0,1],"e":[1,0,0,0,0,0,0,1],"s":[0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1]}],
        durationMS: 171651
    },
    rattrap:{
        bpm:802*2,
        name: 'rattrap',
        startMS: 3737,
        etb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,1,0,1],"e":[1,1,1,1,1,0,1,0],"s":[1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1]},{"q":[0,0,0,1],"e":[1,0,0,0,0,0,0,1],"s":[0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1]}],
        durationMS: 171651
    },
    wind:{
        bpm:714*2,
        name: 'wind',
        startMS: 3737,
        etb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,1,0,1],"e":[1,1,1,1,1,0,1,0],"s":[1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1]},{"q":[0,0,0,1],"e":[1,0,0,0,0,0,0,1],"s":[0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1]}],
        durationMS: 203156
    },
    ivy:{
        bpm:1043*2,
        name: 'ivy',
        beatsMS: [3846,3860,5247,5267,5290,5313,6168,6211,6236,6361,6825,7271,7286,7501,7536,7573,7595,8940,8958,8982,9007,9861,9904,9929,11247,11266,11290,11316,12632,12650,12674,12700,13555,13575,13597,13622,13746,14210,14886,14921,14934,14958,14981,16324,16341,16366,16390,17245,17289,17313,18631,18672,18696,20019,20038,20060,20085,20939,20957,20981,21005,21171,21189,21212,21236,22324,22366,22391,23710,23729,23750,23775,24632,24650,24673,24698,25746,25764,26017,26036,26059,26084,26477,26519,26544,27404,27422,27445,28325,28344,28366,28390,29710,29728,29751,29776,31095,31113,31136,31162,32017,32036,32058,32085,32246,32287,32311,32655,33134,37094,37135,37160,38480,38499,38521,38547,39401,39420,39443,39468,39614,39631,39649,39673,39698,40504,40518,40732,40746,40768,40782,40804,40827,42172,42191,42214,42240,43093,43113,43135,43160,44212,44479,44497,44521,44545,45863,45881,45905,45928,46786,46807,46828,46853,47015,47056,47081,47424,47440,48118,48219,49556,49575,49598,49623,50478,50497,50520,50545,51597,51862,51904,51928,53248,53267,53290,53314,54171,54190,54213,54237,54384,54400,54442,54467,55288,55518,56942,56961,56983,57009,57865,57884,57906,57931,59248,59266,59290,59315,60634,60653,60676,61557,61576,61599,61623,61786,61805,61828,61854,62192,62209,62939,62957,62981,63006,64328,64346,64367,64394,65248,65266,65289,65313,66632,66650,66674,66698,70308,70321,70343,70366,70388,70766,70786,70827,70850,70877,71711,71730,71752,71777,72632,72652,72674,72700,74017,74035,74060,74086,75403,75422,75445,76326,76345,76367,76392,76553,76573,76596,76620,76964,77001,77657,77666,77731,79095,79114,79137,80016,80036,80058,80083,81135,81402,81420,81444,81468,82787,82805,82828,82852,83709,83729,83751,83777,83938,83957,83980,84004,84812,84825,85040,85055,85092,85113,85135,85157,86482,86501,86523,87402,87422,87443,87468,88787,88805,88828,88852,90172,90190,90214,91094,91114,91136,91161,91323,91342,91365,91390,91733,92211,107231,107245,107269,107290,107312,110940,110982,111006,112327,112344,112366,112390,113248,113267,113290,113314,113478,113497,113520,113545,114366,114578,114615,114629,114651,114674,114697,116019,116038,116061,116086,116940,116959,116981,117006,118325,118343,118366,118390,119711,119730,119753,119778,120635,120653,120674,120862,120881,120904,120929,121273,122017,122035,122059,122083,123404,123422,123444,123468,124326,124345,124368,124393,125709,125726,125750,125775,127096,127115,127136,127161,128019,128037,128060,129133,129149,129401,129443,129467,129863,129882,129906,129931,130788,130808,130830,131709,131728,131751,131775,133094,133113,133136,133161,134481,134500,134522,134548,135403,135421,135444,135469,135632,135651,135674,135698,140478,140497,140521,140547,141867,141886,141907,142787,142807,142827,142852,142998,143015,143057,143083,144117,144155,144168,144189,144211,145557,145576,145599,146478,146496,146520,146546,147582,147596,147865,147883,147905,147930,149249,149269,149291,150173,150191,150214,150239,150401,150420,150443,150467,150810,151288,151516,152941,152960,152982,153008,153863,153882,153905,155251,155294],
        startMS: 3804,
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46]
    },
    notype:{
        bpm:960*16,
        name: 'notype',
        startMS: 3737,
        etb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46],
        measures:[1, 2, 3, 1, 1, 2, 2, 3, 3, 1, 2, 1, 3, 2, 1],
        customMeasures:[{"q":[1,1,0,1],"e":[1,1,1,1,1,0,1,0],"s":[1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1]},{"q":[0,0,0,1],"e":[1,0,0,0,0,0,0,1],"s":[0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1]}],
        durationMS: 171651
    },
    realiti:{
        bpm:1043*2,
        name: 'realiti',
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46]
    }
};