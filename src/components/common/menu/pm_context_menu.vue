<template>
    <v-contextmenu ref="contextmenu" :autoPlacement='true'>
        <v-contextmenu-item v-for="item in items" :key="item" :autoHide='false'>
                <el-checkbox  v-model="checkList[item.componentOptions.propsData.prop]" :label="item.componentOptions.propsData.label"></el-checkbox>
        </v-contextmenu-item>
        <v-contextmenu-item style="text-align:center" :autoHide='false' @click="confirmContext">
            确定
        </v-contextmenu-item>
    </v-contextmenu>
</template>


<script>
export default {
  name: "pm_context_menu",
  data: function() {
    return {
        checkList:{
            type:Object,
            default:function(){
                return {};
            }
        }
    };
  },
  props: {
      items:{
          type:Array,
          default:function(){
                return [];
          }
      },
      colsKey:String
  },
  mounted(){
        if(!this.colsKey){
            return;
        }
        var selectCols = this.$cacheUtil.getCache("DicVisibelCols");
        if(selectCols && selectCols[this.colsKey]){
            this.checkList = selectCols[this.colsKey];
        }
  },
  methods: {
    addRef:function(el,vnode){
        //右键菜单指定挂接位置
        const contextmenu = this.$refs.contextmenu;
        contextmenu.addRef({ el, vnode })
    },
    confirmContext:function(){
        this.visiCols();
        this.$refs.contextmenu.hide();
    },
    visiCols:function(){
        this.items.forEach(col => {
            if(this.checkList.hasOwnProperty(col.componentOptions.propsData.prop) && this.checkList[col.componentOptions.propsData.prop]){
                col.child.visible = false;
            }else{
                col.child.visible = true;
            } 
        });
        var cacheCols = this.$cacheUtil.getCache("DicVisibelCols");
        if(cacheCols && cacheCols[this.colsKey]){
            cacheCols[this.colsKey] = this.checkList;
            this.$cacheUtil.setCache("DicVisibelCols",cacheCols);
        }else{
            var DicVisibelCols = {};
            DicVisibelCols[this.colsKey] = this.checkList;
            this.$cacheUtil.setCache("DicVisibelCols",DicVisibelCols);
        }
    },
  }
};
</script>
