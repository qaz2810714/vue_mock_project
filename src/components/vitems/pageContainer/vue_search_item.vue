<template>
 <el-row>
    <!-- 标签区域 -->
    <el-col :span="field.labelSpan" style="text-align:end;">
        <span v-if="field.xtype != 'btn'" class="labelCss">{{field.displayName}}&nbsp;&nbsp;</span>
        <span
        v-if="field.xtype == 'btn'"
        class="labelCss"
        style="margin-left:.5rem"
        >{{field.displayName}}</span>
    </el-col>

    <!-- 控件区域 -->
    <el-col :span="field.inputSpan">
        <!-- 文本 -->
        <el-input v-if="field.xtype == 'text'" size="mini" :disabled="disabled" v-model.trim="field.value" clearable></el-input>
        <!-- 数值 -->
        <el-input-number
        v-if="field.xtype == 'number'"
        size="mini"
        clearable
        v-model="field.value"
        :disabled="disabled"
        :precision="precision"
        :min="field.min"
        :max="field.max"
        ></el-input-number>
        <!-- 数值范围 -->
        <!-- 日期 -->
        <el-date-picker
        v-if="field.xtype == 'date'"
        size="mini"
        v-model="field.value"
        :disabled="disabled"
        type="date"
        ></el-date-picker>
        <!-- 日期范围 -->
        <el-date-picker
        v-if="field.xtype == 'daterange'"
        size="mini"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        v-model="field.value"
        :disabled="disabled"
        type="daterange"
        ></el-date-picker>
        <!-- 日期时间 -->
        <el-date-picker
        v-if="field.xtype == 'datetime'"
        size="mini"
        v-model="field.value"
        :disabled="disabled"
        type="datetime"
        ></el-date-picker>
        <!-- 日期时间范围 -->
        <el-date-picker
        v-if="field.xtype == 'datetimerange'"
        size="mini"
        v-model="field.value"
        :disabled="disabled"
        type="datetimerange"
        ></el-date-picker>
        <!-- 单选下拉 -->
        <el-select
        v-if="field.xtype == 'select'"
        filterable
        size="mini"
        clearable
        v-model="field.value"
        :disabled="disabled"
        placeholder="请选择"
        >
        <el-option
              v-for="(item) in editControl.dataSource"
              :key="item[editControl.key]"
              :label="item[editControl.value]"
              :value="item[editControl.key]"
            ></el-option>
        </el-select>
        <!-- 多选下拉 -->
        <el-select
        v-if="field.xtype == 'select_batch'"
        size="mini"
        clearable
        multiple
        v-model="field.value"
        :disabled="disabled"
        placeholder="请选择"
        >
        <el-option
          v-for="(item) in editControl.dataSource"
          :key="item[editControl.key]"
          :label="item[editControl.value]"
          :value="item[editControl.key]">
        </el-option>
        </el-select>

        <!-- 高级搜索控件 -->
        <!-- <SearchSelectButton v-if="field.xtype == 'search_select_input'" :field="field"></SearchSelectButton> -->
        <!-- textarea -->
        <el-input
        v-if="field.xtype == 'textarea'"
        size="mini"
        clearable
        type="textarea"
        :rows="rows"
        :autosize="{minRows:1,maxRows: 1}"
        placeholder="请输入内容"
        v-model.trim="field.value"
        :disabled="disabled"
        ></el-input>
        <pm_search_select v-if="field.xtype == 'search_select_input'" :fieldName="field.fieldName" :config='editControl' :dicCache="dicCache" v-model="field.value" :disabled="disabled"></pm_search_select>
        <pm_treeSelect v-if="field.xtype == 'tree_select'" width="100%" height="200" :canClickParent="true" :dataTree="treeDataSource" v-model="field.value" :disabled="disabled"></pm_treeSelect>

        <pm_radio v-if="field.xtype == 'radio'" :menu="field.group" :bindData="field.value" :able="disabled" v-model="field.value"></pm_radio>
    </el-col>
    </el-row>
</template>

<script scoped>
import CommonUtils from "@/common/utils/CommonUtils";
import cacheUtil from "@/common/utils/CacheUtil";
import SearchSelectButton from "@/components/common/button/SearchSelectButton";
import componentUtil from "../../../common/utils/ComponentUtil";
import filterExtend from "../../../common/utils/FilterExtend";
import pm_search_select from '@/components/common/select/pm_search_select';
import pm_treeSelect from '@/components/common/treeSelect/pm_treeSelect';
import pm_radio from '@/components/common/radio/pm_radio';
import {
  Row,
  Col,
  FormItem,
  Form,
  DatePicker,
  InputNumber,
  TimePicker,
  TimeSelect,
  Input,
  Select,
  Option
} from "element-ui";
export default {
  components: {
    "el-row": Row,
    "el-col": Col,
    "el-date-picker": DatePicker,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-input": Input,
    "el-input-number": InputNumber,
    "el-select": Select,
    "el-option": Option,
    SearchSelectButton: SearchSelectButton,
    pm_search_select: pm_search_select,
    pm_treeSelect:pm_treeSelect,
    pm_radio:pm_radio
  },
  props: {
    entity:Object,
    dicCache:Object,
    field: {
      type: Object,
      default: {
      }
    },
    options: {
      type: Object,
      default() {
        return {
          label_align: "left",
          col_width: 3
        };
      }
    },
  },
  watch:{
    newValue(val, oldVal){
      //监听值发生改变，则重新计算配置信息
      this.calcConfig(val);
    },
  },
  computed: {
    // editControl : function(){
    //    return this.getCtrlConfig();
    // },
    newValue(){
      //找到需要监听的控件属性
      if(this.field.watchField){
        //设置属性set get方法
        if(!this.$parent.$parent.$parent.fields.filter(item => item.fieldName === this.field.watchField)[0].value){
          this.$set(this.$parent.$parent.$parent.fields.filter(item => item.fieldName === this.field.watchField)[0],'value',null);
        }
        return this.$parent.$parent.$parent.fields.filter(item => item.fieldName === this.field.watchField)[0].value;
      }
    },
    disabled(){
      return this.field.disabled;
    },
    precision(){
      if(this.field.precision == null){return 3;}
      return this.field.precision;
    },
    rows(){
      if(this.field.rows == null){return 2;}
      return this.field.rows;
    }
  },
  created(){
     this.initFieldValue();
     this.editControl = this.getCtrlConfig();
     this.$cacheUtil.addColumnListener(this.notifyObj);
  },
  destroyed(){
    this.$cacheUtil.removeColumnListener(this.notifyObj);
  },
  mounted(){
      //  this.initFieldValue();
  },
  methods: {
    calcConfig:function(val){
      //关联控件过滤数据源
      this.editControl = this.getCtrlConfig(val);
      this.$commonUtil.getBrandInfo(val,data=>{
        this.editControl.dataSource = data;  
      });
    },
    initFieldValue(){
       if(this.field.xtype == 'tree_select'){
          let dataList = cacheUtil.getDic()["DicWhsCalcStackName"].list.map(node=>{return node.model});
          this.treeDataSource = this.getTreeDataSource(dataList.filter(data => data.deleteFlag == false));
       }
       
      if(this.field.xtype == 'daterange' || this.field.xtype == 'datetimerange'){
        if(this.field.timeDefault){
          this.$set(this.field,'value',this.field.timeDefault);
        }else{
          this.$set(this.field,'value',[new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
            new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)]);
        }
      }
    },
    //将一维的扁平数组转换为多层级对象
    getTreeDataSource(data){
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n['parentId'] === parentId) {
            n.children = fa(n.id);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(0);
    },
    getCtrlConfig(keyFilter){
      if(this.field.xtype=='select' || this.field.xtype=='select_batch' || this.field.xtype=='search_select_input'){
        var config = componentUtil.getEditControl(
          this.entity,this.field.fieldName
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
        return config;
      }else{
        return null;
      }
    }
  },
  data() {
    return {
      brands: [],
      textures: [],
      producings: [],
      config:{},
      editControl:{},
      notifyObj:{
        win:this,
        callback:(cache,win)=>{
          win.editControl = win.getCtrlConfig();
        }
      }
    };
  }
};
</script>
<style scoped>
.searchEl {
  margin-bottom: 0px;
}
.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.labelCss {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}
.el-input-number--mini {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-input-number--mini .el-input-number__decrease,
.el-input-number--mini .el-input-number__increase {
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
}
/* 解决bootstrap的样式对element组建的影响 */
select,
textarea,
input[type="text"],
input[type="password"],
input[type="datetime"],
input[type="datetime-local"],
input[type="date"],
input[type="month"],
input[type="time"],
input[type="week"],
input[type="number"],
input[type="email"],
input[type="url"],
input[type="search"],
input[type="tel"],
input[type="color"] {
  margin-bottom: 0px;
}
</style>

s