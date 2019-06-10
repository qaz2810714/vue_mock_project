import httpUtil from "@/common/utils/HttpUtil";
import cacheUtil from "@/common/utils/CacheUtil";
import exportUtil from '@/common/utils/ExportUtil';
import { Loading,MessageBox,Message } from 'element-ui';

function S4() 
{   
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);   
}    
function NewGuid() 
{   
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());   
}

//应用常量 
let appConst = {
  nullNo: "系统自动生成",
  dateFormat: "yyyy/MM/dd",
  timeFormat: "HH:mm:ss",
  dateTimeFormat: "yyyy/MM/dd HH:mm:ss",
  NewGuid,
  getCurrStockName: function () {
    //获取当前仓库名称
    return cacheUtil.getUser().accountName;
  },
  getCurrUser: function () {
    //获取当前用户信息
    return cacheUtil.getUser().configUser;
  },
  getCurrUserName: function () {
    //获取当前用户信息
    return cacheUtil.getUser().configUser.name;
  },
  //深拷贝
  deepClone(data) {
    if (data == null) return null;
    return JSON.parse(JSON.stringify(data));
  },
};
//tab公共处理逻辑
let tab = {
  close: function (tabObj) {
    tabObj.$tab.close(tabObj.$options.parent.tabData.menuId);
  },
  //更新标题
  updateTitle:function(curr,title){
    var item = curr.$options.parent.tabData;
    item.name = title;
    //item.menuId = title;
    curr.$store.dispatch('updateTitle',item);
    //this.$options.parent.tabData.name = title;
  },
  /**
   * 关闭所有tab
   * @param {*} curr 
   */
  closeAll:function(curr){
    curr.$store.dispatch('closeAll');
  },
  
};
//权限处理
let permission = {
  /**
   * 获取父级的权限数据
   * @param {*} curr 
   */
  getPermissions:function(curr){
    try{
      return curr.$vnode.context.tabData.meta.btnPermissions;
    }catch(ex){
      console.error(ex);
      return [];
    }
  },
  /**
   * 是否有保存权限
   * @param {*} curr 
   * @param {*} saveKeys 
   */
  hasSaveAuth: function(curr,saveKeys){
    if(saveKeys==null){
      saveKeys = ["save","add","update","alter","check","lock","unlock"];
    }
    return this.baseValid(curr,saveKeys);
  },
  /**
   * 是否有检查权限
   * @param {*} curr 
   * @param {*} saveKeys 
   */
  hasCheckAuth: function(curr,saveKeys){
    if(saveKeys==null){
      saveKeys = ["check", "lock"];
    }
    return this.baseValid(curr,saveKeys);
  },
  /**
   * 是否有打印权限
   * @param {*} curr 
   * @param {*} saveKeys 
   */
  hasPrintAuth: function(curr,saveKeys){
    if(saveKeys==null){
      saveKeys = ["print"];
    }
    return this.baseValid(curr,saveKeys);
  },
  /**
   * 基础验证
   * @param {*} keys 
   * @param {*} permissions 
   */
  baseValid:function(curr,keys){
    var permissions = this.getPermissions(curr);
    for(var i=0;i<keys.length;i++){
      var key = keys[i];
      for(var j =0;j<permissions.length;j++){
        var perm = permissions[j];
        if(perm.includes(key)) return true;
      }
    }
    return false;
  }
};
/**
 * 验证类
 */
let valid = {
  //是否按件出库
  isOutByNum: function (brandId, brandCache) {
    if (!brandCache) {
      brandCache = cacheUtil.getDic().BrandNameList.list;
    }
    var brand = brandCache.find(a => a.id == brandId);
    if (brand) {
      return brand.whsoutType == 1;
    }
    return false;
  },
  throwEx: function (curr, msg) {
    //兼容两种用法，可以不传递 this指针了
    if(!msg){
      msg = curr;
    }
    message.alert(msg, 'warning');
    throw new Error(msg);
  }
};
/**
 * 计算类
 */
let calc = {
  fixSix: value => {
    if (!value) {
      return 0;
    }
    return value.toFixed(6);
  },
  fixThree: value => {
    if (!value) {
      return 0;
    }
    return value.toFixed(3);
  },
  fixTwo: value => {
    if (!value) {
      return 0;
    }
    return value.toFixed(2);
  }
};
/**
 * 消息处理
 */
let message = {
  //提示框
  alert:(msg,type) =>{
    if(type==null){
      type = 'info';
    }
    msg = msg.replace("\r\n","<br/>");
    MessageBox.alert(msg, '胖猫提示', {
      confirmButtonText: '确定',
      dangerouslyUseHTMLString:true,
      type,
    });
  },
  confirm:(msg,ok,cancel)=>{
    MessageBox.confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if(ok){
        ok();
      }
    }).catch(() => {
      if(cancel){
        cancel();
      }
      // }else{
      //   Message({
      //     type: 'info',
      //     message: '取消操作',
      //     duration: 1000,
      //   });   
      // } 
    });
  },
  loading:function(vue,msg) {
    if(!msg){
      msg = "正在加载中..."
    }
    const loading = vue.$loading({
      lock: true,
      text: msg,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    return loading;
  },
};
/**
 * 参数处理
 */
let handler = {
  statusHander:function(param){
    param.fStatus = param.status;
    param.status = null;
  },
  packNoHander:function(param){
    if(param.fPackNo!=null && param.fPackNo.length==1){
      param.packNo = param.fPackNo[0];
      param.fPackNo =null;
    }else{
      param.packNo = null;
    }
  }
};
//------------ 原型方法 ------------------
Array.prototype.group = function (callback) {
  var groups = {};
  //分组,
  this.forEach(a => {
    var key = callback(a);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(a);
  });
  return groups;
}
/**
 * 合计方法
 */
Array.prototype.sum = function(mapper){
  if(this==null || this.length==0) return 0;
  return this.map(mapper).reduce((sum, val) => { 
      if(sum==null){ sum=0;}
      const value = Number(val);
      if (!isNaN(value)) {
        return sum + value;
      } else {
        return sum;
      }
    });
}
//---------------------------------------
export default {
  appConst,
  deepClone: appConst.deepClone,
  tab,
  valid,
  calc,
  permission,
  message,
  handler,
  export:exportUtil.export,
  cloudExport:exportUtil.cloudExport,
  //计算比例
  calUnitWeight(obj, netWeight, grossWeight, poundWeight, number) {
    if (number == 0) {
      obj.netUnit = 0;
      obj.grossUnit = 0;
      obj.poundUnit = 0;
    } else {
      obj.netUnit = (netWeight / number).toFixed(6);
      obj.grossUnit = (grossWeight / number).toFixed(6);
      obj.poundUnit = (poundWeight / number).toFixed(6);
    }
  },

  //空处理
  nullParam(param) {
    for (var prop in param) {
      if (param[prop] === "") {
        param[prop] = null;
      }
    }
  },
  //map转对象
  strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  },
  /**
   * 选择产品
   */
  selProduct(parent, filter, callback){
    if(filter==null){
      filter = {};
    }
    if(filter.cstId == null){
      valid.throwEx(parent,"请先选择货主单位");
    }
    //禁用字段
    if(filter.lockFields == null){
      filter.lockFields = ["cstId"];
    }
    this.selProductNoCst(parent, filter, callback);
  },
  //获取库存信息
  selProductNoCst(parent, filter, callback) {
    if(filter==null){
      filter = {};
    }
    if(filter.lockFields == null){
      filter.lockFields = [];
    }
    if (filter.fStatus == null){
      //在库与锁定的数据
      filter.fStatus = [1, 5];
    }
    if (filter.fStatus.length==0){
      //不指定状态，则认为是查找所有的状态
      filter.fStatus = null;
    }
    if(filter.extFilter==undefined || filter.extFilter==null || filter.extFilter==""){
      filter.extFilter = "((b.whsout_type=1 and a.number>0) or ((b.whsout_type=2 and a.net_weight>0)))";
    }
    parent.$layer.iframe({
      content: {
        parent: parent, //当前的vue对象
        data: {
          selected: function (rows) {
            console.log("选择的库存数据");
            console.log(rows);
            if (callback) {
              callback(rows);
            }
          },
          filter:JSON.stringify(filter), //过滤条件
          selectedValid:filter.selectedValid,
          lockFields:JSON.stringify(filter.lockFields),//禁用的字段
        } //props
      },
      area: ['1200px', '600px'],
      shadeClose:false,
      title: '挑选库存'
    });
  },
  //获取实体
  getEntity(mainUrl, detailUrl, query, callback) {
    var formModel = {};
    //var query = { page: 0, size: 1000, adjustId: key};
    httpUtil.post(mainUrl, query, data => {
      if (data.content != null && data.content.length > 0) {
        formModel = data.content[0];
        if (detailUrl) {
          httpUtil.post(detailUrl, query, data => {
            formModel.detailList = data.content;
            callback(formModel);
          });
        } else {
          callback(formModel);
        }
      }
    });
  },
  //非分页接口获取实体
  getEntityNoPage(mainUrl, detailUrl, query, callback) {
    var formModel = {};
    httpUtil.post(mainUrl, query, data => {
      if (data != null) {
        formModel = data;
        httpUtil.post(detailUrl, query, data => {
          formModel.detailList = data;
          callback(formModel);
        });
      }
    });
  },
  //非分页接口获取实体包含文件
  getEntityNoPageWithFile(mainUrl, detailUrl,fileUrl, query, callback) {
    var formModel = {};
    httpUtil.post(mainUrl, query, data => {
      if (data != null) {
        formModel = data;
        httpUtil.post(detailUrl, query, data => {
          formModel.detailList = data;
          httpUtil.post(fileUrl, query, data => {
            formModel.fileList = data;
            callback(formModel);
          });
        });
      }
    });
  },
  //非分页接口获取实体包含文件(出库)
  getEntityNoPageWithFileOut(mainUrl, detailUrl,fileUrl, query, callback) {
    var formModel = {};
    httpUtil.post(mainUrl, query, data => {
      if (data != null) {
        formModel = data;
        httpUtil.post(detailUrl, query, data => {
          formModel.detail = data;
          httpUtil.post(fileUrl, query, data => {
            formModel.fileList = data;
            callback(formModel);
          });
        });
      }
    });
  },
  /**
   * 删除数据
   */
  removeRows(rows, callback) {
    var temp = appConst.deepClone(rows);
    temp.forEach(item => {
      if (callback) {
        callback(item);
      }
    });
  },
  //table根据业务id移除选中行
  removeSelectedRows(rows, dataSource, validator, callback) {
    var temp = appConst.deepClone(rows);
    if (validator == null) {
      validator = (dsIndex, item) => dsIndex.id === item.id;
    };
    temp.forEach(item => {
      if (callback) {
        callback(item);
      }
      dataSource.splice(dataSource.findIndex(data1 => validator(data1, item)), 1)
    });
  },
  //table根据index移除选中行
  removeSelectedRows2(rows, dataSource) {
    var temp = appConst.deepClone(rows);
    temp.forEach(item => {
      if (item.id) {
        dataSource.splice(dataSource.findIndex(data1 => data1.id === item.id), 1)
      } else if (item.index) {
        dataSource.splice(dataSource.findIndex(data1 => data1.index === item.index), 1)
      }
    });
  },
  //只查询明细级信息，并添加到主单的detailList中
  getDetailEntity(detailUrl, query, mainData, callback) {
    var formModel = JSON.parse(JSON.stringify(mainData));
    if (formModel) {
      httpUtil.post(detailUrl, query, data => {
        formModel.detailList = data;
        callback(formModel);
      });
    }
  },
  //--- 业务数据 联动 begin ---------------
  /**
   * 获取品种信息
   * @param {*} brandId 
   * @param {*} callback 
   */
  getBrandInfo(brandId, callback,cache) {
    if(cache==null){
      cache = cacheUtil.getDic();
    }
    if(cache){
       var brand = cache.BrandNameList.list.find(a=>a.id==brandId);
       if(brand && brand.textureList){
         callback(brand.textureList);
       }else{
         callback([]);
       }
    }else{
      callback([]);
    }
  },
  //--- 业务数据 联动 end -----------------
  //判空
  IsNull(val){
    if(val == null || val == 'undefined'){
      return true;
    }else{
      return false;
    }
  }
}