<template>
    <div>
        <el-table 
            :stripe="true" 
            :border="true"
            :data="data" style="width: 100%">
            <template v-for="column in columns">
                <el-table-column :fixed="column.fixed" :key="column.field" :prop="column.field" :label="column.name" :width="column.width">
                </el-table-column>
            </template>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPageNo"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
    </div>
</template>

<script>
import {Table, TableColumn, Input, InputNumber, Select, Pagination} from 'element-ui';
export default {
    components: {
        'el-table': Table, 'el-table-column': TableColumn,
        'el-input': Input, 'el-input-number': InputNumber, 
        'el-select': Select, 'el-pagination': Pagination},
    props: {
        // 是否带有checkbox选择框
        checkbox: {type: Boolean, default: false},
        // 是否编辑状态
        editable: {type: Boolean, default: false},
        // table的column列定义
        columns: {type: Array, default:[{field: 'undefine', name: '未定义列'}]},
        // table的行数据【备注：不同的行column有特殊需求时，可在data行中覆盖columns中的配置】
        data: {type: Array, default: []},
        // 当前显示第几页
        currentPageNo: 2
    },
    data() {
        return {
        }
    },
    methods: {
        handleSizeChange: function() {},
        handleCurrentChange: function() {},
    }
}
</script>

<style scoped>
/* .el-pagination {
    background-color: #EEE
}
.el-table td, .el-table th {
    padding-bottom: 2px;
    padding-top: 2px;
    font-size: 14px;
    text-align: center;
}
.el-table th {
    background-color: #888;
    color: white;
    font-weight: bold;
} */
</style>
<style lang="scss">
    @import "~scss_vars";
    .el-table thead th{
        background: #d9d9d9;
        color: $color-primary;
        font-weight: bold;
    }
    .el-table--mini th {
        padding: 2px 0;
        padding: 3px 0 0;
        font-size: 12px;
    }
    .el-table--mini td {
        padding: 3px 0;
    }
    .el-table--mini tbody{
        tr:nth-child(even){
            background:#f2f2f3;
        }
    }
    .el-table{
        .el-select{
            display:inherit;
        }
    }
    .el-pagination{
        background: #f3f3f3;
    }
    .el-table__footer tbody td{
        background-color: #fff;
    }
</style>


