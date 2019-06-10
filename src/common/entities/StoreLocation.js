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
    name: "storeLocation",
    attrs: {
        level: {
            type: baseType.int,
            dic: castDic.whsLevel
        },
        type: {
            type: baseType.int,
            dic: castDic.StoreLocationType
        }
    }
};