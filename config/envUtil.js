module.exports = {
    getServiceUrl: () =>{
        console.log("node.js服务器环境变量:" + process.env.CONFIGENV);
        console.log("npm run 运行环境:" + process.env.npm_lifecycle_event);
        var param = process.env.npm_lifecycle_event;
        var serviceUrl = "";
        if(param.includes(":test")){
            serviceUrl = "http://cloudstore.pangmao.zhaogangtest.com/industrialintelligence.cloudstore.pangmao.service/api/";
        }else if(param.includes(":uat")){
            serviceUrl = "http://cloudstore.pangmao.zhaoganguat.com/industrialintelligence.cloudstore.pangmao.service/api/";
        }else if(param.includes(":mock")){
            serviceUrl = "";
        }
        console.log("service地址:" + serviceUrl);
        return serviceUrl;
    }
};