<template>
<metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
        <metro_page_box_body>
	        <pm_search ref="pm_search" :btnOffset='13' :packRowHeight="5" :fields="searchFields" v-on:getAllSearchParams="queryData"></pm_search>
        </metro_page_box_body>
    </metro_page_box>
    <!-- 数据展示区域 -->
    <metro_page_box>
        <pm_tool_bar>
            <pm_toolButton btnName ="新增" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='addTab'></pm_toolButton>
            <pm_toolButton btnName ="复制" btnIcon ="el-icon-document" :btnClickFunc ='copyInfo'></pm_toolButton>
            <pm_toolButton btnName ="作废" btnIcon ="el-icon-circle-close-outline" :btnClickFunc ='deleteInfo' ></pm_toolButton>
        </pm_tool_bar>
    <!-- body内容区域 -->
        <metro_page_box_body>
    <!-- table结构展示 -->
            <pm_table ref="pmTable" :dataSource="dataSource" tableKey="CostRegularManage-pmTable"
                :reload="afterSetting" v-if="reload" :config="config">
                <pm_column prop="regularNo" label="计费规则编号" width="120"></pm_column>
                <pm_column prop="cstId" label="货主名称" width="186"></pm_column>
                <pm_column prop="agreementStart" label="计费有效期开始日期" width="160"></pm_column>
                <pm_column prop="agreementEnd" label="计费有效期结束日期" width="160"></pm_column>
                <pm_column prop="cstContractor" label="货主方联系人" width="125"></pm_column>
                <pm_column prop="cstPhone" label="货主方联系电话" width="132"></pm_column>
                <pm_column prop="regularStatus" label="状态" width="75"></pm_column>
                <pm_column prop="regularVersion" label="计费版本号" width="120"></pm_column>
            </pm_table>
            <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
        </metro_page_box_body>
    </metro_page_box>
</metro_page>
</template>

<script>
import pm_search from '@/components/vitems/pageSearch/pm_search';
import metro_page from '@/components/vitems/pageContainer/metro_page';
import metro_page_box from '@/components/vitems/pageContainer/metro_page_box';
import metro_page_box_tool_bar from '@/components/vitems/pageContainer/metro_page_box_tool_bar';
import metro_page_box_body from '@/components/vitems/pageContainer/metro_page_box_body';
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import costRegularEdit from "./CostRegularEdit";
import { tableReload } from "@/components/common/table/table-reload";
export default {
    components: {metro_page, metro_page_box, metro_page_box_tool_bar,
			metro_page_box_body,pm_search,pm_toolButton,pm_tool_bar,pm_table, pm_column,pm_pagination},
    mixins: [tableReload],
    data: function(){
        return{
            dataSource: [],
            // 搜索区域条件
            searchFields: [
                {displayName: '货主名称', fieldName: 'cstId', xtype:'search_select_input', searchLoc:'1-1-6-8-0'},
                {displayName: '计费规则编号', fieldName: 'regularNo', xtype:'text', searchLoc:'1-2-6-9-0'},
                {displayName: '外部协议号', fieldName: 'regularOtherNo', xtype:'text', searchLoc:'1-3-6-8-0'},
                {displayName: '状态', fieldName: 'regularStatus', xtype:'select', searchLoc:'1-4-6-8-0', value:1},
                {displayName: '', fieldName: 'btn_search', xtype:'btn', searchLoc:'2-4-8-8-20'}
            ],
            config: {
                entity: metadata.regular,
                allowEdit: false,
                multiple: false,
                showSummary: false,
                dbclick: this.editTab,
                rowCanEdit: function(obj) {
                if (obj.cstName == null) return false;
                return obj.cstName.includes("江阴");
                return false;
                }
            },
            totalSize:0,
        }
    },
    methods:{
        queryData: function() {     
            this.$refs.pager.refreshData();
        },
        getList: function(page,size) {
            var param = this.$refs.pm_search.getParam();
            param.page = page;
            param.size = size;
            var table = this;
                httpUtil.post("regular/qureyRegularData", param, data => {
                    table.dataSource = data.content;
                    table.totalSize = data.total
            });
            //this.queryData(param);           
        },
        //打开创建计费规则单 tab页
        addTab:function(){
            var $this=this;
            const regularItem = {
                component: costRegularEdit,
                propsData:{entity:{flag:1,cstType:1},
                        parentView: $this},
                name: "添加计费规则",
            }
            this.$tab.open(regularItem);
        },
        //打开编辑计费规则单 tab页
        editTab:function(row,event){
            var $this = this;
            let queryData = this.$commonUtil.deepClone(row);
                this.$commonUtil.getDetailEntity("regular/qureyRegularDetail",
                    {regularNo:row.regularNo},
                    queryData,
                    function(entity){
                        entity.editFlag = '1';
                        $this.$tab.open({
                            component: costRegularEdit,
                            name: '编辑计费规则',
                            propsData: {entity,parentView:$this},
                        });
                    });
        },
        //复制计费规则
        copyInfo(){
            //获取当前选中数据id
            var row = this.$refs.pmTable.currentRow;
            if(!row){
                return;
            }
            if(row.id){
                row.id=null;
            }
            let table = this;
            //发送请求删除数据
            httpUtil.post("regular/copyRegular",row, data => {
                this.$message({
                    message: '复制计费规则成功',
                    type: 'success'
                });
                table.queryData();
            });
        },
        //作废计费规则
        deleteInfo(){
            //获取当前选中数据id
            var row = this.$refs.pmTable.currentRow;
            if(!row){
                return;
            }
            let table = this;
            //发送请求删除数据
            httpUtil.post("regular/deleteRegular",row, data => {
                this.$message({
                    message: '作废计费规则成功',
                    type: 'success'
                });
                table.queryData();
            });
        },
    }
    
}
</script>