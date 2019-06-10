<template>
<el-container style="padding:5px;">
    <el-main style="padding:10px;">
        <pm_form_render ref="dicForm" :model="formModel" :rules="rules" :entity='config.entity'>
            <pm_form_item row="1" labletext="字典分类" name="className" :span="12" xtype="text" lableWidth="90px" :readOnly="true"></pm_form_item>
            <pm_form_item row="1" labletext="排序" name="order" :span="12" xtype="text" lableWidth="90px"></pm_form_item>
            <pm_form_item row="2" labletext="字典项名称" name="itemName" :span="12" xtype="text" lableWidth="90px" required></pm_form_item>
            <pm_form_item row="2" labletext="字典值" name="itemValue" :span="12" xtype="text" lableWidth="90px" required></pm_form_item>
            <pm_form_item row="3" labletext="字典项编码" name="itemCode" :span="12" xtype="text" lableWidth="90px"></pm_form_item>
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
    import metadata from "@/common/entities/Metadata";
    import layerUtil from "@/common/utils/LayerUtil";
    import pm_pagination from "@/components/common/table/pm_pagination";
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination},
        data: function() {
            return {
                config: {
                  entity: metadata.baseDictionary
                },
                rules: {},
                editFlag:'',
                //只读状态
                readOnlyStatus:{},
                formModel:Object
            }
        },
        computed:{
        },
        created(){
            this.formModel = this.getFormModel();
        },
        methods: {
            getFormModel:function(){
                var entity = JSON.parse(this.$options.propsData.entity);        
                return entity;
            },
            saveInfo: function(){
                this.$refs.dicForm.validate();
                if(this.formModel.editFlag == 'add'){//新增
                    httpUtil.post("dict/addDicEntity", this.formModel,data => {
                        this.$message({
                            message: '新增字典成功',
                            type: 'success'
                        });
                        this.refreshMain();
                        this.closeWin();
                    });
                }else{//修改
                    httpUtil.post("dict/updateDicEntity", this.formModel,data => {
                        this.$message({
                            message: '修改字典成功',
                            type: 'success'
                        });
                        this.refreshMain();
                        this.closeWin();
                    });
                }
            },
            refreshMain:function(){
                let parent = this.$options.parent;
                if (parent && parent.queryData) {
                    parent.queryData();
                }
            },
            closeWin:layerUtil.closeWin
        }
    }
</script>

<style scoped>
  
</style>
