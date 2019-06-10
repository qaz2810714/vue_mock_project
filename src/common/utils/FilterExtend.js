/**
 * 过滤器扩展类
 */
//---------------------------------
/**
 * 字符串转整形过滤器
 * @param {*} val 
 */
function toInt(val) {
    if (isNaN(val)) {
        return val;
    }
    return Number.parseInt(val);
}

export default {
    filters: {
        toInt
    }
}