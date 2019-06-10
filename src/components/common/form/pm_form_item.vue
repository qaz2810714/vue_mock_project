<template>
    <div class="pm_form_item">
        <el-col :span="span">
            <base_form_item ref="bf_item" :label="labletext" size="mini" :label-width="lableWidth" :prop="name">
                <el-input  v-if="xtype == 'text'" size="mini"  v-bind:disabled="canRead" v-model.trim="model[name]"
                        clearable :maxlength="maxlength" :placeholder="placeholder">   
                </el-input>
                 <!-- 密码 -->
                <el-input  v-if="xtype == 'password'" type='password' size="mini"  v-bind:disabled="canRead" v-model.trim="model[name]"
                        clearable :maxlength="maxlength" :placeholder="placeholder">     
                </el-input>           
                <!-- 数值 -->
                <el-input-number v-if="xtype == 'number'" size="mini" 
                    v-bind:disabled="canRead" v-model="model[name]" clearable :min="min" :max="max" :precision='precision'>
                </el-input-number>
                <!-- 日期 -->
                <el-date-picker v-if="xtype == 'date'" size="mini" 
                    v-bind:disabled="canRead" v-model="model[name]" type="date" :picker-options="pickerOptions">
                </el-date-picker>
                <!-- 日期范围 -->
                <el-date-picker v-if="xtype == 'daterange'" size="mini" 
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                    v-bind:disabled="canRead" v-model="model[name]" type="daterange">
                </el-date-picker>
                <!-- 日期时间 -->
                <el-date-picker v-if="xtype == 'datetime'" size="mini" 
                    v-bind:disabled="canRead" v-model="model[name]" type="datetime" :picker-options="pickerOptions">
                </el-date-picker>
                <!-- 日期时间范围 -->
                <el-date-picker v-if="xtype == 'datetimerange'" size="mini" 
                     v-bind:disabled="canRead" v-model="model[name]" type="datetimerange">
                </el-date-picker>
                <!-- 单选下拉 -->
                <el-select v-if="xtype == 'select'" size="mini" filterable clearable  @change="changeHandler"
                    v-bind:disabled="canRead" v-model="model[name]" placeholder="请选择">
                    <el-option v-for="item in datalist" :key="item[editControl.key]"
                        :label="item[editControl.value]" :value="item[editControl.key]">
                    </el-option>
                </el-select>

                <!-- 多选下拉 -->
                <el-select v-if="xtype == 'select_batch'" size="mini" clearable multiple  v-bind:disabled="canRead" v-model="model[name]" placeholder="请选择">
                    <el-option v-for="item in datalist" :key="item[editControl.key]"
                        :label="item[editControl.value]" :value="item[editControl.key]">
                    </el-option>
                </el-select>

                 <!-- 多选下拉2 -->
                <el-select v-if="xtype == 'select_batchMemo'" size="mini" filterable clearable multiple  v-bind:disabled="canRead" v-model="model[name]" placeholder="请选择">
                   <el-option
                        v-for="item in datalist"
                        :key="item[editControl.key]"
                        :label="item[editControl.value]"
                        :value="item[editControl.key]">
                        <span style="float: left">{{ item[editControl.value] }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item[editControl.desc] }}</span>
                    </el-option>
                </el-select>
                <!-- 复选框组 -->
                <el-checkbox-group v-if="xtype == 'checkbox_group'" size="mini" v-model="model[name]">
                    <pm_checkbox v-for="item in datalist" :key='item[editControl.key]' 
                    :disabled="isDisabled(item[editControl.key])"
                    :value="item[editControl.key]" :label="item[editControl.key]" :show="item[editControl.value]">
                        <!-- <el-input type="checkbox" /> -->
                    </pm_checkbox>
                </el-checkbox-group>
                <!-- 高级搜索控件 -->
                <!-- <SearchSelectButton  v-if="xtype == 'search_select_input'" :field="field"></SearchSelectButton> -->
                <pm_search_select v-if="xtype == 'search_select_input'" :dicCache="dicCache" :config="editControl"
                :changeFunc="changeHandler"  v-bind:readOnly='canRead' :fieldName="name" v-model="model[name]" v-bind:cstName.sync="model[autoCreateField]" :alllowCreate="alllowCreate"></pm_search_select>
                <!-- textarea -->
                <el-input v-if="xtype == 'textarea'" size="mini" clearable type="textarea" :rows='rowHeight'  placeholder="请输入内容" 
                v-bind:disabled="canRead" v-model="model[name]"  :maxlength="maxlength"></el-input>
                <!-- 树形下拉-->
                <pm_treeSelect v-if="xtype == 'tree_select'" width="100%" height="200" :canClickParent="canClickParent" :dataTree="dataTree" v-bind:bindId.sync="model[name]" v-model="model['treeNode']"></pm_treeSelect>
                <!-- 单选控件 -->
                <pm_radio v-if="xtype == 'radio'" :menu="radioGroup" :able="canRead" v-model="model[name]"></pm_radio>
                <!-- 选择框 -->
                <el-checkbox v-if="xtype == 'check'" v-model="model[name]"></el-checkbox>
            </base_form_item>
        </el-col>
    </div>
</template>

<script>
import CommonUtils from '@/common/utils/CommonUtils';
import cacheUtil from '@/common/utils/CacheUtil';
import base_form_item from '@/components/common/form/base_form_item';
import { parse } from 'semver';
import SearchSelectButton from '@/components/common/button/SearchSelectButton';
import pm_checkbox from '@/components/common/checkbox/pm_checkbox';
import pm_search_select from '@/components/common/select/pm_search_select';
import componentUtil from "../../../common/utils/ComponentUtil";
import filterExtend from "../../../common/utils/FilterExtend";
import pm_treeSelect from "@/components/common/treeSelect/pm_treeSelect";
import pm_radio from "@/components/common/radio/pm_radio";
import { setTimeout } from 'timers';
export default {
    components:{
        base_form_item,
        SearchSelectButton,
        pm_search_select,
        pm_checkbox,
        pm_treeSelect,
        pm_radio
    },
    props: {
        dataTree:Array,
        span: {
            type: Number,
            default: 6
        },
        row:String,
        labletext: String,
        name: String,
        maxlength: String,
        placeholder:String,
        xtype: {
            type: String,
            default: "text"
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        lableWidth:String,
        //是否必填
        required:{
            type: Boolean,
            default: false
        },
        canClickParent:{
            type: Boolean,
            default: false
        },
        validObj:{
            type: Object,
            default:function() {
                return{
                    required:true,
                    message:'',
                    trigger:''
                }
            }
        },
        //数字类型最大最小值
        min:Number,
        max:Number,
        options:Array,
        //textarea占行数
        rowHeight:{
            type:Number,
            default:3
        },
        //多选框是否是逗号分隔处理
        selectBatchDataSplit:{
            type:Boolean,
            default:false
        },
        //radio组个数配置
        radioGroup:Array,
        watchField:String,
        disabledList:Array,//禁用列表
        // checkedList:Array,//选中列表
        pickerOptions:{},
        canEdit: Boolean,
        alllowCreate:{
            type:Boolean,
            default:false
        },
        autoCreateField:String
    },
    computed: {
        field:function(){
            var field = {};
            field.fieldName = this.name;
            return field;
        },
        // editControl : function(){
        //     return this.getCtrlConfig();
        // },
        canRead:function(){
            if(this.canEdit == true){
                return false;
            }
            if(typeof this.$parent.$parent.$parent.formReadOnly == 'function'){
                return  (this.$parent.$parent.$parent.formReadOnly() || this.readOnly);
            }else{
                return  (this.$parent.$parent.$parent.formReadOnly || this.readOnly);
            }
        },
        newValue(){
            if(this.watchField){
                return this.model[this.watchField];
            }
        },
        dicCache(){
            return this.$parent.$parent.$parent.dicCache;
        },
        realDataList(){
            return this.config.dataSource;
        }
    },
    watch:{
        newValue(val, oldVal){
            //监听值发生改变，则重新计算配置信息
            this.calcConfig(val);
        }
    },
    methods:{
        isDisabled:function(val){
            if(this.disabledList==null) return false;
            return this.disabledList.includes(val);
        },
        isChecked:function(val){
            if(this.checkedList==null) return false;
            return this.checkedList.includes(val);
        },
        changeHandler:function(val){
            if(this.changeFunc){
                if(this.editControl && this.editControl.getSelected){
                  var obj = this.editControl.getSelected(val);
                  this.changeFunc(this.name, val, obj);
                }else{
                  this.changeFunc(this.name, val);
                }
            }
        },
        calcConfig:function(val){
            //关联控件过滤数据源
            this.editControl = this.getCtrlConfig(val);
            if(this.watchField == 'cstId'){
                this.$set(this.model,this.name,val);
            }
            if(this.watchField == 'costType'){
                if(val!=1){
                    this.$set(this.model,this.name,2);
                }else{
                    this.$set(this.model,this.name,val);
                }
            }
            if(this.watchField == 'rangeApply'){
                if(val==1){
                    this.$set(this.model,this.name,2);
                }else{
                    this.$set(this.model,this.name,1);

                }
            }
            if(this.watchField == 'isUnifyUnitPrice'){
                if(val==1){
                    this.$set(this.model,this.name,0);
                    this.readOnly=false;
                }else{
                    this.$set(this.model,this.name,0);
                    this.readOnly=true;
                }
            }
            if(this.watchField == 'cstType'){
                if(val==1){
                    this.$set(this.model,this.name,this.model.regularOtherNo);
                    this.readOnly=false;
                }else{
                    this.$set(this.model,this.name,"");
                    this.readOnly=true;
                }
            }
            if(this.watchField == 'balanceType'){
                if(val==2){
                    this.$set(this.model,this.name,5);
                    this.readOnly=true;
                }else{
                    this.$set(this.model,this.name,1);
                    this.readOnly=false;
                }
            }
            if(this.watchField == 'actMoney'){
                if(val.trim()==''){
                    this.$set(this.model,this.name,false);
                }else{
                    if(val!="0"){
                        this.$set(this.model,this.name,true);
                    }else{
                        this.$set(this.model,this.name,false);
                    }
                }               
            }
        },
        getCtrlConfig(){
            var entity = this.$parent.$parent.$parent.entity;
            if(this.xtype=='search_select_input' || this.xtype=='select' || this.xtype=='select_batch' || this.xtype == 'checkbox_group'|| this.xtype=='select_batchMemo'){
                var config = componentUtil.getEditControl(
                    entity,this.name
                );
                if (config.getDataSource) {
                    var $this = this;
                    //数据源key值处理
                    var key = config.key;
                    config.dataSource = config.getDataSource(this.dicCache,list=>{
                        list.forEach(item => {
                            if (typeof item[key] == "number") return;
                                item[key] = filterExtend.filters.toInt(item[key]);
                        });
                        $this.editControl.dataSource = list;
                        $this.datalist = list;
                    });
                    if(config.dataSource!=null){
                        config.dataSource.forEach(item => {
                            if (typeof item[key] == "number") return;
                                item[key] = filterExtend.filters.toInt(item[key]);
                        });
                    }else{
                        config.dataSource = [];
                    }
                    this.datalist = config.dataSource;
                }
                return config;
            }else{
                return null;
            }
        }
    },
    created() {
        var parent = this.$parent.$parent.$parent;
        this.changeFunc = parent.change;
        this.model = parent.model;
        if(this.required){
            this.validObj.message = "请输入" + this.labletext;
            this.validObj.trigger = "change";
            if(parent.rules[this.name] == undefined){
                parent.rules[this.name] = [];
            }
            parent.rules[this.name].push(this.validObj);
        }
        this.editControl = this.getCtrlConfig();
        this.$cacheUtil.addColumnListener(this.notifyObj);
        this.precision =  componentUtil.getPropPrecision(parent.entity,this.name);
    },
    /**
     * 摧毁时移除监听事件
     */
    destroyed(){
        this.$cacheUtil.removeColumnListener(this.notifyObj);
    },
    data() {
        return{
            model:{},
            datalist:[],
            changeFunc:Function,
            editControl:{},
            notifyObj:{
                win:this,
                callback:(cache,win)=>{
                    win.editControl = win.getCtrlConfig();
                }
            },
            precision:0
        }
    }
}
</script>

<style scoped>
/* 重写el-form-item样式使其占满整个layout布局 */
.pmForm  .el-form-item--mini {
    width:100%;
}
/* 重写el-form-item中的input样式使其宽度按照占比设置 此css需要js根据lable的传入长度动态计算 */
.pm_form_item .el-form-item__content {
    width:80%;
}
.pm_form_item .el-form-item .el-form-item__content .el-date-editor {
    width:100%;      
}
.pm_form_item .el-form-item .el-form-item__content .el-input-number {
    width:100%; 
}
.pm_form_item .el-form-item .el-form-item__content .el-select {
    width:100%; 
}
.pm_form_item .el-form-item__content .el-autocomplete{
    width:80%;
}
.el-form-item{
    margin-bottom: 0px !important;
}
.search_partition .el-select{
  width:100%;
}
</style>
