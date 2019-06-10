import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum,
    castDic,
    getDataSource,
    castConfig
}  = convertMetadata;

let skuProperty = {
    type: baseType.int,
    dic:new castConfig(dicEnum.BrandSkuProperties,dicEnum.BrandSkuProperties,(editKey,config)=>{
        return {
            key: "value",
            value: "name",
            desc: "name",
            cols: {
                value: "值",
                name:"名称"
            },
        }
    }),
};
/**
 * 过户转换策略
 */
export default {
    name: "baseBrand",
    attrs: {
        skuProperties:skuProperty,
        skuProperty: skuProperty,
        brandTextureList:{
            type: baseType.string,
            dic: castDic.textureId
        },
        whsoutType:{
            type: baseType.int,
            dic: castDic.whsoutType
        },
    }
};