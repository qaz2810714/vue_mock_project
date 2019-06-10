<template>
    <div class="search_partition">
        <el-row>
            <!-- 左边正常搜索区域 -->
            <el-col :span="searchSpan">
                <vue-search ref="vue_search" :fields="fields" :entity="entity" :hasBtnGroup="!hasPackNoSearch">
                    <el-button-group size="mini">
                        <el-button size="mini" type="primary" icon="el-icon-search"  @click="getAllSearchParams">搜索</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-refresh" @click="resetAllSearchValue">重置</el-button>
                    </el-button-group>
                </vue-search>
            </el-col>
            <!-- 右边捆包号搜索区域 -->
            <el-col v-if="hasPackNoSearch" :span="packNoSearchSpan">
                <el-row>
                    <el-col :span="8" style="text-align:end;">
                      <span class="labelCss">捆包号&nbsp;:&nbsp;</span>
                    </el-col>
                    <el-col :span="16">
                      <el-input size="mini" v-model="fPackNo" clearable type="textarea" :autosize="{minRows:packRowHeight,maxRows: packRowHeight}" placeholder="请输入内容"></el-input>
                    </el-col>
                </el-row>
                <el-row style="margin-top:7px">
                    <!-- 按钮组 -->
                    <el-col :offset="btnOffset">
                        <el-button-group size="mini">
                            <el-button size="mini" type="primary" icon="el-icon-search"  @click="getAllSearchParams">搜索</el-button>
                            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="resetAllSearchValue">重置</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import vueSearch from '../pageContainer/vue_search';
import CommonUtils from '@/common/utils/CommonUtils';
import cacheUtil from '@/common/utils/CacheUtil';
export default {
    components: { "vue-search":vueSearch },
    xtype: vueSearch.xtype,
    props: {
        entity:Object,
        fields: {
            type: Array,
            default: function(){
                return [];
            }
        },
        hasPackNoSearch: {//是否有捆包号查询框
            type:Boolean,
            default: false
        },
        searchPartSpan: {//搜索区域栅栏占比
            type:Number,
            default: 24
        },
        packNoSearchSpan: {//右边捆包号查询区域栅栏占比
            type:Number,
            default: 4
        },
        packRowHeight: {//右边捆包号查询区域显示行数
            type:Number,
            default: 5
        },
        btnOffset: {
            type:Number,
            default: 6   
        }
    },
    computed: {
       searchSpan:function(){
           let span = this.searchPartSpan;
           if(this.hasPackNoSearch){
               span = this.searchPartSpan-this.packNoSearchSpan; 
           }
           return span;
       }
    },
    mounted(){
        this.getAllSearchParams();
    },
    methods: {
        getParam(){
            var params = this.$refs.vue_search.getSearchParam();
            if(this.hasPackNoSearch){
                if(this.fPackNo>""){
                    var packNos = this.fPackNo.split(/[\n]/);
                    params.fPackNo = packNos.filter(item=>item);
                }else{
                    params.fPackNo = null;
                }

            }
            return params;
        },
        getAllSearchParams() {
            var param = this.getParam();
            param.page = 0;//归置为第1页
            this.$emit('getAllSearchParams',param);
        },
        resetAllSearchValue(){
            this.$refs.vue_search.resetAllValue();
            this.fPackNo = null;
        }
    },
    data:function(){
        return{
            fPackNo:null
        }
    }
}
</script>
<style lang="scss">
.search_partition{
    padding:10px 5px 5px 0;
    background-color:#fff;
    .el-input--mini{
        .el-input__inner{
            height: 24px;
            line-height: 24px;
        }
        .el-input__icon{
            line-height: 24px;
        }
    } 
    .el-input-number--mini{
        line-height: 22px;
    }
    .el-range-editor--mini.el-input__inner{
        height: 24px;
    }
    .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
        line-height: 24px;
    }
    .el-range-editor--mini .el-range__close-icon, .el-range-editor--mini .el-range__icon {
        line-height: 17px;
    }
    .el-radio-group{
        margin-top: 4px;
    }
    .el-button--mini, .el-button--mini.is-round{
        padding: 5px 9px;
    }
    .el-button-group{
        .el-button+.el-button{
            margin-left: 5px;
        }
    }
}
.search_partition .el-select{
    width: 100%;
}
.search_partition .el-autocomplete{
    width: 100%
}
</style>

