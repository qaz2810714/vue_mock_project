import store from "./index";
import Main from '@/views/Main.vue'
import util from '@/common/js/util'
import permission from '@/common/utils/Permission'
import * as actions from '../vuex/actions'


let homeTab = { 
    path: '/main', 
    component: Main, 
    name: '主页',
    menuId: 'home' 
}

let editPermissionMap = new Map();
editPermissionMap.set('/NoteAdjustDetailGrid','NoteAdjustGrid');
editPermissionMap.set('/NoteLockDetailGrid','NoteLockGrid');
editPermissionMap.set('/WhsTransferDetailGrid','WhsTransferManage');
editPermissionMap.set('/NoteWhsInDetailGrid','NoteWhsInGrid');
editPermissionMap.set('/WhsMoveDetailGrid','WhsMoveManage');
editPermissionMap.set('/NoteWhsOutDetailGrid','NoteWhsOutGrid');


// 应用初始状态
const state = {
    currentTabIndex: homeTab.menuId, // 当前显示的 tab
    lastTabIndex: homeTab.menuId, // 上次显示的 tab
    homeTabMenuId: homeTab.menuId,   // 主页 tab 的 menuId
    openedTabs: [                         // 当前打开的 tab 列表
        // conf.homeTab
        homeTab
    ],
}
/**
 * 获取guid
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//获取路由
function getRouteByUrl(url,routeList){
    var list = routeList.filter(a=>a.path==url);
    if(list.length>0) return list[0];
    for(var index in routeList){
        var root = routeList[index];
        if(root.children==null) continue;
        return getRouteByUrl(url,root.children);
    }
    return null;
}

const getters = {
    // 获取 当前显示的 tab name
    GetCurrentTabIndex(state) {
        return state.currentTabIndex
    },
    // 获取 主页 tab 的 menuId
    GetHomeTabMenuId(state) {
        return state.homeTabMenuId;
    },
    // 获取 当前打开的 tab 列表
    GetOpenedTabs(state) {
        return state.openedTabs
    },
    // 获取查询参数
    GetQuery(state) {
        let res = Object.create(null)
        state.openedTabs.map(i => {
            if (i.menuId === state.currentTabIndex) {
                if(i.components){
                    let end = i.components.length - 1
                    res = i.components[end].query || {}
                    return
                }
            }
        })
        return res
    },
    // 获取当前激活的 tab
    GetCurrentTab(state) {
        return state.openedTabs.find(i => i.menuId === state.currentTabIndex)
    }

}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    // 设置 hash
    SetHash(state) {
        //let cur = state.openedTabs.find(i => i.menuId === state.currentTabIndex)
        //location.hash = Base64.encode(JSON.stringify(cur))
    },
    // 设置 主页 tab
    SetHomeTab(state, item) {
        state.homeTabMenuId = item.menuId
        state.openedTabs[0] = item
    },
    // 回显 tab
    reShowHash(state,item) {
        // let url = location.href
        // let indexOfSharp = url.indexOf('#')
        // if (indexOfSharp > 0) {
        //     let hash = url.substr(indexOfSharp + 1)
        //     //let tab = getRouteByUrl(hash,arr);
        //     // JSON.parse(Base64.decode(hash))
        //     let tab = JSON.parse(hash);
        //     if (tab.menuId === state.homeTabMenuId) {
        //         state.openedTabs = state.openedTabs.filter(i => i.menuId !== state.homeTabMenuId)
        //     }
        //     state.openedTabs.push(tab)
        //     state.currentTabIndex = tab.menuId
        // }
    },
    // 设置 当前显示的 tab name
    SetCurrentTabIndex(state, data) {
        state.currentTabIndex = data
        //store.commit('SetHash')
    },
    // 添加 tab 到 tab 列表
    OpenedTabsPush(state, item) {
        if(item.menuId==null){
            if(item.name.includes("[")){
              //编辑界面只能打开一个
              item.menuId = item.name;
            }else{
              //新增界面可以打开多个
              item.menuId = guid();
              var date = new Date();
              item.name = item.name + util.formatDate.format(date,'mmss');
            }
            //设置meta数据
            item.meta ={};
            try{
                if(item.propsData.parent || item.propsData.parentView){
                    if(item.propsData.parent==null){
                        item.propsData.parent = item.propsData.parentView;
                    }
                    var tab = item.propsData.parent.$vnode.context.tabData;
                    var permissions = [];
                    if(editPermissionMap.has(tab.path)){
                        //获取相关权限信息
                        permissions = permission.getRoutePermission(editPermissionMap.get(tab.path));
                    }else{
                        permissions = tab.meta.btnPermissions;
                    }
                    item.meta = { btnPermissions:permissions };
                }
            }catch(ex){
              console.log(ex);
            }
        }
        // 设置当前要显示的 tab name
        state.lastTabIndex = state.currentTabIndex;
        // 判断 tab 项是否已存在(此判断用于兼容动态修改title的情况)
        let tabExsit = state.openedTabs.find(i => i.menuId === item.menuId || i.name === item.name);
        if(tabExsit){
            state.currentTabIndex = tabExsit.menuId;
        }else{
            state.currentTabIndex = item.menuId;
        }
        
        if (!tabExsit) {
            state.openedTabs.push(item);
        } else if (item.fromHistory) {               // 点击前进后退按钮
            state.openedTabs.map(i => {
                if (i.menuId === item.menuId) {
                    i.component = item.component
                }
            })
        }
        store.commit('reShowHash')
        //if (!item.fromHash) store.commit('SetHash')
    },
    // 当前 tab 内部的跳转
    OpenedSubTabsPush(state, item) {
        state.openedTabs.map(i => {
            if (i.menuId === state.currentTabIndex) {
                i.components.push(item)
            }
        })
        //store.commit('SetHash')
    },
    // 返回
    OpenedSubTabsBack(state, num = 1) {
        if (num < 1) num = 1
        state.openedTabs.map(i => {
            if (i.menuId === state.currentTabIndex) {
                let newLength = i.components.length - ~~num
                if (newLength > 0) {
                    i.components = i.components.slice(0, newLength)
                }
            }
        })
        //store.commit('SetHash')
    },
    // 替换当前组件
    OpenedSubTabsReplace(state, item) {
        let index = state.openedTabs.length - 2
        state.openedTabs.map(i => {
            if (i.menuId === state.currentTabIndex) {
                i.components.splice(index, 1, item)
            }
        })
        //store.commit('SetHash')
    },
    // 从 tab 列表 移除 tab
    OpenedTabsRemove(state, menuId) {
        state.openedTabs.splice(state.openedTabs.findIndex(item=>item.menuId==menuId),1);
        // 查询当前标签是否被关闭，如果被关闭，则打开主页标签
        var length = state.openedTabs.length;
        // let tab = state.openedTabs.findLast(item => item.menuId === menuId)
        let tab = state.openedTabs[length-1];
        if (tab) {
            state.currentTabIndex = tab.menuId;
            //store.commit('SetHash');
            store.commit('reShowHash');
        }
    },
    /**
     * 更新标题
     */
    updateTitle(state,item){
        state.currentTabIndex = item.menuId;
        //store.commit('SetHash');
        store.commit('reShowHash');
    },
    /**
     * 关闭所有的tab页
     */
    closeAll(state,item){
        state.openedTabs = state.openedTabs.filter(i => i.menuId == state.homeTabMenuId);
        //store.commit('SetHash');
        state.currentTabIndex = state.homeTabMenuId;
        store.commit('reShowHash');
    }
}
const action ={
    updateTitle:({commit},item)=>commit('updateTitle',item),
    closeAll:({commit})=>commit('closeAll'),
}
// 创建 store 实例
export default {
    actions:{...actions,...action},
    getters,
    state,
    mutations
}