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
      @header-dragend="handleHeaderDragend"
    >
      <el-table-column type="expand" v-if="useConfig.extendConfig">
        <template slot-scope="props">
          <span class="expand-menu">调整前数据</span>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item
              v-for="(item,index) in useConfig.extendConfig.props"
              :key="index"
              :label="item.label"
              class="myItem"
            >
              <span>{{ getDisplayText(props.row[useConfig.extendConfig.field],item.prop) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" type="index" label="序号" fixed :index="indexMethod"></el-table-column>
      <el-table-column type="selection" v-if="useConfig.multiple"></el-table-column>
      <slot></slot>
      <el-table-column min-width="20" v-if="config.autofit"></el-table-column>
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
    tableKey: String,
    reload: Function,
    dataSource: Array,
    totalData: Array,
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
          autofit: false, //是否为自动适配列
          extendConfig: null //扩展列表配置[{prop:"",label:""}]
        };
      }
    },
    dbclick: Function
  },
  computed: {
    allowEdit() {
      return this.config.allowEdit;
    },
    tableCls() {
      return this.config.allowEdit ? "pmtable pmtable28" : "pmtable pmtable23";
    },
    allowColSetting() {
      return this.tableKey;
    }
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
    //TODO:监控数据源改变，设置首行选中
    dataSource: {
      handler: function(val, oldval) {
        // if (val != null && val.length > 0) {
        //   this.$refs["multipleTable"].setCurrentRow(val[0]);
        // }
        if (this.allowColSetting) {
          this.calcTableCols();
        }
      },
      deep: true
    }
  },
  data() {
    return {
      selectedRows: [],
      sortCols: [],
      useConfig: {},
      tableHeight: 200,
      notifyObj: {
        win: this,
        callback: (cache, win) => {
          win.useConfig.dicCache = cache;
        }
      }
    };
  },
  created() {
    this.useConfig = this.calcConfig();
    this.$cacheUtil.addTableListener(this.notifyObj);
    if (this.allowColSetting) {
      //从缓存中取配置信息(默认值为[])
      var cacheCols = this.$cacheUtil.getCache(tableSettingkey) || {};
      var tableSetting = cacheCols[this.tableKey] || {};
      var cols = tableSetting.cols || [];
      this.calcTableCols(cols);
    }
  },
  destroyed() {
    this.$cacheUtil.removeTableListener(this.notifyObj);
  },
  methods: {
    //------------------------------------------------
    /**
     * 初始化右键菜单
     */
    initContextMenu() {
      if (!this.allowColSetting) return;
      //不包含reload方法，则不用启用右键菜单
      if (!this.reload) return;
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
      this.$layer.iframe({
        content: {
          content: pm_col_setting, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            btnSave: this.saveSetting,
            tableKey: this.tableKey,
            items: JSON.stringify(cols) //过滤条件
          } //props
        },
        area: ["600px", "600px"],
        shadeClose: false,
        title: "列设置"
      });
    },
    /**
     * 处理列宽改变
     */
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (!this.tableKey) return;
      var key = tableSettingkey;
      //将最新的宽度保存到缓存中
      var cacheCols = this.$cacheUtil.getCache(key) || {};
      var colSetting = cacheCols[this.tableKey] || {};
      var cols = colSetting.cols || [];
      //保存设置信息
      var col = cols.find(a => a.prop == column.property);
      if (col) {
        col.width = newWidth + "";
      } else {
        cols.push({
          prop: column.property,
          width: newWidth + "",
          label: column.label,
          hidden: false
        });
      }
      this.baseSaveSetting(cols);
    },
    //------------------------------------------------
    /**
     * 计算table的列信息
     */
    calcTableCols(cols) {
      if (cols) {
        //从缓存中读取该table的自定义设置
        this.sortCols = cols;
      }
      //调整table slots字段的顺序
      var columns = this.$slots.default.filter(a => a.tag);
      var newColumns = [];
      //按排好的顺序进行加载
      this.sortCols.forEach(sortCol => {
        var col = columns.find(
          a => a.componentOptions.propsData.prop == sortCol.prop
        );
        if (!col) return;
        if (sortCol.hidden) return;
        col.componentOptions.propsData.width = sortCol.width;
        newColumns.push(col);
      });
      //将columns中多出来的列添加进来
      var sortProps = this.sortCols.map(a => a.prop);
      var added = columns.filter(
        a => !sortProps.includes(a.componentOptions.propsData.prop)
      );
      newColumns = newColumns.concat(added);
      this.$slots.default = newColumns;
    },
    /**
     * 设置界面保存方法
     */
    saveSetting(cols, callback) {
      this.baseSaveSetting(cols, callback);
      //重新加载table控件
      this.reload(cols);
    },
    /**
     * 基础保存方法
     */
    baseSaveSetting(cols, callback) {
      var key = tableSettingkey;
      //1.数据保存到缓存+数据库中
      var tableKey = this.tableKey;
      // 1. 保存到缓存中
      var cacheCols = this.$cacheUtil.getCache(key) || {};
      if (cacheCols[tableKey] == null) {
        cacheCols[tableKey] = {};
      }
      cacheCols[tableKey].cols = cols;
      this.$cacheUtil.setCache(key, cacheCols);
      //2. 设置完成回调
      if (callback) {
        callback(cols);
      }
      // 3. 把配置信息保存到数据库
      var obj = cacheCols[tableKey];
      var obj = {
        id: obj.id,
        componentKey: this.tableKey,
        configJson: JSON.stringify(cols)
      };
      if (obj.id == null) {
        obj.userId = this.$cacheUtil.getUser().userId;
        obj.configType = "table";
        this.$httpUtil.post(
          "/userUiSetting/add",
          obj,
          data => {
            //新增成功 需要更新缓存
            cacheCols[tableKey].id = data.id;
            cacheCols[tableKey].configType = obj.configType;
            this.$cacheUtil.setCache(key, cacheCols);
          },
          false,
          false
        );
      } else {
        //修改
        this.$httpUtil.post(
          "/userUiSetting/update",
          obj,
          data => {
            //更新完成
          },
          false,
          false
        );
      }
    },
    /**
     * 更新数据源
     */
    updateDatasource: function(data) {
      //this.dataSource = data;
    },
    //------------------------------------------------
    /**
     * 更新数据
     */
    updateRow: function(callback) {
      if (this.dataSource != null && callback) {
        var $this = this;
        for (var i = 0; i < this.dataSource.length; i++) {
          var row = this.dataSource[i];
          callback(row, i);
          //定义双向绑定
          for (var p in row) {
            var temp = row[p];
            delete row[p];
            this.$set(row, p, temp);
          }
        }
      }
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
    calcConfig: function() {
      return {
        ...{
          dicCache: cacheUtil.getDic(), //字典项缓存(用于性能提升)
          entity: {}, //对应的后台实体
          allowEdit: false, // 允许编辑
          multiple: false, //允许多选
          showSummary: true, //默认值为 true
          sortable: true, //字段可排序
          autofit: false, //是否为自动适配
          height: 200, //默认高度
          extendConfig: null //扩展列表配置[{prop:"",label:""}]
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
    indexMethod(index) {
      return index + 1;
    },
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
            if (prop == "whsCalcStackId") {
              if (isEmpty(item.whsRoomId) && isEmpty(item.whsAreaId)) {
                rowMsg.push(label + "为必填项，不能为空!");
              }
              return;
            }
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
      var allData = this.totalData || data;
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
