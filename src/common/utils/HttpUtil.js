import axios from 'axios';
import md5 from 'js-md5';
import cacheUtil from '../utils/CacheUtil'
import { Loading,MessageBox } from 'element-ui';
import { showLoading, hideLoading } from './loading';

const parseEvironment = (hostname, domain) => {
    return hostname.substring(hostname.indexOf(domain) + domain.length, hostname.lastIndexOf('.'));
}

var serviceUrl = 'http://localhost:8088/api/';
var hostname=window.location.hostname;
if(typeof window != 'undefined'){    
    let environment = "";  
    if(hostname.indexOf("pangmaoyuncang")!=-1){
        environment = parseEvironment(hostname,'pangmaoyuncang');
    }else{
        environment = parseEvironment(hostname,'pangmaomiao');
    }
    console.log("环境"+environment);
    var protocol=window.location.protocol;
    if (environment == 'test') {
        serviceUrl = protocol+"//wmsapi.pangmaoyuncangtest.com/industrialintelligence.cloudstore.pangmao.service/api/";
    } else if (environment == 'uat') {
        serviceUrl = protocol+"//wmsapi.pangmaoyuncanguat.com/industrialintelligence.cloudstore.pangmao.service/api/";
    }
    //在MOCK环境下使用mock.js
    else if(hostname == "localhost"){
        require ('../../mock/mock.js')
        serviceUrl = "/api/"
    }
}
// if(hostname=="localhost"){
//     serviceUrl = process.env.ServiceUrl;     
// }

let base = serviceUrl;
//let base = process.env.ServiceUrl;
//base = "http://cloudstore.pangmao.zhaogangmit.com/industrialintelligence.cloudstore.pangmao.service/api/";
//base = "http://127.0.0.1:8085/api/";
axios.defaults.baseURL = base;
/**
 * 请求拦截器
 */
axios.interceptors.request.use(
    config => {
        var submit = config.data;
        if(submit.isShowLoading){
            showLoading();
        }
        var user = cacheUtil.getUser();
        var userId = null,accountId = null,token ="";
        if(user!=null && typeof(user)=="object"){
            userId = user.userId;
            accountId = user.accountId;
            token = user.token;
            if(token==null || token ==undefined){
                token = "";
            }
        }
        config.headers["token"] = token;
        
        if(!config.headers["Content-Type"]){
            config.headers["Content-Type"] ="application/json";
            var requestData = {
                UserId : userId,
                AccountId : accountId,
                data : submit.data
            };
            config.data = JSON.stringify(requestData);
            var signature = md5(config.data+'{zhao.gang}').substr(0,5);
            config.headers["signature"] = signature;

        }else if(config.headers["Content-Type"] =="multipart/form-data"){
            var requestData = {
                UserId : userId,
                AccountId : accountId,
                data : submit.data
            };
            var data = new FormData();
            var jsonStr = JSON.stringify(requestData);
            data.append("data",jsonStr);
            var fileList = [];
            if(config.files!=null){
                config.files.forEach(file => {
                    var f = file;
                    data.append("files",f.raw);
                    fileList.push({key:f.uuid,value:f.name});
                });
            }
            //data.append("fileList",JSON.stringify(fileList));
            config.data = data;
            var signature = md5(jsonStr+'{zhao.gang}').substr(0,5);
            config.headers["signature"] = signature;
        }
        //config.httpAgent = new http.Agent({ keepAlive: true });
        //config.httpsAgent = new https.Agent({ keepAlive: true });
        return config;
    },
    err =>{
        hideLoading();
        return Promise.reject(err);
    }
);
/**
 * 响应拦截器
 */
axios.interceptors.response.use(function (response) {
    hideLoading();
    // 对响应数据做点什么
    return response;
}, function (err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)' ; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    }else{
        err.message = '连接服务器失败!'
    }
    hideLoading();
    alert(err.message);
    return Promise.reject(err);
});

function alert(msg){
    MessageBox.alert(msg, '胖猫提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString:true,
        type:'error',
    });
}
//-----------------------------------------------------

export default {
    /**
     * 服务地址
     */
    serviceUrl: base,
    /**
     * 提交数据到服务端
     * @param {*} url 
     * @param {*} data 
     * @param {*} succ 
     */
    post: function(url,data,succ,fail,isShowLoading){
        if(isShowLoading==null){
            isShowLoading = true;
        }
        var submit = {
            isShowLoading,
            data
        };
        return axios.post(url,submit).then(res => {
            if(res.status!=200){
                alert(res.statusText);
                return res;
            }else if(res.data!=null){
                if(res.data.code != 100){
                    if(fail){
                        fail(res);
                    }else{
                        alert(res.data.message);
                    }
                    if(res.data.message==undefined || res.data.message==null) return;
                    if(res.data.message.includes("登录信息失效")){
                        cacheUtil.clearCache();
                        //重新加载界面
                        window.location.reload();
                    }
                    return res;
                }
            }
            if(succ){
                succ(res.data.data);
            }
            return res.data.data;
        });
     },
    export:function(url,param,callback,isShowLoading){
        if(isShowLoading==null){
            isShowLoading = true;
        }
        var submit = {
            isShowLoading,
            data:{
                queryData:param,
                queryUrl:url,
            }
        };
        return axios.post("whsTransfer/exportExcel",submit,{responseType:'blob'}).then(res =>{
            if(res.status!=200){
                alert("文件导出出现错误！");
                return;
            }
            if(res.data.code != 100){
                console.log("正在导出======",res);
                const blob = new Blob([res.data]);
                const filename = `第一个导出文件.xlsx`;
                if("download" in document.createElement("a")){
                    //非IE下载
                    const elink = document.createElement("a");
                    elink.download = filename;
                    elink.style.display = "none";
                    elink.href = URL.createObjectURL(blob);
                    elink.click();
                    URL.revokeObjectURL(elink.href);
                }
                else{
                    navigator.msSaveBlob(blob,filename);
                }
                //如果有回调则使用回调函数
                if (callback) {
                    callback(res);
                }}
        })
    },
    //文件下载
    postForFile:function(url,param,fileName,callback,isShowLoading){
        if(isShowLoading==null){
            isShowLoading = true;
        }
        var submit = {
            isShowLoading,
            data:param
        };
        return axios.post(url,submit,{responseType:'blob'}).then(res =>{
            //判断是否为文件流格式，如果不为文件流直接抛出异常
            let isFileStrem = res.headers["content-type"] == "application/octet-stream;charset=utf-8";
            if(!isFileStrem){
                alert("文件导出出现错误！");
                return;
            }
            else{
                const blob = new Blob([res.data]);
                const filename = fileName;
                if (window.navigator.msSaveOrOpenBlob) {
                    // 兼容IE10
                    navigator.msSaveBlob(blob, filename)
                } else {
                //  chrome/firefox
                    let aTag = document.createElement('a')
                    aTag.download = filename
                    aTag.href = URL.createObjectURL(blob)
                    aTag.click()
                    URL.revokeObjectURL(aTag.href)
                }
                //如果有回调则使用回调函数
                if (callback) {
                    callback(res);
                }}
        })
    },
    isJsonString(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    },
    postWithFile: function(url,data,files,succ,isShowLoading){
        if(isShowLoading==null){
            isShowLoading = true;
        }
        var submit = {
            isShowLoading,
            data
        };
        submit.data.env = "bs";
        let config = { headers: { 'Content-Type': 'multipart/form-data' } ,files:files};
        return axios.post(url,submit,config).then(res => {
            if(res.status!=200){
                alert(res.statusText);
                return res;
            }else if(res.data!=null){
                if(res.data.code != 100){
                    if(res.data.message==undefined || res.data.message==null) return;
                        if(this.isJsonString(res.data.message)){
                            var resObj = JSON.parse(res.data.message);
                            if(resObj.title == '模板内容错误，具体原因如下，请检查后再操作!'){
                                // var msg = JSON.parse(res.data.message.split('\\n').join('</br>')).content;
                                // alert(resObj.title + msg)
                                if(succ){
                                    succ(res.data.message,true);
                                }
                            }else{
                                alert(res.data.message);
                            }
                        }else{
                            alert(res.data.message);
                        }
                    if(res.data.message.includes("登录信息失效")){
                        cacheUtil.clearCache();
                        //重新加载界面
                        window.location.reload();
                    }
                    return res;
                }
            }
            if(succ){
                succ(res.data.data);
            }
            return res.data.data;
        });
     },
}