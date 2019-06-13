import convertMetadata from './ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;

export default {
    name:'entity',
    attrs:{
        createTime:{
            type:baseType.datetime
        },
        gramWeight:{
            type:baseType.decimal,
            summary:true
        }
    }
}