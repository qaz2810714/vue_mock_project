import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 调整单
 */
export default {
    name: "wmsNoteAdjustDetail",
    attrs: {
        createTime:{
            type:baseType.datetime
        },
        status: {
            type: baseType.int,
            dic: {
                show: dicEnum.NoteAdjustStatus
            }
        },
        amount: {
            type: baseType.int,
            summary:true,
            align: "right",
            precision: 0
        },
        netWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right"
        },
        grossWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right"
        },
        poundWeight: {
            type: baseType.decimal,
            summary:true,
            align: "right"
        },
        manufactureTime:{
            type: baseType.datetime,
        },
        whsinTime:{
            type: baseType.datetime,
        },
        costTime:{
            type: baseType.datetime,
        }
    }
};