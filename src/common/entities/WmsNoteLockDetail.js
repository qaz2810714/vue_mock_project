import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 锁定单
 */
export default {
    name: "WmsNoteLockDetail",
    attrs: {
        createTime:{
            type:baseType.datetime
        },
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.NoteLockStatus
            }
        },
        amount: {
            type: baseType.int,
            summary:true,
            align: "right",
            precision:0
        },
        netWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right",
            precision:3
        },
        grossWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right",
            precision:3
        },
        poundWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right",
            precision:3
        },
    }
};