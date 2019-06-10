<template>
<el-container style="padding:5px;">
    <el-main style="padding:10px;">
        <pm_form_render :model="formModel" :rules="rules" ref="owForm" :entity='config.entity'>
            <pm_form_item row="1" labletext="客户编号" name="cstNo" :span="8" xtype="text" lableWidth="110px" :readOnly='true'></pm_form_item>
            <pm_form_item row="1" required labletext="客户全称" name="cstFullName" :span="8" xtype="text" lableWidth="110px"></pm_form_item>
            <pm_form_item row="1" required labletext="客户简称" name="cstShortName" :span="8" xtype="text" lableWidth="90px"></pm_form_item>
            <pm_form_item row="2" labletext="纳税人识别号" name="taxpayerIdentificationNumber" :span="8" xtype="text" lableWidth="110px"></pm_form_item>
            <pm_form_item row="2" labletext="开户行" name="accountOpenBank" :span="8" xtype="text" lableWidth="110px"></pm_form_item>
            <pm_form_item row="2" labletext="助记码" name="mnemonicCode" :span="8" xtype="text" lableWidth="90px"></pm_form_item>
            <pm_form_item row="3" labletext="业务联系人电话" name="contactPersonPhone" :span="8" xtype="text" lableWidth="110px"></pm_form_item>
            <pm_form_item row="3" labletext="业务联系人传真" name="contactFax" :span="8" xtype="text" lableWidth="110px"></pm_form_item>
            <pm_form_item row="3" labletext="是否禁用" name="deleteFlag" :span="8" xtype="select" lableWidth="90px" :readOnly='isReadOnly("deleteFlag")'></pm_form_item>
            <pm_form_item row="4" required labletext="结算方式" name="settleType" :span="8" xtype="select" lableWidth="110px"></pm_form_item>
            <pm_form_item row="4" ref='finalRepayDate' watchField='settleType' labletext="最后还款日期" name="finalRepayDate" :span="8" xtype="date" lableWidth="110px" :readOnly='isReadOnly("finalRepayDate")'></pm_form_item>
            <pm_form_item row="5" labletext="备注" name="remark" :span="24" xtype="text" lableWidth="110px"></pm_form_item>
            <pm_form_item row="6" labletext="创建人" name="creatorName" :span="8" xtype="text" lableWidth="110px" :readOnly='true'></pm_form_item>
            <pm_form_item row="6" labletext="创建时间" name="createTime" :span="8" xtype="text" lableWidth="110px" :readOnly='true'></pm_form_item>
            <pm_form_item row="6" labletext="注册地址" name="address" :span="8" xtype="text" lableWidth="90px"></pm_form_item>
            <pm_form_item row="7" labletext="修改人" name="modifierName" :span="8" xtype="text" lableWidth="110px" :readOnly='true'></pm_form_item>
            <pm_form_item row="7" labletext="修改时间" name="modifyTime" :span="8" xtype="text" lableWidth="110px" :readOnly='true'></pm_form_item>
            <pm_form_item row="7" labletext="业务联系人" name="contactPerson" :span="8" xtype="text" lableWidth="90px"></pm_form_item>
        </pm_form_render>
    </el-main>
    <el-footer style="padding:0px;">
    <!-- toolbar工具条部分 -->
        <pm_tool_bar :noBackground="true">
          <pm_toolButton
            btnName="保存"
            btnIcon="el-icon-success"
            :btnClickFunc="saveInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="取消"
            btnIcon="el-icon-close"
            :btnClickFunc="closeWin"
          ></pm_toolButton>
        </pm_tool_bar>
    </el-footer>
</el-container>
</template>

<script>
    import metro_page from '@/components/vitems/pageContainer/metro_page';
    import metro_page_box from '@/components/vitems/pageContainer/metro_page_box';
    import metro_page_box_tool_bar from '@/components/vitems/pageContainer/metro_page_box_tool_bar';
    import metro_page_box_body from '@/components/vitems/pageContainer/metro_page_box_body';
    import metro_pageheader from '@/components/vitems/pageheader';
    import pm_form_render from '@/components/common/form/pm_form_render';
    import pm_form_item from '@/components/common/form/pm_form_item';
    import pm_search from '@/components/vitems/pageSearch/pm_search';
    import pm_toolButton from "@/components/common/button/pm_toolButton";
    import pm_tool_bar from "@/components/common/table/pm_tool_bar";
    import pm_table from "@/components/common/table/pm_table";
    import pm_column from "@/components/common/table/pm_column";
    import httpUtil from "@/common/utils/HttpUtil";
    import layerUtil from "@/common/utils/LayerUtil";
    import metadata from "@/common/entities/Metadata";
    import pm_pagination from "@/components/common/table/pm_pagination";
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination},
        data: function() {
            var validPhone=(rule, value,callback)=>{
                var reg = /^1[3|4|5|7|8][0-9]\d{8}$/
               if (value && !reg.test(value)){
                    callback(new Error('手机格式不正确'))
                }else {
                    callback()
                }
            }
            return {
                config: {
                  entity: metadata.baseCst
                },
                rules: {},
                editFlag:'',
                //只读状态
                readOnlyStatus:{},
                formModel:Object,
                rules: {
                   contactPersonPhone: [
                        { trigger: 'blur', validator: validPhone}
                   ] 
                },
            }
        },
        created(){
            this.formModel = this.getFormModel();
        },
        watch:{
            'formModel.settleType'(val, oldVal){
                if(val == 2){//现结的货主
                    this.formModel.finalRepayDate = null;
                    this.$refs["finalRepayDate"].readOnly = true;
                }else{
                    this.$refs["finalRepayDate"].readOnly = false;
                }
            }
        },
        methods: {
            getFormModel(){
                let entity = JSON.parse(this.$options.propsData.entity);
                entity.deleteFlag = entity.deleteFlag?1:0;
                this.editFlag = this.$options.propsData.editFlag;
                if(this.editFlag == 'add'){
                    this.$set(entity,"settleType",1);
                    this.readOnlyStatus["deleteFlag"] = true;
                    this.readOnlyStatus["finalRepayDate"] = false;
                }
                else if (this.editFlag == 'update') {
                    this.readOnlyStatus["deleteFlag"] = false;
                    this.readOnlyStatus["finalRepayDate"] = true;
                }
                return entity;
            },
            isReadOnly: function(fieldName){
                return this.readOnlyStatus[fieldName];
            },
            //刷新主单界面方法
            refreshMain: function(){
                this.$options.parent.queryData();
            },
            //保存信息方法
            saveInfo: function(){
                this.$refs.owForm.validate();
                let submitModel = this.formModel;
                let _this = this;
                if(submitModel.settleType == 1 && !submitModel.finalRepayDate){
                    this.$commonUtil.valid.throwEx(this, "统结货主必须填写最后还款日期!");
                }
                if(this.editFlag == "add"){
                    httpUtil.post("cst/addCst",submitModel, data => {
                        this.$message({
                            message: '添加客户成功',
                            type: 'success'
                        });
                        _this.refreshMain();
                        _this.closeWin();
                    });
                }
                else if(this.editFlag == "update"){
                    httpUtil.post("cst/updateCst",submitModel, data => {
                        this.$message({
                            message: '更新客户成功',
                            type: 'success'
                        });
                        _this.refreshMain();
                        _this.closeWin();
                    });
                }
            },
            closeWin:layerUtil.closeWin
        }
    }
</script>

<style scoped>
  
</style>
