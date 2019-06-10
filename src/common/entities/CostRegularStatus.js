import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 计费状态
 */
export default {
    name: "regular",
    attrs: {
        regularStatus: {
            type: baseType.int,
            dic: {
                show: dicEnum.RegularStatus
            }
        },
        unitprice:{
            type: baseType.decimal,
            precision: 2
        },
        settleUnitprice:{
            type: baseType.decimal,
            precision: 2
        },
        netWeight:{
            type: baseType.decimal,
            summary:true
        },
        grossWeight:{
            type: baseType.decimal,
            summary:true
        },
        poundWeight:{
            type: baseType.decimal,
            summary:true
        },
        numFin:{
            type: baseType.int,
            summary:true
        },
        agreementStart: {
            type: baseType.date,
        },
        agreementEnd: {
            type: baseType.date,
        },
        balancePreNum:{
            type: baseType.decimal,
            summary:true
        },
        settleAmt:{
            type: baseType.decimal,
            summary:true,
            precision: 2
        },
        settleActAmt:{
            type: baseType.decimal,
            summary:true,
            precision: 2
        },
        amtMoney:{
            type: baseType.decimal,
            summary:true,
            precision: 2
        },
        actMoney:{
            type: baseType.decimal,
            summary:true,
            precision: 2
        },
        balanceNum:{
            type: baseType.decimal,
            summary:true
        },
        whsDayNum:{
            type: baseType.int,
        },
        whsFreeDayNum:{
            type: baseType.int,
        },
        balancePreNum:{
            type: baseType.decimal,
            summary:true
        },
        changeMoney:{
            type: baseType.decimal,
            summary:true,
            precision: 2
        },
        whsInFirstDate:{
            type: baseType.date,
        },
        transferDate:{
            type: baseType.date,
        },
        transferNum:{
            type: baseType.int,
        },
        createTime:{
            type: baseType.date,
        }
    }
};