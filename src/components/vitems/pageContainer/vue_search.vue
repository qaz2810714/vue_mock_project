<template>
  <div class="searchEl">
    <!-- 遍历行 -->
    <template v-for="(row, idx) in rows">
      <el-row v-if="row" :key="idx">
        <!-- 遍历列 -->
        <template v-for="field in row">
        <el-col
          v-if="field"
          :key="field.name"
          :span="field.span"
          :offset="field.colOffset">
          <vue_search_item :entity="entity" :dicCache="dicCache" :field="field" v-if="field.xtype != 'btn'"></vue_search_item>
          <slot v-if="field.xtype == 'btn' && hasBtnGroup"></slot>
        </el-col>
        </template>
      </el-row>
    </template>
  </div>
</template>

<script scoped>
import CommonUtils from "@/common/utils/CommonUtils";
import cacheUtil from "@/common/utils/CacheUtil";
import vueSearchItem from "./vue_search_item";
import SearchSelectButton from "@/components/common/button/SearchSelectButton";
import componentUtil from "../../../common/utils/ComponentUtil";
import filterExtend from "../../../common/utils/FilterExtend";
import {
  Row,
  Col
} from "element-ui";
export default {
  xtype: {
    text: "text",
    number: "number",
    date: "date",
    daterange: "daterange",
    datetime: "datetime",
    datetimerange: "datetimerange",
    select: "select",
    select_batch: "select_batch",
    search_select_input: "search_select_input",
    textarea: "textarea",
    btn:"btn"
  },
  components: {
    "el-row": Row,
    "el-col": Col,
    "vue_search_item": vueSearchItem,
    SearchSelectButton: SearchSelectButton
  },
  props: {
    entity: Object,
    fields: {
      type: Array,
      default: []
    },
    hasBtnGroup: {
      //是否有按钮组
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {
          label_align: "left",
          col_width: 3
        };
      }
    }
  },
  computed: {
    //获取编辑控件的类型信息
    rows: function() {
      var rs = [];
      var unLocFields = [];
      this.fields.forEach(function(field) {
        // 当前搜索条件字段是否有正确的自定义排版设置
        var customerLoc = false;
        // 当前搜索条件字段排版位置信息
        var locs;
        if (
          field.searchLoc !== null &&
          field.searchLoc !== undefined &&
          field.searchLoc !== "" &&
          typeof field.searchLoc == "string"
        ) {
          locs = field.searchLoc.split("-");
          if (locs.length === 5) {
            // (1)行号、(2)列号、(3)控件整体宽度/24、(4)控件内Label占宽度/24 (5)和前一个控件的距离
            if (
              parseInt(locs[0]) > 0 &&
              parseInt(locs[1]) > 0 &&
              parseInt(locs[2]) > 0 &&
              parseInt(locs[2]) <= 24 &&
              parseInt(locs[3]) > 0 &&
              parseInt(locs[3]) < 24
            ) {
              customerLoc = true;
              field.span = parseInt(locs[2]);
              field.labelSpan = parseInt(locs[3]);
              field.inputSpan = 24 - parseInt(locs[3]);
              field.colOffset = parseInt(locs[4]);
            }
          }
        }
        if (customerLoc) {
          var rowNum = parseInt(locs[0]),
            colNum = parseInt(locs[1]);
          if (!rs[rowNum]) {
            rs[rowNum] = [];
          }
          rs[rowNum][colNum] = field;
        } else {
          unLocFields.push(field);
        }
      });
      return rs;
    }
  },
  methods: {
    getSearchParam() {
      //获取整个搜索区域控件的value值封装成map 转化成对象反给父组件
      var returnMap = new Map();
      this.fields.forEach(element => {
        var value = element.value;
        if(value==null) return;
        if (element.xtype == "btn_search") {
          //按钮类型不返回value
          return;
        }
        if (element.xtype == "select_batch" && element.value.length <= 0) {
          //多选框值为空时不返回value
          return;
        }

        if (
          element.value &&
          element.xtype == "textarea" &&
          element.fieldName == "fPackNo"
        ) {
          //捆包号批量查询框用换行符切割成捆包数组
          value = value.split(/[\n]/);
        }
        if(element.xtype=='datetimerange' || element.xtype=='daterange'){
          //如果是时间范围类型的控件修改取值方式
          if(value != null){
            if(element.dateBegin && element.dateEnd){
              returnMap.set(element.dateBegin, value[0]);
              returnMap.set(element.dateEnd, value[1]);
            }else{
              returnMap.set(element.fieldName + 'Begin', value[0]);
              returnMap.set(element.fieldName + 'End', value[1]);
            }
          }
        }else if(element.xtype=='tree_select'){
          //如果是树形选择控件 修改取值方式
          if(value != null){
            if(!element.extQuryParam){
              element.extQuryParam = {
                whsRoomId:'whsRoomId',
                whsAreaId:'whsAreaId'
              }
            }
            for(var item in element.extQuryParam){
                returnMap.set(element.extQuryParam[item],value[item]);
            }
          }
        }else{
          if (value != null) {
            returnMap.set(element.fieldName, value);
          }
        } 
      });
      var returnObj = CommonUtils.strMapToObj(returnMap);
      return returnObj;
    },
    resetAllValue() {
      //重置(禁用的过滤条件，认为是默认搜索条件，不允许重置)
      this.fields.filter(f=>!f.disabled).forEach(element => {
        if(element.value != null){
          if(element.xtype == 'tree_select'){
            element.value = {}
          }else if(element.xtype == 'select_batch'){
             element.value = [];
          }else if(element.xtype == 'radio'){
            element.value=0;
          }
          else{
            element.value = undefined;
          }
        }
      });
    }
  },
  created() {
    this.$cacheUtil.addTableListener(this.notifyObj);
  },
  destroyed(){
    this.$cacheUtil.removeTableListener(this.notifyObj);
  },
  data() {
    return {
      brands: [],
      textures: [],
      producings: [],
      dicCache: cacheUtil.getDic(),
      notifyObj:{
        win:this,
        callback:(cache,win)=>{
          win.dicCache = cache;
        }
      }
    };
  }
};
</script>

<style scoped>
.searchEl {
  // margin-bottom: 5px;
}
.el-row {
  margin-bottom: 5px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.labelCss {
  height: 28px;
  line-height: 28px;
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
