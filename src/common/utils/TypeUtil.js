function varType(n) {
    var typeStr = Object.prototype.toString.call(n);
    //var typeOfName = (typeof n);
    var typeName = '';
    switch (typeStr){
        case '[object String]':
            typeName = 'string';
            break;
        case '[object Number]':
            typeName = 'number';
            break;
        case '[object Boolean]':
            typeName = 'boolean';
            break;
        case '[object Undefined]':
            typeName = 'undefined';
            break;

        case '[object Object]':
            typeName = 'object';
            break;
        case '[object Array]':
            typeName = 'array';
            break;
        case '[object Null]':
            typeName = 'null';
            break;
        case '[object RegExp]':
            typeName = 'RegExp';
            break;
        case '[object Symbol]':
            typeName = 'symbol';
            break;
        case '[object JSON]':
            typeName = 'json';
            break;
        case '[object Math]':
            typeName = 'math';
            break;
        default:
            typeName = 'object';
    }

    return typeName;
};
/**
 * 类型处理工具类
 */
export default{
    getType:varType
}
