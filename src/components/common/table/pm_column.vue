<!-- ElTableColumnPro.vue -->
<!-- label-class-name="mytitle" -->
<template>
  <el-table-column
    :sortable="tableConfig.sortable && sortable"
    v-if="realVisible"
    :formatter="formatter"
    align="left"
    header-align="left"
    :prop="prop"
    :render-header="renderHeader"
    footer-align="left"
    :label="label"
    :width="maxWidth"
    show-overflow-tooltip
    resizable
  >
    <!-- realAlign -->
    <template slot-scope="scope">
      <slot :row="scope.row" :$index="scope.$index">
        <pm_col_content ref="pmCol"
          :editControl="editControl"
          :calcEditControl="calcEditControl"
          v-bind:row.sync="scope.row"
          v-bind:tableConfig.sync="tableConfig"
          :canEdit="canEdit"
          :cellCanEdit="cellCanEdit"
          :prop="prop"
          :required="required"
          :parentPropName="parentPropName"
          :childPropName="childPropName"
          :dataTree="stackDicTree"
          :min="min"
          :max="max"
          :getDisplayText="getDisplayText"
          :placeholder="placeholder"
          :change="tableConfig.change"
          :notifyColWidthChange="notifyColWidthChange"
          :watchField="watchField"
          :pk="scope.$index"
        />
      </slot>
    </template>
  </el-table-column>
</template>
 
<script>
import componentUtil from "@/common/utils/ComponentUtil";
import commonUtil from "@/common/utils/CommonUtils";
import filterExtend from "@/common/utils/FilterExtend";
import pm_treeSelect from "@/components/common/treeSelect/pm_treeSelect";
import cacheUtil from "@/common/utils/CacheUtil";
import pm_col_content from "./pm_col_content";
import { debug } from "util";
export default {
  name: "pm_column",
  mixins: [filterExtend],
  components: {
    pm_treeSelect,
    pm_col_content
  },
  props: {
    prop: { type: String }, //字段名
    required: { type: Boolean, default: false }, //是否必填
    sortable: { type: Boolean, default: true }, //是否允许排序
    label: { type: String }, //中文名
    width: { type: String }, //宽度
    summary: { type: Boolean, default: false }, //是否添加合计列
    min: { type: Number, default: 0 },
    max: { type: Number, default: Number.MAX_SAFE_INTEGER },
    step: { type: Number, default: 1 }, //步长
    parentPropName: {
      type: String,
      default: "whsRoomId"
    },
    childPropName: {
      type: String,
      default: "whsAreaId"
    },
    type: String, //特殊控件类型
    placeholder: { type: String },
    rederWidth: { type: String, default: "230px" },
    param: { type: String, default: "" },
    startDate: { type: String },
    endDate: { type: String },
    selectList: { type: Array },
    isClear: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    filterIcon: { type: String, default: "el-icon-search" },
    callback: { type: Function },
    watchField: String, //监听字段
    remoteSearch: Function, //远程查询
    canEdit: { type: Boolean, default: true }, //列是否可编辑
    cellCanEdit: Function, //是否可编辑
    formatter: {
      type: Function,
      default: (row, column, cellValue) => cellValue
    },
    align: { type: String },
    dicCache: Object //字典项缓存，用于转换时提升性能
  },
  data() {
    return {
      tableConfig: {
        entity: {},
        allowEdit: false,
        sortable: true,
        change: null,
        rowCanEdit: function(obj) {
          return true;
        }
      },
      stackDicTree: [],
      useConfig: Object,
      controlType: componentUtil.controlType,
      formatD: this.filterIcon,
      editControl: {},
      realAlign: {},
      viewport: null,
      maxWidth: null,
      realVisible:true,
    };
  },
  // computed: {
  //   editControl(){
  //     return this.calcEditControl(null,null);
  //   },
  //   realAlign(){
  //     return this.getRealAlign();
  //   }
  // },
  created() {
    this.realVisible = this.visible;
    //计算属性值
    this.tableConfig = {
      ...this.tableConfig,
      ...this.$parent.$parent.useConfig
    };
    this.useConfig = this.$parent.$parent.useConfig;
    this.editControl = this.calcEditControl(null, null);
    this.realAlign = this.getRealAlign();
    //配置为自动适配列，则计算宽度
    if (!this.tableConfig.autofit) {
      this.maxWidth = this.width;
    } else if(this.label && this.label.length > 0){
      this.maxWidth = this.label.length * 18 + 40;
    }
  },
  watch: {
    useConfig: {
      handler: function(val, oldval) {
        this.tableConfig = {
          ...this.tableConfig,
          ...this.$parent.$parent.useConfig
        };
      },
      deep: true
    }
  },
  methods: {
    setVisible(visible){
      this.realVisible = visible;
    },
    setWidth(width){
      this.maxWidth = width;
    },
    /**
     * 通知table列宽发生改变
     */
    notifyColWidthChange(newWidth) {
      if(!this.tableConfig.autofit) return;
      //允许动态计算的最大宽度为每列300像素
      if( newWidth>300 ) return;
      if (newWidth > this.maxWidth) {
        this.maxWidth = newWidth;
      }
    },
    /**
     * 获取真实的靠齐方式
     */
    getRealAlign() {
      if (this.align != null) return this.align;
      return componentUtil.getPropAlign(this.tableConfig.entity, this.prop);
    },
    /**
     * 获取关联数据
     */
    getRelaData: function(row, callback) {
      if (this.remoteSearch) {
        this.remoteSearch(row, callback);
        return;
      }
      if (this.watchField == "brandId") {
        commonUtil.getBrandInfo(
          row.brandId,
          callback,
          this.tableConfig.dicCache
        );
        return;
      }
      if (this.watchField == "regularType" || this.watchField == "costType") {
        if (row.regularType == 1 || row.costType == 1) {
          this.$set(row, "regularUnit", 1);
        } else {
          this.$set(row, "regularUnit", 2);
        }
        return;
      }
    },
    //将一维的扁平数组转换为多层级对象
    getTreeDataSource(data) {
      const fa = parentId => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n["parentId"] === parentId) {
            n.children = fa(n.id);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(0);
    },
    /**
     * 获取转换信息
     */
    getDisplayText: function(col, prop) {
      //return col[prop];
      //如果是库位控件，则通过特殊方法做显示处理
      if (prop == "whsCalcStackId" || this.type == "stackSelect") {
        var val = componentUtil.getStackName(
          this.tableConfig.dicCache,
          col,
          this.parentPropName,
          this.childPropName
        );
        col[prop] = val;
        //this.$set会引起性能问题
        //this.$set(col,prop,val);
        col[prop + "_display"] = val;
        return val;
      }
      var displayText = componentUtil.getDisplayText(
        this.tableConfig.entity,
        prop,
        col[prop],
        this.tableConfig.dicCache,
        col
      );
      col[prop + "_display"] = displayText;
      return displayText;
    },
    /**
     * 计算编辑控件信息
     */
    calcEditControl: function(row, callback) {
      if (this.prop == "whsCalcStackId" || this.type == "stackSelect") {
        let config = {
          type: "stackSelect"
        };
        let dataList = this.tableConfig.dicCache[
          "DicWhsCalcStackName"
        ].list.map(node => {
          return node.model;
        });
        this.stackDicTree = this.getTreeDataSource(dataList);
        return config;
      }
      var config = componentUtil.getEditControl(
        this.tableConfig.entity,
        this.prop
      );
      //有监听字段，则需要重新获取数据源
      if (row && this.watchField) {
        this.getRelaData(row, function(data) {
          config.dataSource = data;
          if (callback) {
            callback(config);
          }
        });
      } else {
        if (config.getDataSource) {
          config.dataSource = config.getDataSource(this.tableConfig.dicCache);
          //数据源key值处理
          var key = config.key;
          config.dataSource.forEach(item => {
            if (typeof item[key] == "number") return;
            item[key] = filterExtend.filters.toInt(item[key]);
          });
          if (callback) {
            callback(config);
          }
        }
      }
      return config;
    },
    fomatMethod(value) {
      return this.formatter("", "", value);
    },
    /**
     * 渲染表头
     */
    renderHeader: function(h, { column, $index }) {
      if (!this.required) return column.label;
      //i.innerHtml = "*";
      // return h(
      //     'span',
      //     [
      //       h('span', {
      //         class: "important-icon",
      //       },column.label),
      //     ],
      //   );
      return h(
        "span",
        {
          class: "important-icon"
        },
        column.label
      );
    }
  }
};
</script>
<style>
.important-icon::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
th .mytitle {
  text-align: left !important;
}
</style>
