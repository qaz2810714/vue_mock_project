<template>
    <metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body>
                <pm_form_render :model="formModel" :rules="rules" ref="pwForm" :entity='config.entity'>
                    <pm_form_item row="1" labletext="品名" name="brandId" :span="8" xtype="search_select_input" lableWidth="70px" required></pm_form_item>
                    <pm_form_item row="1" labletext="重量" name="weight" :span="8" xtype="number" max='9999' lableWidth="70px" required></pm_form_item>
                    <pm_form_item row="1" labletext="规格" name="spec" :span="8" xtype="text" lableWidth="70px" required></pm_form_item>
                    <pm_form_item row="2" labletext="理算方式" name="adjustmentType" :span="8" xtype="select" lableWidth="98px" required></pm_form_item>
                    <pm_form_item ref='form_amount' row="2" labletext="单包支数" name="amount" :span="8" xtype="number" lableWidth="98px"></pm_form_item>
                    <pm_form_item row="2" labletext="产地" name="producingId" :span="8" xtype="search_select_input" lableWidth="70px"></pm_form_item>
                </pm_form_render>
                <pm_tool_bar>
                    <pm_toolButton btnName ="保存" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='btn_save'></pm_toolButton>
                    <pm_toolButton btnName ="取消" btnIcon ="el-icon-edit" :btnClickFunc ='closeWin'></pm_toolButton>
                </pm_tool_bar>
            </metro_page_box_body>
        </metro_page_box>

    </metro_page>
    
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
    import pm_pagination from "@/components/common/table/pm_pagination";
    import cacheUtil from "@/common/utils/CacheUtil";
    import layerUtil from "@/common/utils/LayerUtil";
    import commonUtil from "@/common/utils/CommonUtils";
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination},
        data: function() {
            return {
                formModel:{},
                config: {
                  entity: metadata.physicalWeight,
                },
                rules: {
                    brandId: [
                        { required: true, message: "请输入品名", trigger: "blur" }
                    ],
                    weight: [
                        { required: true, message: "请输入重量", trigger: "blur" }
                    ],
                    spec: [
                        { required: true, message: "请输入规格", trigger: "blur" }
                    ],
                    adjustmentType: [
                        { required: true, message: "请输入理算方式", trigger: "blur" }
                    ]
                    // amount: [
                    //     { required: true, message: "请输入单包支数", trigger: "blur" }
                    // ]
                }
            }
        },
        watch:{
            'formModel.adjustmentType'(){
                if(this.formModel.adjustmentType == 2){
                    //如果理算方式为支 单包支数为1 且不可编辑
                    this.$set(this.formModel,"amount",1);
                    this.$refs['form_amount'].readOnly = true;
                }else{
                   //如果理算方式为支 单包支数为1 且不可编辑
                    this.$set(this.formModel,"amount",null);
                    this.$refs['form_amount'].readOnly = false; 
                }
            }
        },
        created:function(){
            this.formModel=this.getFormModel();
        },
        methods: {
            //获取数据源
            getFormModel:function(){
                var entity = JSON.parse(this.$options.propsData.entity);        
                return entity;
            },
            refreshList:function(){
                this.$options.parent.refreshList();
                this.closeWin();
            },
            btn_save: function() {
            //准备修改数据
            var data = this.$commonUtil.deepClone(this.formModel);

            let $this=this;
            //todo 加材质字段
            this.$refs["pwForm"].validate(this,valid => {

                //组装请求参数对象  
                var brandNameList= cacheUtil.getDic().BrandNameList.list;
                data.name= brandNameList.filter(item => item.id === $this.formModel.brandId)[0].name;
                var placeList= cacheUtil.getDic().PlaceList.list;
                if(!$this.$commonUtil.IsNull($this.formModel.producingId)){
                    data.producingArea= placeList.filter(item => item.id === $this.formModel.producingId)[0].placeFullName;
                }

                if(data.adjustmentType == 1 && this.$commonUtil.IsNull($this.formModel.producingId)){
                    this.$commonUtil.valid.throwEx("理算方式为按件方式,产地不可以为空！");
                }
                if (data.id == null) {
                        this.$httpUtil.post("base/addBasePhysicalWeight", data, result => {
                            this.$message({
                                message: '理重新增成功!',
                                type: 'success'
                            });
                            this.refreshList();
                        });
                } else {
                        this.$httpUtil.post("base/updateBasePhysicalWeight", data, result => {
                            this.$message({
                                message: '理重编辑成功!',
                                type: 'success'
                            });
                            this.refreshList();
                        });
                }
            });

            },
            closeWin: layerUtil.closeWin,
        }
    }
</script>

<style> 
.vl-notify-content{overflow:hidden!important;}
</style>
