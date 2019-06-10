<template>
  <div>
    <template v-for="item in menus">
      <el-submenu v-if="hasChild(item)" :key="item[keyField]" :index="JSON.stringify(item)" @click="clickFunc(item)">
        <template slot="title">
          <i :class="item.iconCls"></i>
          {{item.name}}
        </template>
        <pm_tree_item :showField="showField" :keyField="keyField" :clickFunc="clickFunc" :menus="item.children"></pm_tree_item>
      </el-submenu>
      <el-menu-item v-if="!hasChild(item)" :key="item[keyField]" :index="item[keyField]" @click="clickFunc(item)">{{item[showField]}}</el-menu-item>
    </template>
  </div>
</template>


<script>
export default {
  name: "pm_tree_item",
  data: function() {
    return {};
  },
  props: {
    menus: {
      type: Array
    },
    showField:{
      type:String,
      require:true
    },
    keyField:{
      type:String,
      require:true
    },
    clickFunc:Function
  },
  methods: {
    hasChild: function(item) {
      if (item.children) {
        if (item.children.length > 0) return true;
      }
      return false;
    },
  }
};
</script>
