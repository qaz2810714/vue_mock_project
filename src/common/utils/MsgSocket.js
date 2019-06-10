import cacheUtil from './CacheUtil'
import httpUtil from './HttpUtil'
import {loadCache} from '../../api/api'

let isRunning = false;
let websock = null;
let wsUrl = httpUtil.serviceUrl.replace("http:","ws:").replace("https:","ws:");
if(!wsUrl.endsWith("/")){
    wsUrl+="/";
}
wsUrl +=  "socket";
/**
 * 初始化socket
 */
function initWebSocket() { 
    //1.启动前先执行缓存读取
    var dic = cacheUtil.getDic();
    if(dic == null){
        //1.启动前先执行缓存读取
        isRunning = false;
        try{
          websocketClose();
        }catch(ex){
          console.log(ex);
        }
    }
    if(isRunning) return;
    if(dic == null){
        //1.启动前先执行缓存读取
        loadCache();
    }else{
        //缓存已经存在的情况下，做异步更新
        setTimeout(function(){
            loadCache();
            console.log("更新缓存");
        },0);
    }
    console.log("启动socket");
    //2.初始化weosocket 
    var user = cacheUtil.getUser();
    if(user == null) return;
    const wsuri = wsUrl + "?token="+ user.token; //ws地址
    websock = new WebSocket(wsuri);
    websock.onopen = websocketOnOpen;
    websock.onerror = websocketOnError;
    websock.onmessage = websocketOnMessage;
    websock.onclose = websocketClose;
    //启动一个心跳任务，每10秒发送一次空信息
    
    setInterval(function(){
        websocketSend("心跳检测");
    },10000);
};

function websocketOnOpen() {
    isRunning = true;
    console.log("WebSocket连接成功");
}

function websocketOnError(e) { //错误
    isRunning = false;
    console.log("WebSocket连接发生错误");
};
function websocketClose(e) { //关闭 
    isRunning = false;
    console.log("connection closed (" + e.code + ")");
}
function websocketOnMessage(e) { //数据接收 
    const redata = JSON.parse(e.data);
    console.log("我的websocket消息接收:");
    console.log(redata);
    //刷新缓存
    refreshCache(redata);
}
/**
 * 发送消息
 * @param {*} agentData 
 */
function websocketSend(agentData) { //数据发送 
    if(websock==null) return;
    websock.send(agentData);
};

//找钢消息接收
function refreshCache(msg){
    try{
        if(msg!=null && msg.content!=null && msg.title.includes("cache_change")){
            var isAll = (msg.content == "-1000");
            var user = cacheUtil.getUser();
            var isMatchAccount = user != null && msg.content == user.accountId;
            //过滤掉非本仓库的变更
            if (!isAll && !isMatchAccount) return;
            //更新缓存
            loadCache(null,dic=>{
               //通知各控件更新
               cacheUtil.notify(dic);
            });
        }
    }catch(e){
        console.log(e);
    }
}

export default {
    created: function () {
        //页面刚进入时开启长连接
        initWebSocket();
    },
    destroyed: function () {
        //页面销毁时关闭长连接
        websocketClose();
    },
    send:function(data){
        //发送消息
        websocketSend(data);
    }
}