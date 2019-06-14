<template>
  <div style="width:100%" :class="tableCls">
    <el-table
      size="mini"
      ref="multipleTable"
      :data="dataSource"
      :show-summary="useConfig.showSummary"
      :summary-method="getSummaries"
      :height="tableHeight"
      :border="true"
      highlight-current-row
      @current-change="handleCurrentChange"
      @row-dblclick="handleRowDblClick"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand" v-if="useConfig.expand">
      </el-table-column>
      <el-table-column align="center" type="index" label="序号" fixed :index="indexMethod"></el-table-column>
      <el-table-column type="selection" v-if="useConfig.multiple"></el-table-column>
      <slot></slot>
    </el-table>
    <v-contextmenu ref="pmContextMenu">
      <v-contextmenu-item @click="openColSetting">
        <i class="pm-font pm-icon-xitongguanli"></i>列设置
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>
<script>
import pm_column from "@/components/common/table/pm_column";
import metadata from "@/common/entities/Metadata";
import convertMetadata from "@/common/entities/ConvertMetadata";
import componentUtil from "@/common/utils/ComponentUtil";
import cacheUtil from "@/common/utils/CacheUtil";
import pm_col_setting from "./pm_col_setting";
import { setTimeout } from "timers";
import { StringDecoder } from "string_decoder";
import { debug } from "util";
var tableSettingkey = "DicVisibelCols";
export default {
  name: "pm_table",
  components: { pm_column },
  props: {
    rightClick: {
      type:Boolean,
      default:false
    },
    dataSource: Array,
    bottomHeight: {
      type: Number,
      default: 164
    }, //table下部的高度
    config: {
      type: Object,
      default: function() {
        return {
          entity: {}, //对应的后台实体
          allowEdit: false, // 允许编辑
          showSummary: true, //默认值为 true
          multiple: false, //允许多选
          sortable: true, //字段可排序
          height: 200, //默认高度
          extendConfig: null, //扩展列表配置[{prop:"",label:""}]
          dbclick: null,
          change:null,//值改变事件
        };
      }
    },
  },
  computed: {
    allowEdit() {
      return this.config.allowEdit;
    },
    tableCls() {
      return this.config.allowEdit ? "pmtable pmtable28" : "pmtable pmtable23";
    },
  },
  mounted() {
    //初始化右键菜单
    this.initContextMenu();
    //TODO:设置首行选中
    // if(this.dataSource !=null && this.dataSource.length>0){
    //   this.$refs["multipleTable"].setCurrentRow(this.dataSource[0]);
    // }
    this.getTableHeight(this);
    const that = this;
    window.onresize = () => {
      return (() => {
        that.getTableHeight(that);
      })();
    };
    //this.tableHeight = this.useConfig.height;
  },
  watch: {
    allowEdit: {
      handler: function(val, oldval) {
        this.useConfig = this.calcConfig();
      },
      deep: true
    },
  },
  data() {
    return {
      selectedRows: [],
      sortCols: [],
      useConfig: {},
      tableHeight: 200,
    };
  },
  created() {
    this.useConfig = this.calcConfig();
  },
  methods: {
    //------------------------------------------------
    /**
     * 初始化右键菜单
     */
    initContextMenu() {
      //不包含reload方法，则不用启用右键菜单
      if(!this.rightClick) return;
      //右键菜单指定挂接位置
      var tableHead = this.$refs.multipleTable.$refs.tableHeader;
      var el = tableHead.$el,
        vnode = tableHead.$vnode;
      const contextmenu = this.$refs.pmContextMenu;
      contextmenu.addRef({ el, vnode });
      contextmenu.$contextmenuId = el.id || contextmenu._uid;
    },
    //打开列设置功能
    openColSetting() {
      var $this = this;
      var cols = this.getTableCols()
        .filter(a => a.componentOptions && a.componentOptions.propsData)
        .map(a => a.componentOptions.propsData);
      // this.$layer.iframe({
      //   content: {
      //     content: pm_col_setting, //传递的组件对象
      //     parent: this, //当前的vue对象
      //     data: {
      //       btnSave: this.saveSetting,
      //       tableKey: this.tableKey,
      //       items: JSON.stringify(cols) //过滤条件
      //     } //props
      //   },
      //   area: ["600px", "600px"],
      //   shadeClose: false,
      //   title: "列设置"
      // });
    },
    
    /**
     * 获取table高度
     */
    getTableHeight: function(obj) {
      var height = 0;
      setTimeout(function() {
        //layer弹出层
        var table = obj.$refs.multipleTable;
        if (table == null) return;
        var $el = table.$el;
        if (
          $el.offsetParent != null &&
          $el.offsetParent.classList.contains("vl-notify-iframe")
        ) {
          height = $el.offsetParent.offsetHeight;
        } else {
          height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        }
        var temp = height - $el.offsetTop - obj.bottomHeight;
        obj.tableHeight = temp > 200 ? temp : 200;
      }, 300);
    },
    getRowKeyHandler: function(row) {
      return row.id;
    },
    /**
     * 
     */
    calcConfig: function() {
      return {
        ...{
          dicCache: cacheUtil.getDic(), //字典项缓存(用于性能提升)
          entity: {}, //对应的后台实体
          allowEdit: false, // 允许编辑
          multiple: false, //允许多选
          showSummary: true, //默认值为 true
          sortable: true, //字段可排序
          height: 200, //默认高度
          expand: false //扩展列表配置[{prop:"",label:""}]
        },
        ...this.config
      };
    },
    /**
     * 获取转换信息
     */
    getDisplayText: function(col, prop) {
      if (col == null) return null;
      var displayText = componentUtil.getDisplayText(
        this.useConfig.entity,
        prop,
        col[prop],
        this.useConfig.dicCache
      );
      return displayText;
    },
    /**
     * 索引计算方法
     */
    indexMethod(index) {
      return index + 1;
    },
    /**
     * 列单击事件
     */
    handleRowDblClick(row, event) {
      if (this.config.dbclick != null) {
        this.config.dbclick(row, event);
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleRowClick(row, coloumn, event) {
      //处理table多选行自动选中
      if (this.config.multiple) {
        this.toggleSelection([row]);
      }
    },
    toggleSelection(rows) {
      if (rows) {
        var $this = this;
        rows.forEach(row => {
          $this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    getTableInfo: function() {
      return this.dataSource;
    },
    //获取table所有列数据
    getTableCols() {
      var $table = this.$refs.multipleTable;
      var $columns = $table.$slots.default.filter(
        a => a.tag && a.tag.includes("pm_column")
      );
      return $columns;
    },
    toggleRowSelection: function(rows, selected) {
      var $this = this;
      rows.forEach(row => {
        $this.$refs.multipleTable.toggleRowSelection(row, selected);
      });
    },
    //获取选中行信息
    getSelectedRows: function() {
      return this.selectedRows;
    },
    getSelectedRow: function(){
      return this.currentRow;
    },
    //选中行返回
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    getRowInfo: function(rowIndex) {
      return this.dataSource[rowIndex];
    },
    /**
     * table的校验功能
     */
    validator: function() {
      var $columns = this.getTableCols();
      //解析校验规则
      var requiredList = $columns
        .filter(
          a =>
            a.componentOptions &&
            a.componentOptions.propsData &&
            a.componentOptions.propsData.required != null
        )
        .map(a => a.componentOptions.propsData);
      var data = this.dataSource;
      var index = 0;
      var msg = [];
      var isEmpty = val => {
        return val == null || val === "";
      };
      data.forEach(item => {
        index++;
        var rowMsg = [];
        //必填项校验
        requiredList.forEach(propConfig => {
          var prop = propConfig.prop;
          var label = propConfig.label;
          var val = item[prop];
          if (isEmpty(val)) {
            rowMsg.push(label + "为必填项，不能为空!");
          }
        });
        if (rowMsg.length > 0) {
          msg.push(
            "第" + index + "行&nbsp;" + rowMsg.join("&nbsp;&nbsp;&nbsp;")
          );
        }
      });
      if (msg.length > 0) {
        this.$commonUtil.valid.throwEx(msg.join("<br/>"));
      }
    },
    /**
     * 计算合计列
     */
    getSummaries(param) {
      const { columns, data } = param;
      var allData = data;
      const sums = [];
      var $this = this;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        //判断字段类型，对特殊字段进行合计操作
        if (
          $this.useConfig.entity == null ||
          $this.useConfig.entity.attrs == null
        )
          return;
        var propConfig = componentUtil.getPropConfig(
          $this.useConfig.entity,
          column.property
        );
        if (propConfig == null || !propConfig.summary) {
          sums[index] = "";
          return;
        }
        var len = componentUtil.getPropPrecision(
          $this.useConfig.entity,
          column.property
        );
        if (len == null) {
          sums[index] = "";
          return;
        }
        const values = allData.map(item => Number(item[column.property]));
        sums[index] = values
          .reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + value;
            } else {
              return prev;
            }
          }, 0)
          .toFixed(len);
      });
      return sums;
    }
  }
};
</script>
<style scoped>
.cell-edit-input .el-input,
.el-input__inner {
  width: 100px;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.expand-menu {
  font-style: italic !important;
}
</style>
<style lang="scss">
.el-table__expanded-cell[class*="cell"] {
  padding: 10px 50px !important;
  background: floralwhite !important;
}
.demo-table-expand {
  font-size: 0;
  .el-form-item__label {
    line-height: 30px;
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item {
    margin-right: 40px;
    margin-bottom: 0;
  }
  label {
    color: darkgray !important;
  }
}
/* .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
} */
.pmtable23 {
  .el-table__body-wrapper .cell {
    height: 23px;
  }
  .el-table__fixed-body-wrapper .cell {
    height: 23px;
  }
}
.pmtable28 {
  .el-table__body-wrapper .cell {
    height: 28px;
  }
  .el-table__fixed-body-wrapper .cell {
    height: 28px;
  }
  .el-table--mini td {
    padding: 4px 0;
  }
}

.pmtable.pmtable28 .el-table__body tr.current-row td {
  background-color: transparent;
  color: #606266;
}
.pmtable.pmtable28 .el-table__body tr.hover-row {
  td,
  td {
    background-color: #ecf5ff;
  }
}
.pmtable .el-table__body tr.current-row td {
  /* slateblue */
  background-color: #5253ab;
  color: white;
}
.pmtable {
  .cell {
    line-height: 26px;
  }
  .caret-wrapper {
    height: 26px;
    .sort-caret.ascending {
      top: 1px;
    }
    .sort-caret.descending {
      bottom: 3px;
    }
  }
  .el-table__footer-wrapper {
    tbody td {
      color: #ed121b;
      font-weight: bold;
    }
  }
  .el-input-number--mini {
    width: 120px;
  }

  .el-table__column-resize-proxy {
    border-left: 1px solid #999;
  }
}
.pmtable .el-table__footer .cell {
  /* slateblue */
  font-weight: bold;
}
</style>
