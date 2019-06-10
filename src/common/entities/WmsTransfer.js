import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum,
    castDic
}  = convertMetadata;
/**
 * 过户转换策略
 */
export default {
    name: "wmsTransfer",
    attrs: {
        oldCstId: {
            type: baseType.int,
            dic: castDic.cstId
        },
        newCstId: {
            type: baseType.int,
            dic:castDic.cstId
        },
        totalAmount: {
            type: baseType.int,
            summary:true,
            align: "right"
        },
        totalNetWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right"
        },
        totalGrossWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right"
        },
        totalPoundWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right"
        },
    }
};