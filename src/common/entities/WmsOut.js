import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum,
    castDic
} = convertMetadata;
/**
 * 出库
 */
export default {
    name: "whsOut",
    attrs: {
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.whsoutStatus,
                filter:function(item){
                    return item.value != '3';
                }
            }
        },
        cstId: {
            type: baseType.int,
            dic: castDic.cstId
        },
        deliveryId: {
            type: baseType.int,
            dic: castDic.cstId
        },
        number: {
            type: baseType.int,
            summary:true,
        },
        netWeight: {
            type: baseType.decimal,
            summary:true,
        },
        grossWeight: {
            type: baseType.decimal,
            summary:true,
        },
        poundWeight: {
            type: baseType.decimal,
            summary:true,
        },
        allNumber :{
            type: baseType.int,
            summary:true,
        },
        totalAmount: {
            type: baseType.int,
            summary:true,
        },
        totalNetWeight: {
            type: baseType.decimal,
            summary:true,
        },
        totalGrossWeight: {
            type: baseType.decimal,
            summary:true,
        },
        totalPoundWeight: {
            type: baseType.decimal,
            summary:true,
        },
        costDays: {
            type: baseType.int,
            summary:true,
        },
        
    }
};