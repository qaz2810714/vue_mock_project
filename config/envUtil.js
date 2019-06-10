module.exports = {
    getServiceUrl: () =>{
        console.log("node.js服务器环境变量:" + process.env.CONFIGENV);
        console.log("npm run 运行环境:" + process.env.npm_lifecycle_event);
        var param = process.env.npm_lifecycle_event;
        var serviceUrl = "http://localhost:8085/api/";
        if(param.includes(":test")){
            serviceUrl = "http://cloudstore.pangmao.zhaogangtest.com/industrialintelligence.cloudstore.pangmao.service/api/";
        }else if(param.includes(":mit")){
            serviceUrl = "http://cloudstore.pangmao.zhaogangmit.com/industrialintelligence.cloudstore.pangmao.service/api/";
        }else if(param.includes(":sit")){
            serviceUrl = "http://cloudstore.pangmao.zhaogangsit.com/industrialintelligence.cloudstore.pangmao.service/api/";
        }else if(param.includes(":uat")){
            serviceUrl = "http://cloudstore.pangmao.zhaoganguat.com/industrialintelligence.cloudstore.pangmao.service/api/";
        }else if(param.includes(":mock")){
            // serviceUrl = "http:/127.0.0.1:8088/api/";
            serviceUrl = "";
        }
        console.log("service地址:" + serviceUrl);
        return serviceUrl;
    }
};