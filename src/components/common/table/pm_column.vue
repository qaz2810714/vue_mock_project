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
    footer-align="left"
    :label="label"
    :width="width"
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
          :min="min"
          :max="max"
          :getDisplayText="getDisplayText"
          :placeholder="placeholder"
          :change="tableConfig.change"
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
    min: { type: Number, default: 0 },
    max: { type: Number, default: Number.MAX_SAFE_INTEGER },
    step: { type: Number, default: 1 }, //步长
    placeholder: { type: String },
    selectList: { type: Array },
    visible: { type: Boolean, default: true },
    callback: { type: Function },
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
     * 获取真实的靠齐方式
     */
    getRealAlign() {
      if (this.align != null) return this.align;
      return componentUtil.getPropAlign(this.tableConfig.entity, this.prop);
    },
    /**
     * 获取转换信息
     */
    getDisplayText: function(col, prop) {
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
      var config = componentUtil.getEditControl(
        this.tableConfig.entity,
        this.prop
      );
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
      return config;
    },
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
