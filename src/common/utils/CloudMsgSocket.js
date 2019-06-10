import cacheUtil from './CacheUtil'
import httpUtil from './HttpUtil'
// import cookieUtil from './SubCookieUtil'
import {loadCache} from '../../api/api'
import zgMessage from './messageEngine';

let hostName = httpUtil.serviceUrl.replace("http://","").replace("https://","").replace("/api/","").replace("/api","");
let enableReConnect = true;
let isRunning = false;

zgMessage.Engine.on({
    onOpen: function(e,engine){
        isRunning = true;
        console.log("WebSocket连接成功");
    },
    onClose: function(e,engine){
        isRunning = false;
        console.log("WebSocket关闭");
    },
    onError: function(e,engine){
        isRunning = false;
        console.log("WebSocket出错");
    },
    onMessage: function(msg,engine){
        console.log("WebSocket收到消息:"+JSON.stringify(msg));
        //刷新缓存
        refreshCache(msg);
    }
});
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

function enableConnect(){
    enableReConnect = true;
}
/**
 * 连接方法
 */
function connect(){
    //1.启动前先执行缓存读取
    var dic = cacheUtil.getDic();
    if(dic == null){
        //1.启动前先执行缓存读取
        isRunning = false;
        try{
          zgMessage.Engine.stop();
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
    if(enableConnect){
        var user = cacheUtil.getUser();
        if(user == null) return;
        zgMessage.Engine.start(hostName,{
            securityKey : user.token
        });
        enableReConnect = false;
        setTimeout(enableConnect, 45*1000);
    } else {
        enableReConnect = true;
        setTimeout(connect, 45*1000);
    }
}

export default{
    connect:connect
}