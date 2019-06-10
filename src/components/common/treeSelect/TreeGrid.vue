<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover">
    <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" highlight-current-row @row-dblclick="getValue"
              style="width: 400px;height: 200px;overflow: auto" tooltip-effect="dark">
      <el-table-column v-if="columns.length===0">
        <template slot-scope="scope">
          <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
          <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text"
                       :width="column.width">
        <template slot-scope="scope">
          <span v-for="space in scope.row._level" v-if="index === 0" class="ms-tree-space" :key="space"></span>
          <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
          {{scope.row[column.value]}}
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
  <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      clearable
      :style="`width: 200px`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder">
    </el-input>
  </el-popover>
</template>

<script>

  import Vue from 'vue';
  import treeToArray from './eval';
  import cacheUtil from '@/common/utils/CacheUtil';

  export default {
    name: 'treeTable',
    props: {
      data: {
        type: [Array, Object],
        required: true,
        //default:loadCache(),
      },
      columns: {
        type: Array,
        default:()=>[
                {
                    text:'名称',
                    value:'label',
                },
                {
                    text:'路径',
                    value:'memo',
                },
            ],
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      },
      
      // 输入框占位符
      placeholder: {
        type: String,
        required: false,
        default: '请选择',
      },
    },

    data() {
      return {
        // 树状菜单显示状态
        showStatus: false,
        // 输入框显示值
        labelModel: '',
      };
    },
    computed: {
      // 格式化数据源
      formatData: function () {
        let tmp;
        if (!Array.isArray(this.data)) {
          tmp = [this.data]
        } else {
          tmp = this.data
        }
        const func = this.evalFunc || treeToArray;
        const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll];
        return func.apply(null, args)//赋值function里前两位值data与expandAll
      },
    },
    methods: {
      showRow(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true);
        row.row._show = show;
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      // 切换下级是否展开
      toggleExpanded(trIndex) {
        const record = this.formatData[trIndex]
        record._expanded = !record._expanded
      },
      // 图标显示
      iconShow(index, record) {
        return (index === 0 && record.children && record.children.length > 0)
      },

      // 显示时触发
      onShowPopover() {
        this.showStatus = true;
        //this.$refs.tree.filter(false);
      },
      // 隐藏时触发
      onHidePopover() {
        this.showStatus = false;
        //this.$emit('selected', this.valueModel);
      },
      getValue(row){
        this.$refs.
        this.labelModel=row.memo;
      },
      //初始化库位信息
      loadCache(){
        var list=cacheUtil.getDic().WhsLevel.list;
        var resultList=[];
        list.array.forEach(element => {
          Vue.set(element, 'children', [])
          resultList.push(element);
        });
        return resultList;
      }
    }
  }
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  /*$color-blue:*/
  /*$space-width: */
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;

  &
  ::before {
    content: ""
  }

  }
  .processContainer {
    width: 100%;
    height: 100%;
  }

  table td {
    line-height: 26px;
  }

  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: #2196F3;
    margin-left: -18px;
  }

  .el-table__body tr.current-row > td {
    background: rgba(185, 221, 249, .75) !important;
  }
</style>