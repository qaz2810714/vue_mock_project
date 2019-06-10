<template>
    <div class="pmForm">
       <el-form  ref="ruleForm" class="demo-ruleForm" :inline="true">
            <!-- <el-row> -->
               <slot></slot>
           <!-- </el-row> -->
            <!-- <el-row v-for="(row, idx) in rows" v-if="row" :key="idx">
            </el-row> -->
       </el-form>
       <el-button @click="getAllParams">按钮</el-button>
    </div>
</template>

<script>
import CommonUtils from '@/common/utils/CommonUtils';
import cacheUtil from '@/common/utils/CacheUtil';
import { isNull } from 'util';
export default {
    props: {

    },
    computed: {
    },
    methods: {
        getAllParams(){
            var slotMap = new Map();
            var slotChildren =[];
            var slotPart = [];
            console.log(this.$slots.default);
            for (let i = 0; i< this.$slots.default.length; i++) {
                if (this.$slots.default[i].text !== " ") {
                    slotChildren.push(this.$slots.default[i]) // 获得 那些 插入的 按钮
                }
            }
            console.log(slotChildren[0].componentOptions.propsData.row);
            slotChildren.forEach(slot =>{
                var row = slot.componentOptions.propsData.row;
                if(slotMap.has(row)){
                    var slotArr = [];
                    slotArr = slotMap.get(1);
                   slotMap.set(row,slotArr.push(slot)) 
                }else{
                    var slotArr = [];
                    slotMap.set(row,slotArr.push(slot));
                }
            });
            console.log(slotMap);
            // slotChildren.forEach(function(child){
            //     var childsMap = new Map();
            // }
        }
    },
    mounted() {
       
    },
    data() {

    }
}
</script>

<style>
/* 重写el-form-item样式使其占满整个layout布局 */
.pmForm  .el-form-item--mini {
    width:100%;
}
</style>

