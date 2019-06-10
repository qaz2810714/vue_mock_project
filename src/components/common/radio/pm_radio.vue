<template>
  <el-radio-group :disabled="able" v-model="selectInfo" @change="changeHandler">
    <el-radio v-for="item in menu" :key='item.key' :label="item.key" :value="item.key">{{item.value}}</el-radio>     
  </el-radio-group>
</template>

<script>
import {RadioGroup,Radio} from 'element-ui';
import componentUtil from "../../../common/utils/ComponentUtil";
import filterExtend from '@/common/utils/FilterExtend'
import Vue from 'vue';
  export default {
    components: {
      'el-radio-group': RadioGroup,
      'el-radio':Radio
        },
    props: {
        menu: {
          type: Array
        },
        able:{
          type:Boolean,
          default:false,
        },
        bindData: {
          type: Number
        },
        changeFunc:Function,
    },
    data () {
      return { 
        selectInfo: undefined,
      };
    },
    //自定义v-model双向绑定
    model: {
      prop: "bindData",
      event: "bindEvent"
    },
    watch: {
      selectInfo: function() {
        this.$emit("bindEvent", this.selectInfo);
      },
      bindData:function(){
        this.setDefaultValue();
      }
    },
    methods: {
      changeHandler:function(val){
      if(this.changeFunc){
        this.changeFunc(val);
      }
    },
    setDefaultValue(){
      if(this.bindData===undefined){
        //没有匹配的数据源 则置空
        this.selectInfo = 1;
      }else{
        this.selectInfo = this.bindData;
      }
    },
  },
  mounted(){
    //  this.getCtrlConfig();
    //  this.setDefaultValue();
  },
  created(){
    this.setDefaultValue();
  }
  }
</script>