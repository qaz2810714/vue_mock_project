<template>
<el-row class="tac" style="position:relation;height:92%;">
  <el-col :span="24" style="height:100%;">
    <h5 style="margin: 10px;">{{labelName}}</h5>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      >      
      <el-scrollbar :style="realStyle">
        <div v-for="item in data" :key="item[valueKey]" @click="classClick(item)">
          <el-menu-item :index="item[valueKey]">
            <i class="el-icon-news"></i>
            <span slot="title" >{{item[filedName]}}</span>
          </el-menu-item>
        </div>
      </el-scrollbar>
    </el-menu>
  </el-col>
</el-row>
</template>
<script>
import {Popover,Tree,Input} from 'element-ui';
import Vue from 'vue';
  export default {
    props:{
        //标题栏名称
        labelName:String,
        //数据源
        data:Array,
        menuStyle:String,
        //列表高度
        height:String,
        //显示字段名
        filedName:String,
        //关键值
        valueKey:String,
        //点击事件
        classClick:Function
    },
    data(){
        return{
            //list:this.data,
        }
    },
    computed: {
      realStyle(){
        if(this.menuStyle) return this.menuStyle;
        if(this.height) return `height:${this.height}px`;
        return '';
      }
    },
  }
</script>
<style>
  .el-scrollbar__wrap {
     /* overflow-x: hidden; */
     overflow:auto;
  }
</style>