import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;

/**
 * 调整单状态枚举
 */
const statusEnum = {
    STATUS_READY: 0, //待审批
    STATUS_ADJUSTED: 1, //已锁定
    STATUS_DELETE: 2, //已废弃
};
/**
 * 调整类型枚举
 */
const adjustType = {
    Type_Normal: 0, //正常
    Type_Clear: 1, //清库
    Type_ConvertStatus: 2, //状态调整
    Type_Del:3,//删除
};
/**
 * 调整单
 */
export default {
    name: "wmsNoteAdjust",
    statusEnum,adjustType,
    attrs: {
        createTime:{
            type:baseType.datetime
        },
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.NoteAdjustStatus,
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
    },
};