import httpUtil from '../common/utils/HttpUtil'
import cacheUtil from '../common/utils/CacheUtil'
//---------------- api 接口定义 begin---------------------
function loadColDic(user,callback){
    // 登录成功后，获取设置信息
    httpUtil.post("/userUiSetting/getAll",{
        userId :user.userId
    },list =>{
        var colDic = {};
        if(list!=null){
            list.forEach(a=>{
                colDic[a.componentKey] = {
                id : a.id,
                configType: a.configType,
                cols : JSON.parse(a.configJson)
                };
            });
        }
        cacheUtil.setCache("DicVisibelCols",colDic);
        if(callback){
            callback();
        }
    },err=>{
        if(callback){
            callback();
        }
    }).catch(err=>{
        console.error(err);
        if(callback){
            callback();
        }
    });
}
//user - service
export const userLogin = (params,callback) => {
    
    return httpUtil.post("user/login", params, data => {
        //组装仓库信息
        // data.accountId = params.account.id;
        // data.accountName = params.account.name;
        data.accountInfo = params.account;
        // data.stock = params.account;
        cacheUtil.setUser(data);
        try{
            //加载用户界面的设置信息
            loadColDic(data,()=>{
                if(callback){
                    callback(data);
                }
            });
        }catch(err){
            console.error(err);
            if(callback){
                callback(data);
            }
        }
    });
};
// ----------------- 缓存处理 begin ----------------
/**
 * 加载缓存数据
 * @param {*} params 
 */
export const loadCache = (params,callback) => {
    var dic = {};
    //字典项缓存
    httpUtil.post("dict/getall", params, data => {
        dic = wrapDicData(dic, data);
        //基础数据缓存
        httpUtil.post("dict/getBaseData", params, data => {
            dic = wrapBaseData(dic, data);
            cacheUtil.setDic(dic); //设置缓存信息
            if(callback){
                callback(dic);
            }
        });
    },null,false);
};
/**
 * 数据转换
 * @param {array} data 
 * @param {*} callback 
 */
function baseWrap(data, callback) {
    var dicObj = {};
    var arr = data.map(function (item, key, ary) {
        return callback(item);
    });
    return arr;
}
//组装字典项缓存
function wrapDicData(dic, data) {
    var dicObj = {};
    for (var key in data) {
        var arr = data[key];
        var castArr = baseWrap(arr, a => {
            return {
                category: a.className,
                model: a,
                name: a.itemName,
                value: a.itemValue,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: function (model) {
                return model.value;
            }
        };
    }
    return { ...dic,
        ...dicObj
    };
}
//组装基础数据缓存
function wrapBaseData(dic, data) {
    var dicObj = {};
    for (var key in data) {
        var arr = data[key];
        switch (key) {
            case "DicBrandName":
                wrapBrand(dicObj, key, arr);
                break;
            case "DicBrandClass":
                wrapBrandClass(dicObj, key, arr);
                break;
            case "DicClientName":
                wrapClientName(dicObj, key, arr);
                break;
            case "DicWhsCalcStackName":
                wrapWhsCalcStackName(dicObj, key, arr);
                break;
            case "DicPhysicalWeight":
                wrapPhysicalWeight(dicObj, key, arr);
                break;
            case "DicTextureName":
                wrapTextureName(dicObj, key, arr);
                break;
            case "DicProducingName":
                wrapProducingName(dicObj, key, arr);
                break;
            case "DicDepartment":
                wrapDepartment(dicObj, key, arr);
                break;
            case "DicUser":
                wrapUser(dicObj, key, arr);
                break;
        }
    }
    return { ...dic,
        ...dicObj
    };
    //获取品种信息
    function wrapBrand(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "BrandNameList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //品类信息
    function wrapBrandClass(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.pid
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "ClassList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //客户信息
    function wrapClientName(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.cstFullName,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "CstList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //仓库信息
    function wrapWhsCalcStackName(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "StackName";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //理重信息
    function wrapPhysicalWeight(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "PhysicalWeightList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //材质信息
    function wrapTextureName(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "Meterial";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //产地信息
    function wrapProducingName(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.placeFullName,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "PlaceList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //部门信息
    function wrapDepartment(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "DepartmentList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
    //用户信息
    function wrapUser(dicObj, key, arr) {
        var castArr = baseWrap(arr, a => {
            return {
                category: key,
                model: a,
                name: a.name,
                value: a.id,
                valid: !a.deleteFlag,
                other: a.remark
            };
        });
        dicObj[key] = {
            key: key,
            list: castArr,
            getKey: model => {
                return model.value;
            }
        };
        var listKey = "UserList";
        dicObj[listKey] = {
            key: listKey,
            list: arr,
            getKey: model => {
                return model.id;
            }
        };
    }
}

// ----------------- 缓存处理 end ----------------
//---------------- api 接口定义 end ----------------------
export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data);
};

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {
        params: params
    });
};

export const getUserListPage = params => {
    return axios.get(`${base}/user/listpage`, {
        params: params
    });
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, {
        params: params
    });
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {
        params: params
    });
};

export const editUser = params => {
    return axios.get(`${base}/user/edit`, {
        params: params
    });
};

export const addUser = params => {
    return axios.get(`${base}/user/add`, {
        params: params
    });
};