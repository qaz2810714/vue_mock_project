<template>
<el-container style="padding:5px;">
    <el-main style="padding:10px;">
        <pm_form_render ref='lpForm' :model="formModel" :rules="rules" :entity='config.entity'>
            <pm_form_item ref="form_level" row="1" labletext="级别" name="level" :span="12" xtype="select" lableWidth="70px" ></pm_form_item>
            <pm_form_item  row="1" labletext="代码" required name="code" :span="12" xtype="text" lableWidth="90px"></pm_form_item>
            <pm_form_item row="2" labletext="名称" required name="name" :span="12" xtype="text" lableWidth="70px"></pm_form_item>
            <pm_form_item ref="form_whs" row="2" labletext="所选库房" name="whsRoomId" :span="12" xtype="select" lableWidth="90px"></pm_form_item>
            <pm_form_item ref="form_type" row="3" labletext="类型" name="type" :span="12" xtype="select" lableWidth="70px"></pm_form_item>
            <pm_form_item row="3" labletext="备注" name="remark" :span="12" xtype="text" lableWidth="90px"></pm_form_item>
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
            return {
                config: {
                  entity: metadata.storeLocation
                },
                rules: {},
                editFlag:'',
                //只读状态
                readOnlyStatus:{},
                formModel:null
            }
        },
        watch:{
            'formModel.level'(){
                //如果级别选择的是库房，则不需要选择库房
                if(this.formModel.level == 1 && this.editFlag == 'add'){
                    this.$refs['form_whs'].readOnly = true;
                    this.$refs['form_type'].readOnly = false;
                    this.$set(this.formModel,"whsRoomId",null);
                }else if(this.formModel.level == 2 && this.editFlag == 'add'){//如果级别选择的是库区，则不需要选择类型
                    this.$refs['form_whs'].readOnly = false;
                    this.$refs['form_type'].readOnly = true;
                    this.$set(this.formModel,"type",null);
                }
            }
        },
        mounted:function(){
            this.editFlag = this.$options.propsData.editFlag;
            if(this.editFlag == 'add'){
                this.$set(this.formModel,"level",1);
            }
            else if (this.editFlag == 'update') {
                this.$refs['form_level'].readOnly = true;
                this.$refs['form_whs'].readOnly = true;
                this.$refs['form_type'].readOnly = true;
            }
        },
        created(){
            //初始化formModel
            if(this.formModel == null){
                let entity = JSON.parse(this.$options.propsData.entity);
                if(!entity.type){
                    this.$set(entity,'type',1);
                }             
                this.formModel = entity;
            }
        },
        methods: {
            //刷新主单界面方法
            refreshMain: function(){
                this.$options.parent.queryData();
            },
            //保存信息方法
            saveInfo: function(){
                this.$refs.lpForm.validate();
                let submitModel = this.formModel;
                let _this = this;
                if(this.editFlag == "add"){
                    if(submitModel.level == 2){//如果是库区 库房必填
                        if(!submitModel.whsRoomId){
                            this.$commonUtil.valid.throwEx(this,"新增库区级别信息,所选库房必填！");
                        }
                    }
                    httpUtil.post("store/addStoreLocation",submitModel, data => {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        _this.refreshMain();
                        _this.closeWin();
                    });
                }
                else if(this.editFlag == "update"){
                    httpUtil.post("store/updateStoreLocatin",submitModel, data => {
                        this.$message({
                            message: '更新成功',
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
