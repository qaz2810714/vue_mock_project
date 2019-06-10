<template>
    <el-container style="padding:0">
        <el-main style="padding: 0">
                <pm_form_render :model="formModel" :rules="rules" ref="demoForm" class="search_partition">
                    <pm_form_item row="1" labletext="计费规则单编号" name="regularNo" :span="8" xtype="text" lableWidth="140px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="1" labletext="货主名称" name="cstId" :span="8" xtype="select" lableWidth="140px" required :readOnly='getOnly()'></pm_form_item>
                    <pm_form_item row="1" labletext="货主方联系人" name="cstContractor" :span="8" xtype="text" lableWidth="140px" required></pm_form_item>
                    <pm_form_item row="2" labletext="货主类型" name="cstType" :span="8" xtype="select" lableWidth="140px" required></pm_form_item>
                    <pm_form_item row="2" labletext="外部协议号" name="regularOtherNo" :span="8" xtype="text" lableWidth="140px" watchField='cstType'></pm_form_item>
                    <pm_form_item row="2" labletext="货主方联系电话" name="cstPhone" :span="8" xtype="text" lableWidth="140px" required></pm_form_item>
                    <pm_form_item row="3" labletext="状态" name="regularStatus" :span="8" xtype="radio" :radioGroup="group" lableWidth="140px"></pm_form_item>
                    <pm_form_item row="3" labletext="有效日期" name="agreementStart" :span="4" xtype="date" lableWidth="80px" :pickerOptions='pickerOptions' required></pm_form_item>
                    <pm_form_item row="3" labletext="至" name="agreementEnd" :span="4" xtype="date" lableWidth="60px" :pickerOptions='pickerOptions1'></pm_form_item>
                    <pm_form_item row="3" labletext="仓库所在地址" name="whsAddress" :span="8" xtype="text" lableWidth="140px" required></pm_form_item>
                </pm_form_render>
                <pm_tool_bar>
                    <pm_toolButton btnName ="添加" btnIcon ="el-icon-circle-plus-outline"  :btnClickFunc ='addDetail'></pm_toolButton>
                    <pm_toolButton btnName ="移除" btnIcon ="el-icon-remove-outline"  :btnClickFunc ='deleteRows'></pm_toolButton>
                </pm_tool_bar>

                <pm_table ref="pmTable" tableKey="CostRegularEdit-pmTable" :dataSource="dataSource" :config="config">
                    <pm_column prop="regularDetailNo" label="计费规则明细号" width="200" :canEdit="false"></pm_column>
                    <pm_column prop="brandId" label="品名" width="180" required></pm_column>
                    <pm_column prop="regularType" label="收费项目" width="180" required></pm_column>
                    <pm_column prop="unitprice" label="单价" width="150" required></pm_column>
                    <pm_column prop="regularUnit" label="计费单位" width="120" required watchField='regularType' :canEdit="false"></pm_column>
                    <pm_column prop="whsType" label="仓库类型" width="150" required></pm_column>
                    <pm_column prop="remark" label="备注" width="300"></pm_column>
                </pm_table>
            </el-main>
            <el-footer style="padding:0px;">
            <pm_tool_bar>
                <pm_toolButton btnName ="保存" btnIcon ="el-icon-circle-check-outline" :btnClickFunc ='saveInfo'></pm_toolButton>
                <pm_toolButton btnName ="关闭" btnIcon ="el-icon-error" :btnClickFunc ='closeWin'></pm_toolButton>
            </pm_tool_bar>
            </el-footer>
</el-container>
</template>

<script>
import metro_page from '@/components/vitems/pageContainer/metro_page';
import metro_page_box from '@/components/vitems/pageContainer/metro_page_box';
import metro_page_box_tool_bar from '@/components/vitems/pageContainer/metro_page_box_tool_bar';
import metro_page_box_body from '@/components/vitems/pageContainer/metro_page_box_body';
import pm_form_render from '@/components/common/form/pm_form_render';
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_table from "@/components/common/table/pm_table";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import commonUtil from "@/common/utils/CommonUtils";

export default {
    components: {pm_toolButton,pm_tool_bar,pm_table, pm_column,pm_pagination,pm_form_item},

    data: function(){
        return{
            dataSource: [],
            config: {
                entity: metadata.regular,
                allowEdit: true,
                multiple: false,
                // rowCanEdit: function(obj) {
                // if (obj.cstName == null) return false;
                // return obj.cstName.includes("江阴");
                // return false;
                // }
            },
            rules: {
                    
            },
            oldRegularStatus:0,
            counter:0,
            group:[{key:1,value:"启用"},
                    {key:2,value:"停用"}],
            formModel:null,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            pickerOptions1:{
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            }
        }
    },
    watch:{
       'formModel.agreementStart'(val){
           this.pickerOptions1={
               disabledDate(time) {
                    return time.getTime() < val;
                }
           }
       }
    },
    created(){
        console.log("created:"+new Date());
            //获取数据源
        this.formModel = this.getFormModel();
        console.log(this.formModel);
    },
    computed:{
    },
    methods:{
        getFormModel:function(){
            var entity = this.$options.parent.propsData.entity;
            if(entity.flag===1){
                entity.regularNo = this.$commonUtil.appConst.nullNo;
                this.$set(entity,"agreementStart",new Date());
                this.$set(entity,"agreementEnd",new Date());
                // entity.agreementStart=new Date();
                // entity.agreementEnd=new Date();
                this.dataSource=[];
            }else{
                this.oldRegularStatus=entity.regularStatus;
                this.dataSource = entity.detailList;
            }
            return entity;
        },
        //表单禁用状态
        getOnly:function(){
            var entity= this.formModel;
            var only=false;
            if(entity.flag===1){
                only=false;
            }else{
                only=true;
            }
            return only;
        },
        //刷新主单方法
        refreshMain: function() {
            var parent = this.$options.parent.propsData.parentView;
            if (parent && parent.queryData) {
                parent.queryData();
            }
        },
        addDetail:function(){
            var $this = this;
            if(!$this.dataSource){
                   $this.dataSource = []; 
            }
            var detail = {unitprice:0};
            this.counter += 1;
            detail.index = this.counter;
            $this.dataSource =  $this.dataSource.concat(detail);
        },
        deleteRows: function() {
            //返回选中的数据
            var rows=[];
            var row = this.$refs.pmTable.currentRow;
            if(row==undefined){
                this.$message.error('请选择一笔资料');
                return;
            }
            rows.push(row);
            //从数据源中移除数据
            commonUtil.removeSelectedRows2(rows,this.dataSource);
        },
        saveInfo:function(){
            this.$refs["demoForm"].validate(this);
            var message="";
            var param=this.formModel;
            if(param.regularOtherNo!=undefined){
                if(param.regularOtherNo.length>15){
                    this.$message.error('外部协议号不能大于15位，请检查！');
                    return;
                }
            }
            param.detail=this.dataSource;
            if(param.detail.length===0){
                this.$message.error('请至少添加一笔明细资料');
                return;
            }
            if(param.cstPhone.length!=11)
            {
                this.$message.error("联系电话必须为11位！");
                return;
            }
            if(param.agreementEnd==undefined){
                this.$message.error("请输入有效日期！");
                return;
            }
            if((this.oldRegularStatus==2)&&(param.regularStatus!=1)){
                this.$message.error("停用的计费规则不能修改!");
                return;
            }
            this.$refs.pmTable.validator();
            param.id=undefined;
            if(param.regularNo!="系统自动生成"){
                message="修改计费规则成功"
            }else{
                message="新增计费规则成功"
            }
            param.detail.forEach(element => {
                element.id=undefined;
            });
            httpUtil.post("regular/saveRegular",param, data => {
                this.$message({
                    message: message,
                    type: 'success'
                });
                this.refreshMain();
                this.closeWin();
            });
        },
        closeWin:function(){
            this.$commonUtil.tab.close(this);
        }
    }
    
}
</script>