<!-- ElTableColumnPro.vue -->
<template>
  <span ref="showContent" v-if="!realCanEdit">{{ displayText }}</span>
  <!-- 数字控件 -->
  <el-input-number
    size="mini"
    v-else-if="config.type == controlType.int
            || config.type == controlType.decimal"
    v-model="row[prop]"
    controls-position="right"
    :precision="precision"
    :key="itemKey"
    :min="min"
    :max="max"
    :step="step"
    @change="changeHandler"
    @blur="blurHandler"
  ></el-input-number>
  <vue-lazy-component v-else :viewport="viewport">
    <!-- <lazy-component v-else> -->
    <span class="cell-edit-input">
      <!-- 输入控件 -->
      <el-input
        size="mini"
        v-if="config.type == controlType.text"
        v-model.trim="row[prop]"
        :key="itemKey"
        :placeholder="placeholder"
        :minlength="min"
        :maxlength="max"
        @change="changeHandler"
        @blur="blurHandler"
      ></el-input>
      <!-- 日期控件 -->
      <el-date-picker
        size="mini"
        v-else-if="config.type == controlType.date || config.type == controlType.datetime"
        v-model="row[prop]"
        :key="itemKey"
        :type="config.type"
        @change="changeHandler"
        @blur="blurHandler"
      ></el-date-picker>

      <!-- 高级编辑控件 -->
      <el-select
        v-else-if="config.type == controlType.select || config.type == controlType.lookup"
        class="item-choose"
        filterable
        v-model="row[prop]"
        :value-key="config.key"
        :key="itemKey"
        size="mini"
        @change="changeHandler"
        @blur="blurHandler"
      >
        <el-option
          v-for="(item,index) in config.dataSource"
          :key="index"
          :label="item[config.value]"
          :value="item[config.key]"
        ></el-option>
      </el-select>
    </span>
    <!-- </lazy-component> -->
  </vue-lazy-component>
</template>
 
<script>
import componentUtil from "../../../common/utils/ComponentUtil";
import filterExtend from "../../../common/utils/FilterExtend";
export default {
  name: "pm_col_content",
  mixins: [filterExtend],
  props: {
    editControl: Object,
    row: Object,
    pk: Number,
    blur:Function,
    tableConfig: Object,
    cellCanEdit: Function,
    canEdit: true,
    prop: String,
    required: { type: Boolean, default: false }, //是否必填
    getDisplayText: Function,
    change: Function, //值选中事件
    calcEditControl: Function, //计算编辑属性
    placeholder: String,
    min: { type: Number, default: 0 },
    max: { type: Number, default: Number.MAX_SAFE_INTEGER },
    step: { type: Number, default: 1 }
  },
  data() {
    return {
      controlType: componentUtil.controlType,
      config: Object,
      realCanEdit: true,
      modelVal: null,
      itemKey: "",
      precision: 0,
      viewport: null,
      dataSource: [],
    };
  },
  computed: {
    //计算属性值
    rootConfig() {
      return this.$parent.$parent.$parent.useConfig;
    },
    tableAllowEdit() {
      return this.rootConfig.allowEdit;
    },
    displayText() {
      var val = this.getDisplayText(this.row, this.prop);
      return val;
    }
  },
  /**
   * 监听事件
   */
  watch: {
    row: {
      handler: function(val, oldVal) {
        //判断是否需要调整可编辑性
        if (this.cellCanEdit || this.tableConfig.rowCanEdit) {
          this.realCanEdit = this.canEditFunc(this.row);
        }
      },
      deep: true
    },
    tableAllowEdit(val, oldval) {
      this.tableConfig.allowEdit = val;
      this.realCanEdit = this.canEditFunc(this.row);
    }
  },
  /**
   * 方法
   */
  methods: {
    calcConfig: function(reCalc) {
      if (this.calcEditControl && reCalc) {
        var $this = this;
        this.calcEditControl(this.row, function(data) {
          if (data.dataSource == null || data.dataSource.length == 0) {
            $this.config = $this.editControl;
          } else {
            $this.config = data;
          }
        });
      } else {
        this.config = this.editControl;
      }
    },
    //是否可以编辑
    canEditFunc: function(obj) {
      if (this.cellCanEdit) {
        return (
          this.tableConfig.allowEdit &&
          this.tableConfig.rowCanEdit(obj) &&
          this.cellCanEdit(obj, this.prop)
        );
      } else {
        return (
          this.tableConfig.allowEdit &&
          this.tableConfig.rowCanEdit(obj) &&
          this.canEdit
        );
      }
    },
    //值变更处理
    changeHandler: function(val) {
      // if(this.config.type != 'stackSelect'){
      //   this.$set(this.row,this.prop,val);
      // }
      if (this.change) {
        if (this.config && this.config.getSelected) {
          this.change(
            this.row,
            this.prop,
            val,
            this.config.getSelected(val, this.tableConfig.dicCache)
          );
        } else {
          this.change(this.row, this.prop, val);
        }
      }
    },
    //失去焦点处理
    blurHandler: function(val) {
      if (this.blur) {
        this.blur(this.row, this.prop, val);
      }
    }
  },
  /**
   * 创建时的钩子函数
   */
  created() {
    this.realCanEdit = this.canEditFunc(this.row);
    this.calcConfig(false);
    //this.modelVal = this.row[this.prop];
    this.itemKey = this.pk + this.prop;
    this.precision = componentUtil.getPropPrecision(
      this.tableConfig.entity,
      this.prop
    );
    this.viewport = this.$parent.$parent.$parent.$el;
    var $this = this;
  },
};
</script>