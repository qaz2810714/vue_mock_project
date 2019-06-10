import Vue from "vue";
import userCache from "@/common/utils/CacheUtil.js";

// let remove = Vue.util.remove;
/**权限指令**/
const has = Vue.directive("has", {
  bind: function(el, binding, vnode) {
    // 获取按钮权限
    let btnPermissions = vnode.context.$route.meta.btnPermissions;
    if (btnPermissions == null) return;
    if (!Vue.prototype.$_has(btnPermissions, binding.value)) {
      if (binding.value == null) return;
      el.setAttribute("data-nopermission", 1);
    }
  },
  inserted: function(el,binding, vnode) {
    var nopermission = el.getAttribute("data-nopermission") == 1;
    if (nopermission) {
      vnode.parent.child.setDisabled(true);
    }
  }
});

// 权限检查方法
Vue.prototype.$_has = function(btnPermissions, permission) {
  let isExist = false;
  if (permission != null) {
    if (btnPermissions.includes(permission)) {
      isExist = true;
    }
  }
  return isExist;
};

function getPermission(key) {
  let routes = [];
  let userPermission = userCache.getUser();
  let perMap = new Map();
  if (userPermission != null) {
    for (let k of Object.keys(userPermission.authorities)) {
      perMap.set(k, userPermission.authorities[k]);
    }
  }
  for (var route of key) {
    if (!route.base) {
      //业务菜单需要做权限控制
      let newRoute = getChildMenu(route,perMap);
      if (newRoute) {
        routes.push(newRoute);
      }
    } else {
      //如果属于基础菜单类型直接加入路由
      routes.push(route);
    }
  }
  return routes;
}

function getChildMenu(route,perMap) {
  var newRoute;
  var per;
  var children = route.children;
  if (children) {
    let newChilds = [];
    for (var child of children) {
      let newChild = getChildMenu(child,perMap);
      if (newChild) {
        newChilds.push(newChild);
      }
    }
    if (newChilds.length > 0) {
      route.children = newChilds;
      newRoute = route;
    }
  } else {
    per = route.path.substr(1);
    if (perMap.has(per)) {
      if (route.meta == null) {
        route.meta = {};
      }
      route.meta.btnPermissions = perMap.get(per);
      newRoute = route;
    }
  }
  return newRoute;
}

/**
 * 获取路由对应的权限信息
 * @param route
 * @returns {*}
 */
function getRoutePermission(route){
  return userCache.getUser().authorities[route];
}

/**
 * 按钮权限
 * @param menu
 * @returns {*}
 */
function getBtnPermission(menu) {
  let userPermission = userCache.getUser();
  let perMap = new Map();
  if (userPermission != null) {
    for (let k of Object.keys(userPermission.authorities)) {
      perMap.set(k, userPermission.authorities[k]);
    }
  }
  if (perMap.has(menu.path.substr(1))) {
    if (menu.meta == null) {
      menu.meta = {};
    }
    menu.meta.btnPermissions = perMap.get(menu.path.substr(1));
  }
  return menu;
}

export default {
  has,getRoutePermission,
  getPermissionRote(baseRote) {
    return getPermission(baseRote);
  },
  getBtnPermission(menu) {
    return getBtnPermission(menu);
  },
};
