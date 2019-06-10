<template>
  <el-menu
    class="el-menu-vertical-demo"
    unique-opened @open="getInfo" @close="getInfo">
    <pm_tree_item
    :showField="showField"
    :keyField="keyField"
    :clickFunc="getInfo"
    :menus="dicClassList">
    </pm_tree_item>
  </el-menu>
</template>


<script>
import pm_tree_item from "./pm_tree_item";
export default {
  components: { pm_tree_item },
  data: function() {
    return {
    };
  },
  props: {
    showField: {
      type: String,
      require: true
    },
    keyField: {
      type: String,
      require: true
    },
    getInfo:Function,
    dicClassList:Array,
  },
  methods: {
  }
};
</script>
