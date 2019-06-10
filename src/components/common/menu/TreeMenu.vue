<template>
  <div>
    <template v-for="(item) in menus">
          <el-submenu v-if="show(item) && hasChild(item.children)" :key="item.path" :index="item.path">
              <template v-if="!item.hidden" slot="title">
                <div :key='item.path'>
                  <i :class="item.iconCls" :ref='item.path+0' style="display:inline-block"></i>
                  <i v-if="item.iconCls == 'el-icon-circle-plus-outline'" class="el-icon-remove-outline" :ref='item.path+1' style="display:none"></i> 
                  {{item.name}}
                </div>
              </template>
            <tree-menu :menus="item.children" ref="subMenu"></tree-menu>
          </el-submenu>
      <el-menu-item
        v-if="show(item) && !hasChild(item.children)"
        :key="item.path"
        :index="item.path"
        @click="openTab(item)"
      >{{item.name}}</el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "tree-menu",
  data: function() {
    return {
    };
  },
  props: {
    menus: {
      type: Array
    }
  },
  methods: {
    hasChild: function(children) {
      if (children) {
        if (children.length > 0) return true;
      }
      return false;
    },
    show: function(item) {
      if (item) {
        if (!item.hidden) return true;
      }
      return false;
    },
    // 打开 页签
    openTab(item) {
      this.$tab.open(item);
      this.initializeMemu(item);
    },
    initializeMemu(item) {
      this.menuList = item;
    },
  }
};
</script>

