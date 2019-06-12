<template>
    <div class="pmForm search_partition">
       <el-form  ref="pmForm" :inline="true">
            <el-row>
               <slot></slot>
           </el-row>
       </el-form>
    </div>
</template>

<script>
import CommonUtils from '@/common/utils/CommonUtils';
import cacheUtil from '@/common/utils/CacheUtil';
import { isNull } from 'util';
export default {
    props: {
        model:Object,
        rules:Object,
        entity:Object,
        change:Function,
        formReadOnly:{type:Boolean,default:false},//全表单禁用开关
    },
    computed: {
    },
    created() {
        this.$cacheUtil.addTableListener(this.notifyObj);
    },
    destroyed() {
        this.$cacheUtil.removeTableListener(this.notifyObj);
    },
    data(){
        return {
            dicCache: cacheUtil.getDic(),
            notifyObj:{
                win:this,
                callback:(cache,win)=>{
                    win.dicCache = cache;
                }
            }
        }
    },
    methods: {
        validate:function(curr,succ,fail){
            this.$refs.pmform.validate(              
                (valid,validFields) => {
                    if (valid) {
                        if(succ){
                            succ(valid);
                        }
                    } else {
                        if(fail){
                            fail(valid);
                        }else{
                             for (var key in validFields){
                                this.$commonUtil.valid.throwEx(curr,validFields[key][0].message);
                             }
                        }
                    }
            });
        }
    }
}
</script>

<style>
/* 重写el-form-item样式使其占满整个layout布局 */
.pmForm  .el-form-item--mini {
    width:100%;
}
</style>

