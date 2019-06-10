import cacheUtil from './CacheUtil';
import componentUtil from './ComponentUtil';
import util from '../js/util'
import convertMetadata from '@/common/entities/ConvertMetadata'
let {
    baseType,
    dicEnum
} = convertMetadata;
let exportUtil = function(page,dataList,config) {
    this.pageObj = page;
    //需导出的数据源
    this.dataList = dataList;
    this.config = {...{
        header:[], //标题
        cols:[],//列
        entity:{},//实体配置
        title:""//导出文件名
    },...config};
    /**
     * 导出
     */
    this.export = function (callback) {
        this.pageObj.$confirm('将导出excel文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.export2Excel(this.pageObj,this.dataList,this.config,callback);
        }).catch(() => {

        });
    };
    /**
     * 导出到excel
     */
    this.export2Excel = function (that,dataList,config,callback) {
        var $this = this;
        require.ensure([], () => {
            const {
                export_json_to_excel
            } = require('../../excel/Export2Excel'); //这里必须使用绝对路径
            const tHeader = config.header; // 导出的表头名
            const filterVal = config.cols.map(a=>a.prop); // 导出的表头字段名
            if(callback){
                callback(dataList,filterVal);
            }
            const data = $this.formatJson(filterVal, dataList);
            //TODO:需要完成一次数据转换
            let time1, time2 = '';
            //export_json_to_excel(tHeader, data, `[${time1}-${time2}]提现管理excel`); // 导出的表格名称，根据需要自己命名
            export_json_to_excel(tHeader, data, config.title,config.types); 
        })
    };
    this.formatJson = function (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    }
}
/**
 * 云仓导出方法
 */
function cloudExport(page,dataList,table,title){
    //1.根据table信息组装导出数据
    var config = getConfig(table);
    config.title = title+util.formatDate.format(new Date(),"yyyyMMddhhmmss");
    return new exportUtil(page,dataList,config).export((data,fields)=>{
        //2.完成数据转换
        if(data==null) return data;
        var dicCache = cacheUtil.getDic();
        data.forEach(item=>{
            fields.forEach(p=>{
                if(p == "whsCalcStackId"){
                    item[p] = componentUtil.getStackName(dicCache,item,"whsRoomId","whsAreaId");
                }else{
                    item[p] = componentUtil.getDisplayText(config.entity, p, item[p],dicCache);
                }
            });
        });
    });
}
/**
 * 获取配置信息
 */
function getConfig(table){
    var config = {
        header:[], //标题
        cols:[],//列
        types:[],//列类型
        entity:{},//实体配置
    };
    var cols = table.$slots.default;
    config.entity = table.config.entity;
    if(cols==null) return config;
    cols.forEach(col => {
        if(col && col.componentOptions && col.componentOptions.propsData){
            var attrs = col.componentOptions.propsData;
            if(attrs.label){
                config.header.push(attrs.label);
                config.cols.push({
                    prop:attrs.prop,
                     lable:attrs.label
                });
                //查找字段类型 
                var cAttr = config.entity.attrs[attrs.prop];
                if(cAttr && cAttr.type){
                    if(cAttr.type == baseType.int || cAttr.type == baseType.decimal){
                        config.types.push("n");
                    }else{
                        config.types.push("s");
                    }
                }else{
                    config.types.push("s");
                }
            }
        }
    });
    return config;
}

export default {
    /**
     * 导出excel
     */
    export:function(page,dataList,config,callback){
        return new exportUtil(page,dataList,config).export(callback);
    },
    /**
     * 云仓导出方法
     */
    cloudExport
}