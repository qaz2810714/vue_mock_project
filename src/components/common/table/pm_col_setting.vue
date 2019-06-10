<template>
  <div class="col-setting">
    <el-row :gutter="20">
      <el-col :span="10">
        <p>隐藏字段</p>
      </el-col>
      <el-col :span="14">
        <p>显示字段</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <ul class="list">
            <li
              class="list-item"
              v-for="(item,index) in hideItems"
              :key="item.prop"
              @dblclick="setShow(item)"
            >
              <el-row :gutter="20" style="width:100%;">
                <el-col :span="4" class="txt_label">
                  <span>{{index+1}}</span>
                </el-col>
                <el-col :span="20" class="txt_label">
                  <span>{{item.label}}</span>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <!-- <sortableList lockAxis="y" helperClass="stylizedHelper" v-model="showItems">
							<showItem v-for="(item, index) in showItems"
							 :index="index" :key="index" :item="item" :setHide="setHide">
							 </showItem>
          </SortableList>-->
          <!-- :move="getdata" @update="datadragEnd" -->
          <draggable v-model="showItems" :options="{filter: '.undraggable'}">
            <transition-group>
              <div
                v-for="(item, index) in showItems"
                class="list-item"
                :key="item.prop"
                @dblclick="setHide(item)"
              >
                <el-row :gutter="20" style="width:100%;">
                  <el-col :span="2" class="txt_label">
                    <span>{{index+1}}</span>
                  </el-col>
                  <el-col :span="12" class="txt_label">
                    <span>{{item.label}}</span>
                  </el-col>
                  <el-col :span="10">
                    <el-input class="undraggable" size="mini" v-model="item.width"/>
                  </el-col>
                </el-row>
              </div>
            </transition-group>
          </draggable>
        </div>
      </el-col>
    </el-row>
    <el-row style="height:40px;margin-top:10px;text-align:center;">
      <el-col>
        <el-button type="primary" @click="saveFunc">保存</el-button>
        <el-button type="info" @click="closeWin">取消</el-button>
        <el-button type="warning" @click="resetFunc">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import layerUtil from "@/common/utils/LayerUtil";
// import {ContainerMixin, ElementMixin} from 'vue-slicksort';
// import showItem from './pm_col_show_item'
// const sortableList = {
//   mixins: [ContainerMixin],
//   template: `
//     <ul class="list">
//       <slot />
//     </ul>
//   `,
// };
const key = "DicVisibelCols";
export default {
  name: "pm_col_setting",
  components: {
    draggable
  },
  data() {
    return {
      showItems: [], //数组列表
      hideItems: [], //数组列表
      items: [], //数组列表
      config: {} //配置信息
    };
  },
  created() {
    this.initCols();
  },
  mounted() {
    setTimeout(function() {
      //对选中项执行foreach操作
      [].forEach.call(document.querySelectorAll(".undraggable"), function(
        item
      ) {
        item.addEventListener("pointerdown", e => {
          e.stopPropagation();
        });
        item.addEventListener("mousedown", e => {
          e.stopPropagation();
        });
      });
    }, 200);
  },
  methods: {
    closeWin: layerUtil.closeWin,
    /**
     * 初始化列信息
     */
    initCols: function() {
      //this.items 是table前台显示出来的字段
      this.items = JSON.parse(this.$options.propsData.items);
      var tableKey = this.$options.propsData.tableKey;
      var cacheCols = this.$cacheUtil.getCache(key) || {};
      var tableSetting = cacheCols[tableKey] || {};
      var colSetting = tableSetting.cols || [];
      //1.先更新items中的宽度信息
      var $this = this;
      colSetting.forEach(c => {
        var col = $this.items.find(item => item.prop == c.prop);
        if (!col) {
          //未找到说明该字段已经被隐藏
          $this.hideItems.push(c);
          return;
        }
        if (c.label == null || c.label == "") {
          c.label = col.label;
        }
        //拷贝宽度
        col.width = c.width;
        //拷贝隐藏设置
        col.hidden = c.hidden;
        if (c.hidden) {
          $this.hideItems.push(c);
        } else {
          $this.showItems.push(c);
        }
      });
      //2.在showItems中 添加没有经过设置的字段
      var sortProps = colSetting.map(c => c.prop);
      var added = this.items.filter(c => !sortProps.includes(c.prop));
      this.showItems = this.showItems.concat(added);
    },
    setHide(item) {
      item.hidden = true;
      this.hideItems.push(item);
      this.remove(this.showItems, item);
    },
    setShow(item) {
      item.hidden = false;
      this.showItems.push(item);
      this.remove(this.hideItems, item);
    },
    remove(arr, val) {
      var index = arr.indexOf(val);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    //保存
    saveFunc() {
      //1.搜集数据列表
      var cols = this.hideItems.concat(this.showItems);
      this.afterSetting(cols);
    },
    //重置函数
    resetFunc() {
      //清空自定义信息
      var $this = this;
      $this.$commonUtil.message.confirm(
        "重置后界面恢复系统默认状态，是否确认？",
        () => {
          $this.afterSetting([]);
        }
      );
    },
    //设置完成事件
    afterSetting(cols) {
      var $this = this;
      var btnSave = this.$options.propsData.btnSave;
      if (btnSave) {
        btnSave(cols, () => {
          $this.closeWin();
        });
      } else {
        $this.closeWin();
      }
    }
  }
};
</script>
<style lang="scss">
.col-setting {
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
  }

  pre {
    border-radius: 20px;
    padding: 20px;
    background: #fefefe;
  }
  .grid-content {
    height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #eee;
  }
  .list {
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background-color: #f3f3f3;
    border: 1px solid #efefef;
    border-radius: 3;
  }

  .list-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
    padding: 8px 10px;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: #333;
    font-weight: 400;
    height: 38px;
  }

  .list-item:hover {
    background-color: rgba(31, 136, 255, 0.2);
  }

  .divider {
    padding: 10px 20px;
    background: #f9f9f9;
    border-bottom: 1px solid #efefef;
    text-transform: uppercase;
    font-size: 14px;
    color: #333;
  }

  .helper {
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2),
      0 -5px 5px -5px rgba(0, 0, 0, 0.2);
  }

  .stylizedHelper {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(31, 136, 255, 0.8);
    color: #fff;
    cursor: row-resize;
    border: 1px solid #fff;
    z-index: 100;
  }
  .el-row {
    margin-bottom: 0px !important;
  }
  .txt_label {
    padding-top: 5px;
  }
}
</style>

