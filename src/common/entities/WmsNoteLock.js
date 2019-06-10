import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 锁定单状态枚举
 */
const statusEnum = {
    STATUS_READY: 0, //待审批
    STATUS_LOCKED: 1, //已锁定
    STATUS_DELETE: 2, //已废弃
    STATUS_UNLOCKED: 3 //已解锁
};

/**
 * 锁定单
 */
export default {
    name: "wmsNoteLock",
    statusEnum,
    attrs: {
        createTime:{
            type:baseType.datetime
        },
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.NoteLockStatus,
                filter:item=>{return item.value !='2';}
            }
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