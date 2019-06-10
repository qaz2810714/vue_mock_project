import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import NotFound from "@/views/404.vue";
import Home from "@/views/Home.vue";
import Blank from "@/views/Blank.vue";
import IFrame from "@/views/IFrame.vue";

const fillSubRoutesByLoop= function(treeNode) {
    let menu = treeNode.node;
    let subNodes = treeNode.subNodes;
    // 判断是否包含分类的子层
    let hasType3Sub = false;
    if(subNodes) {
        subNodes.forEach(subNode=>{
            if(subNode.subNodes) {
                hasType3Sub = true;
                return false;
            }
        });
    }
    // 构建当前Route
    let route;
    if(menu.type == 3 || menu.type == 1) {
        // 菜单类型为：分类、功能页面 的纳入到路由中，页面按钮的直接忽略
        // menu.componetName = './wms/noteTransfer/NoteTransferManage.vue';
        // menu.iconCls = 'pm-font pm-icon-piaoquan';
        let pageComponent;
        if(menu.type == 3 && hasType3Sub) {
            pageComponent = Home;
        }else if(menu.type == 3) {
            pageComponent = Blank;
        }else if(menu.url.indexOf('http')!=-1) {
            pageComponent = IFrame;
        }else{
            pageComponent = (resolve) => {
                require.ensure(
                    [], 
                    (require) => {resolve(require.context('@/views', true, /\.vue$/)(`${menu.componetName}`));}, 
                    'modulepages'
                );
            };
        }
        route = {
            component: pageComponent,
            iconCls: menu.iconCls,
            menuId: menu.parentPath,
            name: menu.name,
            path: menu.type == 1 && menu.url ? '/' + menu.url : '/' + menu.parentPath,
            meta: {iframeSrc: menu.url}
        }
    }
    // 循环构建子Route并放如children中
    if(subNodes && menu.type == 3) {
        let children = [];
        subNodes.forEach(subMenu=>{
            let tmpSubRoute = fillSubRoutesByLoop(subMenu);
            if(tmpSubRoute) {
                children.push(tmpSubRoute);
            }
        });
        route.children = children;
    }
    return route;
}

// 将系统的菜单转为路由
const initRouterFromMenuData = function(menus) {
    // 静态部分路由：登录页、首页、404页
    let dynamicRoutes = [
        {path: "/login", component: Login, name: "", menuId:"login", base: true, hidden: true },
        {path: "/", component: Home, name: "", menuId:"home", base: true, hidden: true},
        {path: "/404", component: NotFound, name: "", menuId:"404", base: true, hidden: true }
    ];
    // 动态路由部分（根据menus菜单转换为路由定义）
    menus.forEach(menu=>{
        let tmpRoute = fillSubRoutesByLoop(menu);
        if(tmpRoute) {
            dynamicRoutes.push(tmpRoute);
        }
    });
    // 其它所有页面转入首页(最后才添加)
    dynamicRoutes.push({path: "*", base: true, hidden: true, redirect: { path: "/" }});
    return new VueRouter({routes: dynamicRoutes});
};

export default initRouterFromMenuData;