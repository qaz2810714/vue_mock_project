import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 移库
 */
export default {
    name: "wmsMove",
    attrs: {
        moveStatus: {
            type: baseType.int,
            dic: {
                show: dicEnum.MoveStatus,
                filter:function(item){
                    return item.value != '3';
                }
            },
            
        },
        amount: {
            type: baseType.int,
            summary:true
        },
        netWeight: {
            type: baseType.decimal,
            summary:true
        },
        grossWeight: {
            type: baseType.decimal,
            summary:true
        },
        poundWeight: {
            type: baseType.decimal,
            summary:true
        },
        totalAmout: {
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
        createTime: {
            type: baseType.datetime,
            summary:true,
        },
        modifyTime: {
            type: baseType.datetime,
            summary:true,
        },
        originLayer: {
            type: baseType.int,
        },
        targetLayer: {
            type: baseType.int,
        },
    }
};