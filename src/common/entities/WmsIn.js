import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 入库
 */
export default {
    name: "wmsIn",
    attrs: {
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.WhsInStatus,
                filter:function(item){
                    return item.value != '3';
                }
            }
        },
        whsinTime: {
            type: baseType.datetime,
        },
        whsLayer: {
            type: baseType.int,
        },
        manufactureTime: {
            type: baseType.datetime,
        },
        amount: {
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
    }
};