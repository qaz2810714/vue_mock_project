import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 库位转换策略
 */
export default {
    name: "baseDictionary",
    attrs: {
        classCode:{
            type:baseType.string
        },
        className:{
            type:baseType.string
        },
        itemName:{
            type:baseType.string
        },
        itemValue:{
            type:baseType.string
        },
        remark:{
            type:baseType.string
        },
        deleteFlag:{
            type:baseType.string
        },
    }
};