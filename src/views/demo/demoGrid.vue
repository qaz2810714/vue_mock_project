<template>
    <metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body>
                <!-- 条件区域封装控件 -->
                <pm_search ref="pm_search" :packRowHeight="5" :fields="searchFields" v-on:getAllSearchParams="queryData"></pm_search>
                <pm_form_render :model="formModel" :rules="rules" ref="demoForm">
                    <pm_form_item row="1" labletext="文本1" name="text1" :span="20" xtype="text" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="2" labletext="文本2" name="text2" :span="10" xtype="text" lableWidth="70px" required></pm_form_item>
                    <pm_form_item row="2" labletext="文本3" name="text3" :span="10" xtype="text" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="3" labletext="number" name="number" :span="6" xtype="number" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="3" labletext="date" name="date" :span="6" xtype="date" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="3" labletext="daterange" name="daterange" :span="6" xtype="daterange" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="3" labletext="datetime" name="datetime" :span="6" xtype="datetime" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="4" labletext="datetimerange" name="datetimerange" :span="8" xtype="datetimerange" lableWidth="100px"></pm_form_item>
                    <pm_form_item row="4" labletext="select" name="select" :span="8" xtype="select" lableWidth="70px" :options='whsinOptions' required></pm_form_item>
                    <pm_form_item row="5" labletext="select_batch" name="select_batch" :span="10" xtype="select_batch" lableWidth="150px" :options='whsinOptions' required></pm_form_item>
                    <pm_form_item row="5" labletext="品名" name="brandId" :span="10" xtype="search_select_input" lableWidth="150px"></pm_form_item>
                </pm_form_render>
                <el-button @click="getParam">按钮</el-button>
            </metro_page_box_body>
        </metro_page_box>

        <!-- 数据展示区域 -->
        <metro_page_box>
            <!-- toolbar工具条部分 -->
            <metro_page_box_tool_bar :buttons="toolbar_buttons"></metro_page_box_tool_bar>
            <!-- body内容区域 -->
            <metro_page_box_body>
                <!-- table结构展示 -->
                <x_table :checkbox=true :columns="columns" :data="data">
                </x_table>
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
    import Table from '@/components/common/table/Table';
    import pm_form_render from '@/components/common/form/pm_form_render';
    import pm_form_item from '@/components/common/form/pm_form_item';
    import pm_search from '@/components/vitems/pageSearch/pm_search';
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader, 'x_table':Table,pm_search,pm_form_item},
        data: function() {
            return {
                whsinOptions:
                        [{
                        value: 1,
                        label: '移库'
                        }, {
                        value: 2,
                        label: '过户'
                        }, {
                        value: 3,
                        label: '入库'
                    }],
                formModel: {
                    text1:'',
                    text2:'',
                    text3:'',
                    select_batch:[],
                    brandId:null,
                    textureId:''
                },
                rules: {
                    text1: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                },
                // 搜索区域条件
                searchFields: [
                    {displayName: 'text1', fieldName: 'name', xtype:'text', searchLoc:'1-1-6-8-0'},
                    {displayName: 'text2', fieldName: 'age', xtype:'text', searchLoc:'1-2-6-8-0'},
                    {displayName: 'number', fieldName: 'number', xtype:'number',min:1,max:100, searchLoc:'1-3-6-8-0'},
                    {displayName: 'date', fieldName: 'date', xtype:'date', searchLoc:'1-4-6-8-0'},
                    {displayName: 'daterange', fieldName: 'daterange', xtype:'daterange', searchLoc:'2-1-6-8-0'},
                    {displayName: 'datetime', fieldName: 'datetime', xtype:'datetime', searchLoc:'2-2-6-8-0'},
                    {displayName: 'datetimerange', fieldName: 'datetimerange', xtype:'datetimerange', searchLoc:'2-3-6-8-0'},
                    {displayName: 'select', fieldName: 'brandId', xtype:'select', searchLoc:'2-4-6-8-0'},
                     {displayName: 'select_batch', fieldName: 'select_batch', xtype:'select_batch', searchLoc:'3-1-6-8-0',options:
                        [{
                        value: 1,
                        label: 'cyt'
                        }, {
                        value: 2,
                        label: 'ck'
                        }, {
                        value: 3,
                        label: 'sy'
                        }, {
                        value: 4,
                        label: 'smm'
                    }]},
                    {displayName: '品名', fieldName: 'brandId', xtype:'search_select_input', searchLoc:'3-2-6-8-0'},
                    {displayName: '材质', fieldName: 'textureId', xtype:'search_select_input', searchLoc:'3-3-6-8-0'},
                    {displayName: '产地', fieldName: 'producingId', xtype:'search_select_input', searchLoc:'4-1-6-8-0'},
                    {displayName: '用户', fieldName: 'userId', xtype:'search_select_input', searchLoc:'4-2-6-8-0'},
                    {displayName: '捆包号', fieldName: 'fPackNo', xtype:'textarea', searchLoc:'3-4-6-8-0'},
                    {displayName: '', fieldName: 'btn_search', xtype:'btn', searchLoc:'4-4-8-8-4'}
                ],               
                // toolbar菜单定义（改变此处将动态改变菜单）
                toolbar_buttons: [
                    {name: "新增",permission:"btn_add", icon: 'el-icon-circle-plus-outline', click_func: this.btn_func_search, color: 'green', align: 'left'},
                    {name: "修改", icon: 'el-icon-edit', click_func: this.btn_func_reset, color: 'green', align: 'left'},
                    {name: "导出", icon: 'el-icon-document', click_func: this.btn_func_search, color: 'blue',align: 'left'},
                    {name: "审核", icon: 'el-icon-circle-check-outline', click_func: this.btn_func_search, color: 'blue',align: 'left'},
                    {name: "调整", icon: 'el-icon-edit-outline', click_func: this.btn_func_search, color: 'blue',align: 'left'},
                    {name: "结算", icon: 'el-icon-sold-out', click_func: this.btn_func_search, color: 'red',align: 'left'}
                ],
                // table表格显示的列
                columns: [
                    {fixed:true, name: '固定列1', field: 'id', width:80},
                    {fixed:true, name: '固定列2', field: 'name', width:100},
                    {name: '滑动列1', field: 'price', width:150},
                    {name: '滑动列2', field: 'id1', width:200},
                    {name: '滑动列3', field: 'name1', width:200},
                    {name: '滑动列4', field: 'price1', width:200},
                    {name: '滑动列5', field: 'id2', width:200},
                    {name: '滑动列6', field: 'name2', width:200},
                    {name: '滑动列7', field: 'price2', width:200},
                    {name: '滑动列8', field: 'id3', width:200},
                    {name: '滑动列9', field: 'name3', width:200},
                    {name: '滑动列10', field: 'price3', width:200},
                    {name: '滑动列11', field: 'id4', width:200},
                    {name: '滑动列12', field: 'name4', width:200},
                    {name: '滑动列13', field: 'price4', width:200}
                ],
                // table表格显示的数据
                data: [
                    {"id": 9, "name": "Item 0", "price": "$0",
                        "id1": 91, "name1": "Item 0", "price1": "$0",
                        "id2": 92, "name2": "Item 0", "price2": "$0",
                        "id3": 93, "name3": "Item 0", "price3": "$0",
                        "id4": 94, "name4": "Item 0", "price4": "$0"
                    },
                    { "id": 1, "name": "Item 1", "price": "$1",
                        "id1": 11, "name1": "Item 1", "price1": "$1",
                        "id2": 12, "name2": "Item 1", "price2": "$1",
                        "id3": 13, "name3": "Item 1", "price3": "$1",
                        "id4": 14, "name4": "Item 1", "price4": "$1"
                    },
                    {
                        "id": 2,
                        "name": "Item 2",
                        "price": "$2",
                        "id1": 91, "name1": "Item 0", "price1": "$0",
                        "id2": 92, "name2": "Item 0", "price2": "$0",
                        "id3": 93, "name3": "Item 0", "price3": "$0",
                        "id4": 94, "name4": "Item 0", "price4": "$0"
                    },
                    {
                        "id": 3,
                        "name": "Item 3",
                        "price": "$3",
                        "id1": 91, "name1": "Item 0", "price1": "$0",
                        "id2": 92, "name2": "Item 0", "price2": "$0",
                        "id3": 93, "name3": "Item 0", "price3": "$0",
                        "id4": 94, "name4": "Item 0", "price4": "$0"
                    },
                    {
                        "id": 4,
                        "name": "Item 4",
                        "price": "$4",
                        "id1": 91, "name1": "Item 0", "price1": "$0",
                        "id2": 92, "name2": "Item 0", "price2": "$0",
                        "id3": 93, "name3": "Item 0", "price3": "$0",
                        "id4": 94, "name4": "Item 0", "price4": "$0"
                    },
                    {
                        "id": 5,
                        "name": "Item 5",
                        "price": "$5",
                        "id1": 91, "name1": "Item 0", "price1": "$0",
                        "id2": 92, "name2": "Item 0", "price2": "$0",
                        "id3": 93, "name3": "Item 0", "price3": "$0",
                        "id4": 94, "name4": "Item 0", "price4": "$0"
                    }
                ]
            }
        },
        methods: {
            btn_func_search: function() {},
            btn_func_reset: function() {},
            queryData: function(data){
                console.log(data);              
            },
	        btn_func_export:function(data){
                this.exportExcel(data);
            },
            exportExcel: data => {
            return httpUtil.export("/api/whsTransfer/getTransferNoteByPage", 
            {
                transferNo:"0002",
                page:0,
                size:25
            }, callback => {
                //回调
                console.log(callback)
            })},
            getParam:function(){
                console.log(this.formModel);
                this.$refs["demoForm"].validate();
            }
        }
    }
</script>

<style scoped>
    /* .page-content {
        background-color: #E8E8E8;
    }
    .container-fluid {
        padding: 5px;
    }
    .portlet {
        margin-bottom: 5px;
    }
    .portlet-title {
        background-color: #F3F3F3 !important;
    }
    .portlet-title .left {
        float: left;
    }
    .btn, .portlet-title .actions > .btn { 
        padding: 2px 6px;
    }
    .form-inline {
        display: inline-block;
    } */
</style>
