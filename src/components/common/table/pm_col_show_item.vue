<template>
  <li class="list-item" :key="item.prop" @dblclick="setHide(item)">
    <el-row :gutter="20" style="width:100%;">
      <el-col :span="2" class="txt_label">
        <span>{{index+1}}</span>
      </el-col>
      <el-col :span="12" class="txt_label">
        <span>{{item.label}}</span>
      </el-col>
      <el-col :span="10">
        <el-input size="mini" v-model="item.width"/>
      </el-col>
    </el-row>
    <slot></slot>
  </li>
</template>
<script>
import { ElementMixin } from "vue-slicksort";
export default {
  name: "pm_col_show_item",
  mixins: [ElementMixin],
  props: {
    item: {},
    setHide: Function
  }
};
</script>
