import {
    isString
} from "util";

//-----常用变量----------------------
var KEY_USER = "user";
var KEY_DIC = "dic";
var KEY_DIC_Extend = "dic_extend";

//----- 私有函数 ----------------------
/**
 * 获取缓存对象
 * @param {*} key 
 */
function getCache(key) {
    var cache = localStorage.getItem(key);
    if (cache == null) return null;
    try {
        return JSON.parse(cache);
    } catch (e) {
        return cache;
    }
}
/**
 * 设置缓存
 * @param {*} key 
 * @param {*} data 
 */
function setCache(key, data) {
    if (data == null || isString(data)) {
        localStorage.setItem(key, data);
    } else {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

/**
 * 监听列表
 * @type {Array}
 */
let listenerTableSet = new Set([]);
let listenerColumnSet = new Set([]);

/**
 * 添加监听事件
 * @param listener
 */
function addTableListener(listener) {
    listenerTableSet.add(listener);
};

function addColumnListener(listener) {
    listenerColumnSet.add(listener);
};
/**
 * 删除监听
 * @param {*} listener 
 */
function removeTableListener(listener) {
    if (listenerTableSet.has(listener)) {
        listenerTableSet.delete(listener);
    }
}

function removeColumnListener(listener) {
    if (listenerColumnSet.has(listener)) {
        listenerColumnSet.delete(listener);
    }
}
/**
 * 通知缓存更新
 */
function notify(dic) {
    setTimeout(() => {
        listenerTableSet.forEach(notifyObj => {
            if (notifyObj.callback) {
                notifyObj.callback(dic, notifyObj.win);
            }
        })
        //为watch提供缓冲时间
        setTimeout(() =>
            listenerColumnSet.forEach(notifyObj => {
                if (notifyObj.callback) {
                    notifyObj.callback(dic, notifyObj.win);
                }
            }), 100);
    }, 0);
}
export default {
    getCache,
    setCache,
    notify,
    addTableListener,
    addColumnListener,
    removeTableListener,
    removeColumnListener,
    /**
     * 获取用户信息
     */
    getUser: function () {
        return getCache(KEY_USER);
    },
    setUser: function (data) {
        setCache(KEY_USER, data);
    },
    getDic: function () {
        return getCache(KEY_DIC);
    },
    setDic: function (data) {
        setCache(KEY_DIC, data);
    },
    clearCache: function (key) {
        if (key == null) {
            localStorage.clear();
        } else {
            localStorage.removeItem(key);
        }
    }
}