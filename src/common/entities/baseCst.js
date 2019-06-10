import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum,
    castDic
} = convertMetadata;
/**
 * 库位转换策略
 */
export default {
    name: "baseCst",
    attrs: {
        cstNo:{
            type:baseType.string
        },
        cstFullName:{
            type:baseType.string
        },
        cstShortName:{
            type:baseType.string
        },
        mnemonicCode:{
            type:baseType.string
        },
        contactPersonPhone:{
            type:baseType.string
        },
        deleteFlag:{
            type:baseType.string
        },
        settleType:{
            type:baseType.int,
            dic:{
                show:dicEnum.CstSettleType
            }
        }
    }
};