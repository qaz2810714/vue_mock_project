// ---------------------------------------------------------------------------------
// 【VUE】VUE
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
// 【VUE】VUE路由支持
import VueRouter from "vue-router";
Vue.use(VueRouter);
// ---------------------------------------------------------------------------------
// 【第三方】饿了么控件库
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
// 【第三方】弹出式菜单
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
Vue.use(contentmenu);
// 【第三方】layer弹层公用库
import layer from 'vue-layer';
var layerInstance = layer(Vue, {
  msgtime: 2,//目前只有一项，即msg方法的默认消失时间，单位：秒
  shadeClose: false, //点击遮盖层不关闭界面
});
Vue.prototype.$layer = layerInstance;
// ---------------------------------------------------------------------------------
// 【云仓-框架】主页、登录页
import App from "./App";
import Login from '@/views/Login';
import OffLine from  '@/views/OffLine';
// 【云仓-框架】本地存储
import store from "./store/index";
import cacheUtil from "./common/utils/CacheUtil";
Vue.prototype.$cacheUtil = cacheUtil;
// 【云仓-框架】http请求封装
import httpUtil from "@/common/utils/HttpUtil";
Vue.prototype.$httpUtil = httpUtil;
// 【云仓-框架】常用前端方法封装（tab、权限、对象拷贝、valid验证、消息等等）
import commonUtil from "@/common/utils/CommonUtils";
Vue.prototype.$commonUtil = commonUtil;
// 【云仓-框架】业务对象model定义
import metaData from "@/common/entities/Metadata";
Vue.prototype.$metaData = metaData;
// 【云仓-框架】消息通知
import msgSocket from "./common/utils/CloudMsgSocket";
import myMsgSocket from "./common/utils/MsgSocket";
// 【云仓-框架】命令扩展：权限
import has from "./common/utils/Permission";
Vue.use(has);
// 【云仓-框架】路由数据
import initRouterFromMenuData from "./router";
// 【云仓-框架】首页Tab与路由整合
import RouterMethods from '@/RouterMethods';
Vue.use(RouterMethods);
// 【懒加载组件】
import VueLazyComponent from '@xunlei/vue-lazy-component'
Vue.use(VueLazyComponent)
// ---------------------------------------------------------------------------------
// 【图标库】font-awesome
import "font-awesome/css/font-awesome.min.css";
// 【图标库】找钢网内部图标
import './assets/icon/iconfont.css';
// ---------------------------------------------------------------------------------

// 获取当前用户的所有可用功能菜单
httpUtil.post('permission/getPermissionTree', {},
  data => {
    // 成功获取菜单，根据菜单进行应用的初始化
    var router = initApp(data);
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  },
  res => {
    // 业务异常（未登录or服务端内部异常）
    var router = initApp([]);
    new Vue({router,store,render:h=>h(Login)}).$mount('#app');
  },false
).catch(response => {
  // HTTP异常（服务端不在线或服务异常）
  var router = initApp([]);
  new Vue({router,store,render:h=>h(OffLine)}).$mount('#app');
});

// 正常进入系统，初始化应用
function initApp(menus) {
  var router = initRouterFromMenuData(menus);
  /**
   * 实现用户登录身份全局验证
   */
  router.beforeEach((to, from, next) => {
    if (to.path == "/login") {
      cacheUtil.clearCache();
      next();
    }else{
      let user = cacheUtil.getUser();
      if (!user) {
        next({ path: "/login" });
      } else {
        to = has.getBtnPermission(to);
        //创建socket,准备请求缓存数据
        msgSocket.connect(); //找钢消息通讯
        //myMsgSocket.created(); //自定义消息通讯
        next();
      }
    }
  });
  return router;
}


