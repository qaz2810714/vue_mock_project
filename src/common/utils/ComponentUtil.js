import convertMetadata from '../entities/ConvertMetadata'
import cacheUtil from './CacheUtil'
import util from '../js/util';
let {
    baseType,
    dicEnum,
    castDic
} = convertMetadata;

/**
 * 控件类型
 */
let controlType = {
    text: "text",
    date: "date",
    datetime: "datetime",
    dateRange: "dateRange",
    int: "int",
    decimal: "decimal",
    checkbox: "checkbox",
    select: "select",
    multiSelect: "multiSelect",
    lookup: "lookup",
    multiLookup: "multiLookup"
};

/**
 * 默认的控件配置
 */
let defaultControlConfig = {
    type: controlType.text,
    key: "value",
    value: "name",
    cols: [],
    dataSource: [],
    getDataSource: null,
    getSelected: null
};
//获取数据源
function getDataSource(key,filter,cacheDic) {
    if(!cacheDic){
        cacheDic = cacheUtil.getDic();
    }
    let cache = cacheDic[key];
    if (cache == null || cache.list == null) return [];
    //查找到字典项中缓存信息 对应的key值
    var list = cache.list.filter(a => !a.deleteFlag && (a.valid == 1));
    if(filter){
        list = list.filter(filter);
    }
    return list;
}
/**
 * 获取属性对应的字典项key值信息
 * @param {*} config 
 * @param {*} prop 
 */
function getPropDicKey(config, prop) {
    if (config != null && config.attrs != null && config.attrs[prop] != null) {
        let attr = config.attrs[prop];
        if (attr.dic != null) return attr.dic;
    }
    return castDic[prop];
};
/**
 * 获取字段配置
 * @param {*} config 
 * @param {*} prop 
 */
function getPropConfig(config, prop) {
    if (config != null && config.attrs != null && config.attrs[prop] != null) {
        return config.attrs[prop];
    }
    return null;
};
/**
 * 获取属性小数位
 * @param {*} config 
 * @param {*} prop 
 */
function getPropPrecision(config, prop) {
    var propConfig = getPropConfig(config, prop);
    if (propConfig != null && propConfig.dic == null) {
        if (propConfig.precision != null) {
            return propConfig.precision;
        }
        if (propConfig.type == baseType.decimal) {
            return 3;
        }
        if (propConfig.type == baseType.int) {
            return 0;
        }
    }
    return null;
}
/**
 * 获取属性靠齐方式
 * @param {*} config 
 * @param {*} prop 
 */
function getPropAlign(config, prop) {
    if (prop == "deleteFlag") return "center";
    var propConfig = getPropConfig(config, prop);
    if (propConfig == null) return "left";
    if (propConfig.align != null) return propConfig.align;
    if (propConfig.dic == null) {
        if (propConfig.type == baseType.decimal) {
            return "right";
        }
        if (propConfig.type == baseType.int) {
            return "right";
        }
        if (propConfig.type == baseType.date || propConfig.type == baseType.datetime) {
            return "center";
        }
    }
    return "left";
}
/**
 * 获取属性编辑模式下的配置信息
 * @param {*} prop 
 * @param {*} dic 
 */
function getPropEditConfig(config, prop) {
    let key = getPropDicKey(config, prop);
    var editConfig = clone(defaultControlConfig);
    if (key == null) {
        if (config == null || config.attrs == null) {
            return editConfig;
        }
        //没有配置字典项转换关系，则生成简单的input框。这里需要根据配置的字段类型进行input类型判断
        var p = config.attrs[prop];
        if (p == null) return editConfig;
        switch (p.type) {
            case baseType.int:
                editConfig.type = controlType.int;
                break;
            case baseType.decimal:
                editConfig.type = controlType.decimal;
                break;
            case baseType.string:
                editConfig.type = controlType.text;
                break;
            case baseType.date:
                editConfig.type = controlType.date;
                break;
            case baseType.datetime:
                editConfig.type = controlType.datetime;
                break;
            case baseType.bool:
                editConfig.type = controlType.checkbox;
                break;
        }
        //需要依据字段类型生成控件信息
        return editConfig;
    };
    //依据字段名 全局生成控件类型(key.edit 不为空，则需要生成高级搜索控件。否则，依据key.show生成 select控件)
    if (key.edit != null) {
        editConfig.type = controlType.lookup;
        return {
            ...editConfig,
            ...key.edit
        };
    }
    //设置字典项数据源
    editConfig.type = controlType.select;
    editConfig.getDataSource = (cache) => {
        return getDataSource(key.show,key.filter,cache);
    };
    editConfig.getSelected = (id,cache) => {
        return getDataSource(key.show,key.filter,cache).find(a => a[key] == id);
    };
    return editConfig;
}
/**
 * 克隆配置信息
 * @param {*} origin 
 */
function clone(origin) {
    return JSON.parse(JSON.stringify(origin))
}
/**
 * 获取转换结果
 * @param {*} config 
 * @param {*} prop 
 * @param {*} value 
 * @param {*} dicCache 
 * @param {*} row 
 */
function getDisplayText(config, prop, value, dicCache, row) {
    //TODO:还需要添加特殊字段处理逻辑
    if (prop == "deleteFlag") {
        if (value == 1) {
            return "禁用"
        } else {
            return "启用"
        }
    }
    if (value == null) return value;
    //如果是收发人字段，也使用特殊方式显示
    if (prop == "transceiver" && value) {
        //先将收发人用逗号分隔处理成数组
        var temp = value + "";
        let userIdList = temp.split(",");
        //计算展示的名字列表
        let showList = dicCache["UserList"].list.filter(item => userIdList.includes(String(item.id)))
            .map(item => item.name);
        if(showList.length != 0){
            //如果需要展示的名字列表不为空则进行reduce运算
            return showList.reduce((sum, val) =>  sum + "," + val);
        }
        //否则 直接返回空字符串
        return "";
    };

    var propConfig = getPropConfig(config, prop);
    if (propConfig) {
        //TODO:1.先判断数据是否为decimal类型，是否需要做小数位处理
        var precision = getPropPrecision(config, prop);
        if (precision != null) {
            if (value == null) return value;
            return value.toFixed(precision);
        }
        //TODO:2.日期类型格式化
        if (propConfig.type == baseType.date) {
            var date = new Date(value);
            return util.formatDate.format(date, "yyyy-MM-dd");
        }
        if (propConfig.type == baseType.datetime) {
            var date = new Date(value);
            return util.formatDate.format(date, "yyyy-MM-dd hh:mm:ss");
        }
    }

    //TODO:3.判断是否可以进行字段转换
    let key = this.getPropDicKey(config, prop);
    if (key == null || key.show == null) return value;
    let cache = dicCache[key.show];
    if (cache == null) return value;
    //查找到字典项中缓存信息 对应的key值
    let item = cache.list.find(a => a.value == value);
    if (item == null) return value;
    return item.name;
};
export default {
    controlType,
    getPropDicKey,
    getPropConfig,
    getPropPrecision,
    getPropAlign,
    /**
     * 获取显示文本
     * @param {*} config 实体配置信息
     * @param {*} prop 属性
     * @param {*} value 值
     */
    getDisplayText,
    /**
     * 获取库位信息
     */
    getStackName(dicCache, row, parentPropName, childPropName) {
        let dataList = dicCache["DicWhsCalcStackName"].list.map(node => {
            return node.model
        });
        let parentNode = dataList.find(item => item.id == row[parentPropName]);
        let childNode = dataList.find(item => item.id == row[childPropName]);
        if (childNode && parentNode)
            return parentNode.name + ">" + childNode.name;
        return "";
    },
    /**
     * 获取编辑控件的信息
     * @param {*} concig 
     * @param {*} prop 
     */
    getEditControl(config, prop) {
        return getPropEditConfig(config, prop);
    }
}