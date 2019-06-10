<template>
  <div>
    <pm_table ref="pmTable" :dataSource="dataSource" :config="config">
      <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
      :callback="requestTransactionLogs" renderType="input"></vue_column>-->
      <pm_column prop="packNo" label="捆包号" :cellCanEdit="cellCanEdit" width="200" placeholder="请输入捆包号"></pm_column>
      <pm_column prop="cstId" label="货主单位" width="200" placeholder="请输入货主内容"></pm_column>
      <pm_column prop="skuCode" label="sku" width="200" placeholder></pm_column>
      <pm_column prop="spec" label="规格" width="200" placeholder></pm_column>
      <pm_column prop="textureId" label="材质" width="200" placeholder></pm_column>
      <pm_column prop="status" label="状态" width="200" placeholder></pm_column>
      <pm_column prop="whsinTime" label="入库时间" width="200" placeholder></pm_column>
      <pm_column prop="number" label="数量" :min="0" :step="1" width="200" placeholder></pm_column>
      <pm_column prop="netWeight" label="净重" :min="0" :step="0.001" width="200" placeholder></pm_column>
      <pm_column prop="oper" label="操作" width="200" placeholder>
        <el-button slot-scope="scope" @click="getTableInfo(scope.row)">触发事件</el-button>
      </pm_column>
    </pm_table>
    <pm_pagination :totalSize="totalSize" :queryData="getStocks"></pm_pagination>
  </div>
</template>

<script>
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import httpUtil from "../../common/utils/HttpUtil";
import metadata from "../../common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
export default {
  components: { pm_table, pm_column,pm_pagination },
  data() {
    return {
      dataSource: [],
      config: {
        entity: metadata.wmsStock,
        allowEdit: true,
        multiple: true,
        rowCanEdit: function(obj) {
          if (obj.cstName == null) return false;
          return obj.cstName.includes("江阴");
        }
      },
      totalSize:0,
    };
  },
  mounted() {
  },
  methods: {
    requestTransactionLogs: function(obj) {
      console.log(obj);
    },
    cellCanEdit: function(obj) {
      return obj.packNo.includes("123");
    },
    getStocks: function(page,size) {
      var table = this;
      httpUtil.post("stock/getList", { page: page, size: size }, data => {
        table.dataSource = data.content;
        table.totalSize = data.total
        //this.$refs.pagination.totalSize = data.size
      });
    },
    getTableInfo: function(row) {
      console.log(row);
      // console.log("以下是获取整个Table的数据");
      // console.log(this.$refs.pmTable.getTableInfo());
      // console.log(this.$refs.pmTable.getRowInfo(2));
    }
  }
};
</script>