<template>
    <pm_treeSelect
      width="100%"
      height="200"
      :canClickParent="false"
      :dataTree="dataTree"
      v-model="value"
    ></pm_treeSelect>
</template>
<script>
import pm_treeSelect from "@/components/common/treeSelect/pm_treeSelect";
export default {
    components: {
        pm_treeSelect
    },
    props:{
        bindData:Object,
        dataTree:Array,
        whsRoomId:Number,
        whsAreaId:Number,
    },
    //自定义v-model双向绑定
    model:{
      prop: "bindData",
      event: "bindEvent"
    },
    data(){
        return{
            value:{}
        }
    },
    created(){
        if(this.whsRoomId && this.whsAreaId){
            this.value = this.setDefaultValue()
        }
    },
    watch:{
        //监听值变化
        value(){
            this.$emit("bindEvent",this.value);
            this.$emit("update:whsRoomId", this.value.whsRoomId);
            this.$emit("update:whsAreaId", this.value.whsAreaId);
        },
    },
    methods: {
        // 根据whsRoomId 和whsAreaId在树状数据中搜索节点
        setDefaultValue:function(){
            let stark = [];
            stark = stark.concat(this.dataTree);
            while (stark.length) {
                var temp = stark.shift();
                if (temp['children']) {
                    stark = stark.concat(temp['children']);
                }
                if (temp['whsRoomId'] == this.whsRoomId && temp['whsAreaId'] == this.whsAreaId) {
                    return temp;
                }
            }
            return {};
        }
    },
}
</script>
