<template>
  <div class="pm_search_select">
    <el-select filterable size="mini" :disabled='readOnly' clearable
    @change="changeHandler" v-model="selectInfo" placeholder="请选择">
      <div class='options'>
      <el-option v-for="item in dataSource" :key="item[selectConfig.key]" :label="item[selectConfig.value]" :value="item[selectConfig.key]">
        <div class="name">{{ item[selectConfig.value] }}</div>
        <span class="desc">{{ item[selectConfig.desc] }}</span>
      </el-option>
      </div>
    </el-select>
  </div>
</template>

<script>
import cacheUtil from "@/common/utils/CacheUtil";
import componentUtil from "../../../common/utils/ComponentUtil";
import filterExtend from '@/common/utils/FilterExtend'
export default {
  props: {
    fieldName: {
      type: String,
      default: "brandId"
    },
    bindData: {
      type: Number
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    config:{
      type:Object
    },
    changeFunc:Function,
    dicCache:null
  },
  //自定义v-model双向绑定
  model: {
    prop: "bindData",
    event: "bindEvent"
  },
  watch: {
    selectInfo: function() {
    },
    bindData:function(){
      this.setDefaultValue();
    }
  },
  computed:{
    selectConfig:function(){
       return this.getCtrlConfig();
    },
    dataSource(){
      if(this.config==null || this.config.dataSource ==null) return [];
      return this.config.dataSource;
    }
  },
  methods: {
    changeHandler:function(val){
      if(this.changeFunc){
        this.changeFunc(val);
      }
    },
    setDefaultValue(){
      //如果下拉有能通过ID匹配的数据则设ID
      if(this.bindData && this.dataSource.filter(data => data.id === this.bindData).length > 0){
        this.selectInfo = this.bindData;
      }
    },
    getCtrlConfig(){
      if(this.config && this.config.dataSource){
        return this.config;
      }else{
        var entity = this.$parent.$parent.$parent.$parent.$parent.$parent.entity;
        this.config = componentUtil.getEditControl(
          entity,this.fieldName
        );
        if (config.getDataSource) {
          config.dataSource = config.getDataSource(this.dicCache);
          //数据源key值处理
          var key = config.key;
          config.dataSource.forEach(item => {
            if (typeof item[key] == "number") return;
            item[key] = filterExtend.filters.toInt(item[key]);
          });
        }
        return this.config;
      }
    }
  },
  created() {
    // this.getCtrlConfig();
  },
  mounted(){
     this.getCtrlConfig();
     this.setDefaultValue();
  },
  data() {
    return {
      brands: [],
      textures: [],
      producings: [],
      users: [],
      selectInfo: undefined
    };
  }
};
</script>


<style>
.options .el-select-dropdown__item {
    line-height: normal;
    padding: 7px;
    height: 50px;
}

.el-select-dropdown__item .name {
      text-overflow: ellipsis;
      overflow: hidden;
      line-height:normal;
}
.el-select-dropdown__item .desc {
      font-size: 12px;
      color: #b4b4b4;
      line-height:normal;
}

.el-select-dropdown__item .highlighted .desc {
      color: #ddd;
}
.pm_search_select .el-select{
  width:100%;
}

.el-select-dropdown__list{
    padding-bottom: 15px;
}
</style>