<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col
        :span="18"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      ><div class="logo-img" v-show="!collapsed">
        <img :src='logoUrl' />
        <span class="logo-img-text" v-show="user.configUser.name">{{user.configUser.name}}</span>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span style="cursor:pointer">
            <i class="pm-font pm-icon-ziyuanxhdpi" style="font-size:24px;">
            
            </i>
            欢迎登录</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided @click.native="resetPassWord">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed menu-dark':'menu-expanded menu-dark'">
        <!--导航菜单-->
        <!-- :default-active="$route.path" -->
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          unique-opened
          router
          v-show="!collapsed"
        >
        <el-scrollbar style='height:100%'>
          <pm-tree-menu :menus ="menus" ref="treeMenu"></pm-tree-menu>
        </el-scrollbar>
        </el-menu>
      </aside>
      <v-contextmenu ref="contextmenu">
            <v-contextmenu-item @click="closeAllTabs">关闭所有Tab</v-contextmenu-item>
      </v-contextmenu>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-tabs ref='tabs' :value="currentTabIndex" @input="$tab.showTab"  @tab-remove="$tab.close" type="card" >
            <el-tab-pane
                v-for="(item) in openedTabs"
                :item="item"
                :key="item.menuId"
                :label="item.name"
                :name="item.menuId"
                :closable="item.menuId !== homeTabMenuId"
            >
              <pm_component :tabData="item"></pm_component>
            </el-tab-pane>
          </el-tabs>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import treeMenu from "@/components/common/menu/TreeMenu";
import permission from "@/common/utils/Permission";
import pm_component from '@/components/common/tab/pm_component';
import resetPasswordView from "./ResetPasswordView";
export default {
  components: { "pm-tree-menu": treeMenu,pm_component },
  data() {
    return {
      menus: [],
      sysName: "权限管理平台",
      collapsed: false,
      logoUrl: require('@/assets/logo.png'),
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    closeAllTabs(){
      this.$commonUtil.tab.closeAll(this);
    },
    getPropData(){

    },
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose(index,indexPath) {
      // console.log(index);
      // console.log(indexPath);
      // this.$refs.treeMenu.returnTitleIcon(this.menus);
    },
    handleselect: function(a, b) {},
    //修改密码
    resetPassWord:function() {
      this.$layer.iframe({
        content: {
          content: resetPasswordView, //传递的组件对象
          parent: this,//当前的vue对象
          data:{}
        },
        area:['340px','460px'],
        shadeClose: false, 
        title: '修改密码'
      });
    },
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          _this.$cacheUtil.clearCache();
          // sessionStorage.removeItem("user");
           _this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
  },
  computed: {
		// 当前 tab 项的 name
		currentTabIndex () {
			return this.$store.getters.GetCurrentTabIndex
		},
		// 打开的页签列表
		openedTabs () {
			// console.log(this.$store.getters.GetOpenedTabs)
			return this.$store.getters.GetOpenedTabs
		},
    // 主页 tab 的 menuId
    homeTabMenuId () {
			return this.$store.getters.GetHomeTabMenuId
    },
    user(){
      return this.$cacheUtil.getUser();
    }
  },
  created () {
			this.$tab.reShow()
			//this.initializeMemu()
    },
    watch:{
      // openedTabs(val){
      //   console.log(val);
      // }
    },
  mounted() {
    this.menus = permission.getPermissionRote(this.$router.options.routes);
    //右键菜单指定挂接位置
    var nav = this.$refs.tabs.$refs.nav;
    var el = nav.$el,vnode = nav.$vnode;
    const contextmenu = this.$refs.contextmenu;
    contextmenu.addRef({ el, vnode })
    contextmenu.$contextmenuId = el.id || contextmenu._uid;
  }
};
</script>

<style lang="scss">
//<style scoped lang="scss">
 @import "../styles/home.scss";
</style>
