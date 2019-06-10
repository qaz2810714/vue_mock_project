import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum,
    castDic
} = convertMetadata;
/**
 * 锁定单
 */
export default {
    name: "WmsTransferDetail",
    attrs: {
        amount: {
            type: baseType.int,
            summary:true,
            align: "right",
        },
        netWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right",
        },
        grossWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right",
        },
        poundWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right",
        },
        costTime:{
            type:baseType.datetime
        },
        oldCstId: {
            type: baseType.int,
            dic: castDic.cstId
        },
        newCstId: {
            type: baseType.int,
            dic:castDic.cstId
        },
    }
};