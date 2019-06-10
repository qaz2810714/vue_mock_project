<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover">
    <el-tree
      ref="tree"
      class="select-tree"
      highlight-current
      :style="`min-width: ${treeWidth};height:${height}px`"
      :data="dataTree"
      :props="props"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="true"
      @node-click="onClickNode">
  </el-tree>   
    <el-input
      slot="reference"
      ref="input"
      size="mini"
      v-model="displayText"
      clearable
      :style="`width: ${width}`"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder">
    </el-input>
  </el-popover>
</template>

<script>
import {Popover,Tree,Input} from 'element-ui';
import Vue from 'vue';
import cacheUtil from '@/common/utils/CacheUtil';
export default {
    components: {
        'el-popover': Popover, 'el-tree': Tree,
        'el-input':Input,
        },
    props: {
      bindData: {
        type: Object
      },
      //是否允许点击父节点
      canClickParent:{
        type:Boolean,
        default:true,
      },
      // 树形数据源
      dataTree:{
        type:Array,
        default:[]
      },
      //绑定Id值
      bindId:Number,
      // 输入框宽度
      width: String,
      //下拉框高度
      height: String,
      // 输入框默认值
      placeholder: {
        type: String,
        required: false,
        default: '请选择',
      },
      // 树节点配置选项
      props: {
        type: Object,
        required: false,
        default: () => ({
          id:'id',
          label: 'name',
          children: 'children',
        }),
      },
    },
    //初始化数据列表
    mounted: function() {
      let _this = this;
    },
    data() {
      return {
        // 菜单宽度
        treeWidth: 'auto',
        // 输入框显示值
        displayText: '',
        // 实际选择的节点
        selectedNode: {},
      };
    },
    created() {
      //根据绑定的bindData来查询相应显示label;
      if(this.bindData){
        this.setValue(this.bindData);
      }
      else if(this.bindId){
        let node = this.queryTree(this.bindId);
        this.setValue(node);
      }
      // 获取输入框宽度同步至树状菜单宽度
      this.$nextTick(() => {
        this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
      });
    },
    //自定义v-model双向绑定
    model: {
      prop: "bindData",
      event: "selected"
    },
    watch: {
      displayText(val) {
        if (!val) {
          this.selectedNode={};
        }
        this.$refs.tree.filter(val);
        this.$emit("selected", this.selectedNode);
        this.$emit("update:bindId",this.selectedNode[this.props.id])
      },
      //根据绑定值控制显示值
      bindId(){
        this.setValue(this.queryTree(this.bindId));
      },
      bindData(){
        this.setValue(this.bindData);
      }
    },
    methods:{
      // 单击节点
      onClickNode(node) {
        //如果父节点不可点击，判断点击的是否为末端节点，如果是则直接返回
        //console.log("当前点击节点为")
        //console.log(node)
        if(!this.canClickParent){
          let childProp = node[this.props.children];
          if(childProp){
            if(childProp.length != 0){
              this.$alert("请选择末端节点","提示")
              return;
            }
          }
        }
        this.setValue(node);
        this.onCloseTree();
      },
      //值设置
      setValue(node){
        //设置显示文本
        if(node && node[this.props.id]){
          this.displayText = node[this.props.label];
          this.selectedNode = node;
        }
      },
      // 隐藏树状菜单
      onCloseTree() {
        this.$refs.popover.showPopper = false;
      },
      // 显示时触发
      onShowPopover() {
        this.$refs.tree.filter(false);
      },
      // 隐藏时触发
      onHidePopover() {
        this.$emit('selected', this.selectedNode);
        this.$emit("update:bindId",this.selectedNode[this.props.id])
      },
      // 树节点过滤方法
      filterNode(query, data) {
        if (!query) return true;
        if(data[this.props.label]==null) return true;
        return data[this.props.label].indexOf(query) !== -1;
      },

      // 根据data(id)在树状数据中搜索节点
      queryTree(data) {
        if(!data){
          return;
        }
        let stark = [];
        stark = stark.concat(this.dataTree);
        while (stark.length) {
          var temp = stark.shift();
          if (temp[this.props.children]) {
            stark = stark.concat(temp[this.props.children]);
          }
          if (temp[this.props.id] == data) {
            return temp;
          }
        }
        console.log("正在树状控件中进行搜索,搜索到节点");
        console.log(temp);
        return {};
        //return '';
      },
    },
}
</script>

<style>
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }
  .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }
  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }
  /* 菜单滚动条 */
  .select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  .select-tree::-webkit-scrollbar-track,
  .select-tree::-webkit-scrollbar-corner {
    background: #fff;
  }
  .select-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  .select-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
</style>