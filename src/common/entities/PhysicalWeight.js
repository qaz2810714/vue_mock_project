import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
/**
 * 库位转换策略
 */
export default {
    name: "physicalWeight",
    attrs: {
        weight: {
            type: baseType.decimal,
            summary:true,
            precision:3
        },
    }
};