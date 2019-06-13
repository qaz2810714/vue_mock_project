<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="pageSizes"
      :page-size="realPageSize"
      :layout="layout"
      :total="realTotal"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    queryFunc: {
      required: true,
      type: Function
    },
    pageSize: {
      type: Number,
      default: 25
    },
    layout:{
      type:String,
      default:"total, sizes, prev, pager, next, jumper"
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [25, 50, 100, 200];
      }
    },
    total: {
      type:Number,
      default:0
    }
  },
  computed: {
    realTotal() {
      //判断totalSize是否为数字
      if (this.total != null) {
        var temp = Number(this.total);
        if (!isNaN(temp)) {
          return temp;
        } else {
          return 0;
        }
      }
      return 0;
    }
  },
  mounted() {
    this.realPageSize = this.pageSize;
    //this.queryData(this.curPage - 1, this.realPageSize);
  },
  methods: {
    handleSizeChange(val) {
      this.realPageSize = val;
      this.curPage = 1;
      this.queryFunc(this.curPage - 1, this.realPageSize);
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.queryFunc(this.curPage - 1, this.realPageSize);
    },
    refreshData() {
      this.curPage = 1;
      this.queryFunc(this.curPage - 1, this.realPageSize);
    },
    getCurPage(){
      return this.curPage;
    }
  },
  data() {
    return {
      curPage: 1,
      realPageSize:25
    };
  }
};
</script>
