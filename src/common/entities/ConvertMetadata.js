import cacheUtil from '../utils/CacheUtil'
/**
 * 基础数据类型
 */
let baseType = {
    string: "string",
    int: "int",
    decimal: "decimal",
    date: "date", //"yyyy-MM-dd"
    datetime: "datetime",//"yyyy-MM-dd hh:mm:ss"
    bool: "bool"
};
/**
 * 字典项枚举
 */
let dicEnum = {
    AdjustType: "AdjustType", //调整类型
    BalanceNoType: "BalanceNoType", //结算单据类型
    BalanceNode: "BalanceNode", //结算节点
    BalanceStatus: "BalanceStatus", //结算状态
    BalanceType: "BalanceType", //结算方式
    BrandNameList: "BrandNameList", //品名
    BrandSkuProperties: "BrandSkuProperties", //品名sku属性
    BusinessType: "BusinessType", //业务类型
    CalcType: "CalcType", //计重方式
    ClassList: "ClassList", //品类
    CostType: "CostType", //费用类型
    CstInTime: "CstInTime", //货主入库时间
    CstList: "CstList", //货主
    CstSettleType: "CstSettleType", //货主结算方式
    CstType: "CstType", //货主类型
    CstValid: "CstValid", //货主启用状态
    DicBrandClass: "DicBrandClass", //品类
    DicBrandName: "DicBrandName", //品名
    DicClientName: "DicClientName", //货主
    DicDepartment: "DicDepartment", //部门
    DepartmentList:"DepartmentList",//部门列表
    DicPhysicalWeight: "DicPhysicalWeight",
    DicProducingName: "DicProducingName",
    DicTextureName: "DicTextureName",
    DicUser: "DicUser",
    UserList:"UserList",//用户列表
    DicWhsCalcStackName: "DicWhsCalcStackName",
    InvoiceType: "InvoiceType", //发票类型
    MeasurementUnit: "MeasurementUnit", //数量单位
    Meterial: "Meterial",
    MoveStatus: "MoveStatus", //移库状态
    NoteAdjustStatus: "NoteAdjustStatus", //调整单状态
    NoteLockStatus: "NoteLockStatus", //锁定状态
    PhysicalWeightList: "PhysicalWeightList",
    PlaceList: "PlaceList",
    RangeApply: "RangeApply", //应用范围
    RegularStatus: "RegularStatus", //计费规则状态
    SettleStatus: "SettleStatus", //结算单状态
    SpecStr: "SpecStr", //特殊字符
    StackName: "StackName",
    StockStatus: "StockStatus", //库存状态
    StoreLocationType: "StoreLocationType", //库房类型
    TransferStatus: "TransferStatus", //过户状态
    WareHouse: "WareHouse", //仓库集合
    WareHouseType: "WareHouseType", //仓库类型
    WareHouseUserMax: "WareHouseUserMax", //仓库用户最大数
    WeightType: "WeightType", //计重单位
    WhsInStatus: "WhsInStatus", //入库状态
    WhsInStyle: "WhsInStyle", //入库类型
    WhsInType: "WhsInType", //入库方式
    WhsLevel: "WhsLevel", //库区级别
    WhsoutType: "WhsoutType", //出库方式
    whsoutStatus: "whsoutStatus", //出库状态
    DeleteFlag: "DeleteFlag", //删除状态
    PayType:"PayType",//付款方式
    RegularUnit:"RegularUnit",//计费单位
    DataSource:"DataSource",//数据来源
    BalanceNode:"BalanceNode",//结算节点
};
/**
 * 获取数据源
 * @param {*} key 
 */
function getDataSource(key,config,dicCache) {
    if(dicCache==null){
        dicCache = cacheUtil.getDic();
    }
    let cache = dicCache[key];
    if (cache == null || cache.list == null) return [];
    //查找到字典项中缓存信息 对应的key值
    var list = cache.list.filter(a => !a.deleteFlag && (a.valid==null || a.valid == 1));
    if(config && config.filter){
        list = list.filter(config.filter);
    }
    return list;
}
/**
 * castConfig 对象
 * @param {显示key} showKey 
 * @param {编辑key} editKey 
 * @param {创建edit配置的方法} setEdit 
 * @param {扩展信息} extend 
 */
function castConfig(showKey,editKey,setEdit,extend){
    var config = {
        show:showKey
    };
    if(editKey){
        config.edit = {
            cacheKey:editKey,
            key: "value",
            value: "name",
            getDataSource: (cache) => {
                return getDataSource(editKey,config,cache);
            },
            getSelected: (id,cache) => {
                return config.edit.getDataSource(cache).find(a => a[config.edit.key] == id);
            }
        };
    }
    if(setEdit){
        config.edit = {...config.edit,...setEdit(editKey,config.edit)};
    }
    if(extend){
        config = {...config,...extend};
    }
    return config;
}
/**
 * 租户信息配置
 */
let cstConfig = new castConfig(dicEnum.DicClientName,dicEnum.CstList,(editKey,config)=>{
    return {
        key: "id",
        value: "cstFullName",
        desc: "mnemonicCode",
        cols: {
            cstNo: "编号",
            cstShortName: "简称",
            cstFullName: "全称",
            mnemonicCode: "助记码"
        }
    }
});
/**
 * 字段转换关系配置
 */
let castDic = {
    cstId: cstConfig,
    balanceCompanyId: cstConfig,
    settleCompanyId: cstConfig,
    userId:new castConfig(dicEnum.UserList,dicEnum.UserList,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "remark",
            cols: {
            }
        }
    }),
    transceiver:new castConfig(dicEnum.DicUser,dicEnum.UserList,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "remark",
            cols: {
            }
        }
    }),
    slinger:new castConfig(dicEnum.DicUser,dicEnum.UserList,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "remark",
            cols: {
            }
        }
    }),
    whsManager:new castConfig(dicEnum.DicUser,dicEnum.UserList,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "remark",
            cols: {
            }
        }
    }),
    textureId:new castConfig(dicEnum.DicTextureName,dicEnum.Meterial,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "mnemonicCode",
            cols: {
                mnemonicCode: "助记码",
                name:"名称"
            },
        }
    }),
    producingId:new castConfig(dicEnum.DicProducingName,dicEnum.PlaceList,(editKey,config)=>{
        return {
            key: "id",
            value: "placeShortName",
            desc: "mnemonicCode",
            cols: {
                mnemonicCode: "助记码",
                placeShortName:"名称"
            },
        }
    }),
    moveStatus: {
        show: dicEnum.MoveStatus
    },
    calcType: {
        show: dicEnum.CalcType
    },
    brandId:new castConfig(dicEnum.DicBrandName,dicEnum.BrandNameList,(editKey,config)=>{
        return {
            key: "id",
            value: "name",
            desc: "mnemonicCode",
            cols: {
                classId:"分类名",
                mnemonicCode: "助记码",
                name:"品名"
            },
        }
    }),
    classId: {
        show: dicEnum.DicBrandClass,
    },
    measurementUnit: {
        show: dicEnum.MeasurementUnit
    },
    adjustmentType: {
        show: dicEnum.MeasurementUnit
    },
    whsRoomId:new castConfig(dicEnum.DicWhsCalcStackName,dicEnum.DicWhsCalcStackName),
    StoreLocationType:new castConfig(dicEnum.StoreLocationType,dicEnum.StoreLocationType),
    whsinType:new castConfig(dicEnum.WhsInType,dicEnum.WhsInType),
    whsinStyle: {
        show: dicEnum.WhsInStyle
    },
    transferStatus: {
        show: dicEnum.TransferStatus
    },
    departmentId: {
        show: dicEnum.DicDepartment
    },
    whsoutType:new castConfig(dicEnum.WhsoutType,dicEnum.WhsoutType),
    cstInTimeType:new castConfig(dicEnum.CstInTime,dicEnum.CstInTime),
    adjustType:new castConfig(dicEnum.AdjustType,dicEnum.AdjustType),
    deleteFlag:new castConfig(dicEnum.DeleteFlag,dicEnum.DeleteFlag),
    whsLevel:new castConfig(dicEnum.WhsLevel,dicEnum.WhsLevel),
    balanceType:new castConfig(dicEnum.BalanceType,dicEnum.BalanceType),
    payType: {
        show: dicEnum.PayType,
    },
    costType:new castConfig(dicEnum.CostType,dicEnum.CostType),
    regularType:new castConfig(dicEnum.CostType,dicEnum.CostType),
    businessType:new castConfig(dicEnum.BusinessType,dicEnum.BusinessType),
    regularUnit:new castConfig(dicEnum.RegularUnit,dicEnum.RegularUnit),
    rangeApply:new castConfig(dicEnum.RangeApply,dicEnum.RangeApply),
    regularStatus: {
        show: dicEnum.RegularStatus,
    },
    cstType: {
        show: dicEnum.CstType,
    },
    dataSource:new castConfig(dicEnum.DataSource,dicEnum.DataSource),
    balanceStatus:new castConfig(dicEnum.BalanceStatus,dicEnum.BalanceStatus),
    whsType:new castConfig(dicEnum.WareHouseType,dicEnum.WareHouseType),
    invoiceType:new castConfig(dicEnum.InvoiceType,dicEnum.InvoiceType),
    balanceNode:new castConfig(dicEnum.BalanceNode,dicEnum.BalanceNode),
    balanceNoType:new castConfig(dicEnum.BalanceNoType,dicEnum.BalanceNoType),
};
// ---------------------------------------------------------

export default {
    baseType,
    dicEnum,
    castDic,
    getDataSource,
    castConfig
}