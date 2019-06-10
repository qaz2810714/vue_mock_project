<template>
    <metro_page>
    <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body>
	            <pm_search ref="pm_search" :btnOffset='4' :packNoSearchSpan='5' :hasPackNoSearch='true' :packRowHeight="4" :fields="searchFields" v-on:getAllSearchParams="queryData"></pm_search>
            </metro_page_box_body>
        </metro_page_box>
        <!-- 按钮区域 -->
        <metro_page_box>
        <!-- body内容区域 -->
        <metro_page_box_body>
        <!-- table结构展示 -->
            <pm_table ref="pmTable" tableKey="CostSelectItem-pmTable" :dataSource="dataSource" :config="config" :bottomHeight="80">
                <pm_column prop="businessNo" label="业务单据号" width="150"></pm_column>
                <pm_column prop="packNo" label="捆包号" width="150"></pm_column>
                <pm_column prop="whsDayNum" label="仓储天数" width="150"></pm_column>
                <pm_column prop="whsFreeDayNum" label="免仓储天数" width="150"></pm_column>
                <pm_column prop="transferNum" label="过户次数" width="150"></pm_column>
                <pm_column prop="balancePreNum" label="待结算量" width="150"></pm_column>
                <pm_column prop="costType" label="费用类型" width="150"></pm_column>
                <pm_column prop="unitprice" label="结算单价" width="150"></pm_column>
                <pm_column prop="regularUnit" label="计费单位" width="150"></pm_column>
                <pm_column prop="numFin" label="商品数量" width="150"></pm_column>
				        <pm_column prop="businessType" label="业务类型" width="150"></pm_column>
                <pm_column prop="createDate" label="计费单生成日期" width="150"></pm_column>
                <pm_column prop="regularDetailNo" label="价格规则明细号" width="150"></pm_column>
                <pm_column prop="oriPackNo" label="原捆包号" width="150"></pm_column>
                <pm_column prop="cardNo" label="卡号" width="150"></pm_column>
                <pm_column prop="brandId" label="品名" width="150"></pm_column>
                <pm_column prop="textureId" label="材质" width="150"></pm_column>
                <pm_column prop="spec" label="规格" width="150"></pm_column>
                <pm_column prop="producingId" label="产地" width="150"></pm_column>
                <pm_column prop="whsInFirstDate" label="入库日期" width="150"></pm_column>
                <pm_column prop="transferDate" label="过户日期" width="150"></pm_column>
				        <pm_column prop="cstId" label="货主单位" width="200"></pm_column>
            </pm_table>
            <pm_tool_bar  :noBackground="true">
            <pm_toolButton btnName ="保存" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='saveInfo'></pm_toolButton>
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
    import pm_search from '@/components/vitems/pageSearch/pm_search';
    import pm_toolButton from "@/components/common/button/pm_toolButton";
    import pm_tool_bar from "@/components/common/table/pm_tool_bar";
    import pm_table from "@/components/common/table/pm_table";
    import pm_column from "@/components/common/table/pm_column";
    import httpUtil from "@/common/utils/HttpUtil";
    import metadata from "@/common/entities/Metadata";
    import cacheUtil from "@/common/utils/CacheUtil";
    import pm_pagination from "@/components/common/table/pm_pagination";
    import layerUtil from "@/common/utils/LayerUtil";
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination},
        data: function() {
            return {
                dataSource: [],
                // 搜索区域条件
                searchFields: [
                    {displayName: '费用类型', fieldName: 'costType', xtype:'select', searchLoc:'1-1-8-8-0'},
                    {displayName: '业务类型', fieldName: 'businessType', xtype:'select', searchLoc:'1-2-8-8-0'},
                    {displayName: '单据号', fieldName: 'businessNo', xtype:'text', searchLoc:'1-3-8-8-0'},
                    {displayName: '货主单位', fieldName: 'cstId', xtype:'search_select_input', searchLoc:'2-1-8-8-0'},
                    {displayName: '生成日期', fieldName: 'createDate', xtype:'daterange', searchLoc:'2-2-16-4-0',},
                ],
                config: {
                  entity: metadata.regular,
                  allowEdit: false,
                  multiple: true,
                  rowCanEdit: function(obj) {
                    if (obj.cstName == null) return false;
                    return obj.cstName.includes("江阴");
                    return false;
                  }
                },
                rules: {
                },
                formReadOnly:false,
                totalSize:0,
                formModel:null,
                cstIdNo:null,
            }
        },
        created(){
          //this.formModel= JSON.parse(this.$options.propsData.entity);
          this.formModel= JSON.parse(this.$options.propsData.entity);
          this.cstIdNo=this.getCstId();
          this.searchFields.forEach(a=>{
            if(a.fieldName=="cstId"){
              this.$set(a,"value",this.cstIdNo);
              //a.value=this.cstIdNo;
            }
          });
        },
        computed:{
          // getCstId(){
          //   this.cstIdNo=this.getCstId();
          //   return this.cstIdNo;
          // }
  		  },
        methods: {
            getCstId(){
              return this.formModel.cstIdNo;
            },
            queryData: function(param) {
              var param = this.$refs.pm_search.getParam();
              param.createDateStart=param.createDateBegin;
              var table = this;
              httpUtil.post("BalanceList/queryPreBalanceList", param, data => {
                data.forEach(a=>{
                  a.material=parseInt(a.material);
                  a.textureId=a.material;
                  a.productPlace=parseInt(a.productPlace);
                  a.producingId=a.productPlace;
                  if(!a.transferNum){
                    a.transferNum=0;
                  }
                });
                table.dataSource = data;
                //table.totalSize = data.total
              });
            },
            cellCanEdit: function(obj) {
              return obj.packNo.includes("123");
            },
            getTableInfo: function(row) {
              console.log(row);
            },
            getList: function(page,size) {
              var param = this.$refs.pm_search.getParam();
              param.page = page;
              param.size = size;
              this.queryData(param);
            },
            closeWin: layerUtil.closeWin,
            saveInfo:function(){
                //返回选中的数据
                var rows = this.$refs.pmTable.getSelectedRows();
                if(rows.length==0){
                  this.$message.error('请至少选择一笔资料！');
                  return;
                }
                //触发选中事件
                this.$options.propsData.selected(rows);
                //关闭系统
                this.closeWin();
            }
        }
    }
</script>