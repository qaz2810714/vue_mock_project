import convertMetadata from './ConvertMetadata'
import httpUtil from "@/common/utils/HttpUtil";
let {
    baseType,
    castConfig
}  = convertMetadata;


let roleIds = {
    type: baseType.int,
    dic:new castConfig(null,null,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "remark",
            getDataSource: (cache,callback) => {
                httpUtil.post("rbac/role/getAllRole", {}, data => {
                    if(callback){
                        callback(data);
                    }
                },null,false);
            },
            getSelected: (id,cache,callback) => {
                return config.getDataSource(list=>{
                    if(callback){
                        callback(list.find(a => a[config.key] == id));
                    }
                });
            }
        }
    })
};
/**
 * 过户转换策略
 */
export default {
    name: "role",
    attrs: {
        roleIds:roleIds,
    },
};