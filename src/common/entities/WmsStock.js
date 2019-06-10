import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;

//获取可用数量
function getUsableNum(number, usedNum) {
    if (number == null) number = 0;
    if (usedNum == null) usedNum = 0;
    return number - usedNum;
};
//计算百分比
function getCalcPercent(stock){
    if(stock.netWeight==null || stock.netWeight==0) return 1;
    if(stock.usableWeight==null) {
        stock.usableWeight = 0;
    }
    return stock.usableWeight/stock.netWeight;
};
//获取仓储天数
function getCostDays(costTime, endTime) {
    var beginDay = new Date(Date.now()),
        endDay = new Date(Date.now());
    if (costTime != null) {
        beginDay = new Date(Date.parse(costTime));
    }
    if (endTime != null) {
        endDay = new Date(Date.parse(endTime));
    }
    beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth(), beginDay.getDate());
    endDay = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate());
    var nTime = endDay - beginDay;
    var day = Math.floor(nTime / 86400000) + 1;
    //获取仓储天数
    return day;
};
/**
 * 库存
 */
export default {
    //库存表
    name: "wmsStock",
    attrs: {
        packNo: {
            type: baseType.string
        },
        cstName: {
            type: baseType.string
        },
        //首入库时间
        whsinTime: {
            type: baseType.datetime,
        },
        //货主入库时间
        costTime: {
            type: baseType.datetime,
        },
        //出厂日期
        manufactureTime:{
            type: baseType.datetime,
        },
        number: {
            type: baseType.int,
            summary: true,
            align: "right",
            precision: 0
        },
        //单包支数
        unitNumber: {
            type: baseType.int
        },
        //过户次数
        transferTimes: {
            type: baseType.int
        },
        //仓储天数
        costDays: {
            type: baseType.int
        },
        //实发数量
        realOutWeight:{
            type: baseType.decimal,
            summary: true,
        },
        //已用数量
        usedNum:{
            type: baseType.int,
            summary: true,
        },
        //已用重量
        usedWeight:{
            type: baseType.decimal,
            summary: true,
        },
        //可用数量
        usableNum: {
            type: baseType.int,
            summary: true,
        },
        //可用净重
        usableWeight: {
            type: baseType.decimal,
            summary: true,
        },
        usableGrossWeight: {
            type: baseType.decimal,
            summary: true,
        },
        usablePoundWeight: {
            type: baseType.decimal,
            summary: true,
        },
        netWeight: {
            type: baseType.decimal,
            summary: true,
        },
        grossWeight: {
            type: baseType.decimal,
            summary: true,
        },
        poundWeight: {
            type: baseType.decimal,
            summary: true,
            //align: "right",
        },
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.StockStatus
            }
        },
    },
    methods: {
        calcUsableProp:function(stock){
            stock.costDays = getCostDays(stock.costTime,stock.endTime);
            stock.usableNum = getUsableNum(stock.number,stock.usedNum);
            stock.usableWeight = getUsableNum(stock.netWeight,stock.usedWeight);
            var per = getCalcPercent(stock);
            stock.usableGrossWeight = (stock.grossWeight * per).toFixed(3);
            stock.usablePoundWeight = (stock.poundWeight * per).toFixed(3);
        },
        getCostDays,
        getCalcPercent
    }
};