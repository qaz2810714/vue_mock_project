<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="pageSizes"
      :page-size="realPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="realTotal"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    queryData: {
      required: true,
      type: Function
    },
    pageSize: {
      type: Number,
      default: 25
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [25, 50, 100, 200];
      }
    },
    totalSize: null
  },
  computed: {
    realTotal() {
      //判断totalSize是否为数字
      if (this.totalSize != null) {
        var temp = Number(this.totalSize);
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
      this.queryData(this.curPage - 1, this.realPageSize);
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.queryData(this.curPage - 1, this.realPageSize);
    },
    refreshData(param) {
      this.curPage = 1;
      this.queryData(this.curPage - 1, this.realPageSize,param);
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
