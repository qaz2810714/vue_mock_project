<template>
  <el-container class="edit_padding">
    <el-main>
      <pm_form_render
        :model="formModel"
        :entity="entity"
        :rules="rules"
        :change="form_change"
        ref="mainForm"
        v-bind:formReadOnly="formReadOnly"
      >
        <pm_form_item
          row="1"
          labletext="锁定单号"
          name="lockNo"
          :readOnly="true"
          :span="6"
          xtype="text"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="1"
          labletext="货主单位"
          name="cstId"
          :span="6"
          xtype="search_select_input"
          lableWidth="80px"
          required
        ></pm_form_item>
        <pm_form_item
          row="1"
          labletext="制单人"
          name="creatorName"
          :readOnly="true"
          :span="6"
          xtype="text"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="1"
          labletext="制单时间"
          name="createTime"
          :readOnly="true"
          :span="6"
          xtype="datetime"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="审核人"
          name="auditorName"
          :readOnly="true"
          :span="6"
          xtype="text"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="审核时间"
          name="auditTime"
          :readOnly="true"
          :span="6"
          xtype="datetime"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="状态"
          name="status"
          :readOnly="true"
          :span="6"
          xtype="select"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="3"
          labletext="锁定原因"
          name="remark"
          :span="24"
          xtype="textarea"
          lableWidth="80px"
        ></pm_form_item>
      </pm_form_render>
      <!-- toolbar工具条部分 -->
      <pm_tool_bar>
        <pm_toolButton
          ref="btn_getstock"
          btnName="选择明细"
          btnIcon="el-icon-sold-out"
          :btnClickFunc="getStock"
        ></pm_toolButton>
        <pm_toolButton
          ref="btn_remove"
          btnName="移除"
          btnIcon="el-icon-remove"
          :btnClickFunc="deleteRows"
        ></pm_toolButton>
      </pm_tool_bar>
      <pm_table ref="pmTable" tableKey="NoteLockEdit-pmTable" :dataSource="formModel.detailList" :config="config" :bottomHeight="170">
        <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
        :callback="requestTransactionLogs" renderType="input"></vue_column>-->
        <pm_column prop="cardNo" label="卡号" :canEdit="false" width="120"></pm_column>
        <pm_column prop="packNo" label="捆包号" :canEdit="false" width="150"></pm_column>
        <pm_column prop="brandId" label="品名(品种)" :canEdit="false" width="180"></pm_column>
        <pm_column prop="textureId" label="材质(钢种)" :canEdit="false" width="100" watchField="brandId"></pm_column>
        <pm_column prop="spec" label="规格" :canEdit="false" width="120"></pm_column>
        <pm_column prop="producingId" label="产地" :canEdit="false" width="150"></pm_column>
        <pm_column prop="calcType" label="计重方式" :canEdit="false" width="100"></pm_column>
        <pm_column prop="amount" label="数量" width="150" required></pm_column>
        <pm_column prop="netWeight" label="净重" width="150" required></pm_column>
        <pm_column prop="grossWeight" label="毛重" width="150" required></pm_column>
        <pm_column prop="poundWeight" label="磅重" width="150" required></pm_column>
        <pm_column prop="measurementUnit" label="数量单位" :canEdit="false" width="100"></pm_column>
        <pm_column prop="unitNumber" label="单包支数" :canEdit="false" width="100"></pm_column>
        <pm_column prop="whsCalcStackId" label="库区" :canEdit="false" width="160"></pm_column>
        <pm_column prop="whsStackName" label="库位" :canEdit="false" width="70"></pm_column>
        <pm_column prop="whsLayer" label="层数" :canEdit="false" width="70"></pm_column>
        <pm_column prop="remark" label="备注" :canEdit="false" width="200"></pm_column>
        <pm_column prop="manufactureTime" label="出厂日期" :canEdit="false" width="140"></pm_column>
        <pm_column prop="stoveCode" label="炉号" :canEdit="false" width="100"></pm_column>
        <pm_column prop="whsinTime" label="首入库日期" :canEdit="false" width="140"></pm_column>
      </pm_table>
    </el-main>
    <el-footer style="padding:0px;">
      <!-- toolbar工具条部分 -->
      <pm_tool_bar :noBackground="true">
        <pm_toolButton
          ref="btn_save"
          btnName="保存"
          btnIcon="el-icon-success"
          :btnClickFunc="saveInfo"
        ></pm_toolButton>
        <pm_toolButton
          ref="btn_check"
          btnName="保存&amp;审核"
          btnIcon="el-icon-circle-check-outline"
          :btnClickFunc="saveAndAuditInfo"
        ></pm_toolButton>
        <pm_toolButton
          ref="btn_print"
          btnName="打印"
          btnIcon="el-icon-printer"
          :btnClickFunc="printFunc"
        ></pm_toolButton>
        <pm_toolButton
          ref="btn_close"
          btnName="关闭"
          btnIcon="el-icon-close"
          :btnClickFunc="closeWin"
        ></pm_toolButton>
      </pm_tool_bar>
      <noteLockPrint ref="print" v-show="false"></noteLockPrint>
    </el-footer>
  </el-container>
</template>
<script>
import httpUtil from "@/common/utils/HttpUtil";
import layerUtil from "@/common/utils/LayerUtil";
import metadata from "@/common/entities/Metadata";
import commonUtil from "@/common/utils/CommonUtils";

import Table from "@/components/common/table/Table";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";

import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import noteLockPrint from "./NoteLockPrint";

const statusEnum = metadata.wmsNoteLock.statusEnum;
//校验规则
let data_rules = [
  {
    fieldName: "amount",
    msg: "锁定数量不能超过库存可用数量",
    validFunc: (row, old, curr) => {
      var outByNum = curr.$commonUtil.valid.isOutByNum(
        row.brandId,
        curr.dicCache.BrandNameList.list
      );
      //按吨算 不看数量
      if (!outByNum) return false;
      return row.amount > old.amount;
    }
  },
  {
    fieldName: "grossWeight",
    msg: "锁定毛重不能超过库存可用毛重",
    validFunc: (detail, old, curr) => {
      return detail.grossWeight > old.grossWeight;
    }
  },
  {
    fieldName: "poundWeight",
    msg: "锁定磅重不能超过库存可用磅重",
    validFunc: (detail, old) => {
      return detail.grossWeight > old.grossWeight;
    }
  },
  {
    fieldName: "amount",
    msg: "锁定数量必须大于0",
    validFunc: (detail, old, curr) => {
      var outByNum = curr.$commonUtil.valid.isOutByNum(
        detail.brandId,
        curr.dicCache.BrandNameList.list
      );
      //按吨算 不看数量
      if (!outByNum) return false;
      return detail.amount <= 0;
    }
  },
  {
    fieldName: "netWeight",
    msg: "锁定净重必须大于0",
    validFunc: (detail, old) => {
      return detail.netWeight <= 0;
    }
  }
];

export default {
  components: {
    x_table: Table,
    pm_search,
    pm_form_item,
    pm_table,
    pm_column,
    pm_toolButton,
    pm_tool_bar,
    noteLockPrint
  },
  data: function() {
    return {
      rules: {
        cstId: [{ required: true, message: "请输入货主单位", trigger: "blur" }]
      },
      formModel: Object,
      dataSource: [],
      dicCache: this.$cacheUtil.getDic(),
      entity: this.$metaData.wmsNoteLock,
      formReadOnly: false,
      config: {
        entity: this.$metaData.wmsNoteLockDetail,
        allowEdit: true,
        multiple: true,
        sortable: false,
        height: 240,
        rowCanEdit: function(obj) {
          return true; //obj.packNo.includes("KB190212000001-3");
        },
        change: this.cellValueChange
      }
    };
  },
  created() {
    this.formModel = this.getFormModel();
  },
  mounted() {
    //初始化form状态
    this.initFormState();
  },
  methods: {
    /**
     * 打印方法
     */
    printFunc:function(){
      if (!this.formModel.id)
      {
          this.$commonUtil.valid.throwEx("请先保存单据");
      }
      var $this = this;
      this.$commonUtil.getEntity(
        "whslock/getList",
        "whslock/getDetailList",
        { page: 0, size: 10000, lockId: this.formModel.id },
        entity=>{
          $this.$refs.print.printDiv(entity);
        }
      );
    },
    cellCanEdit: function(obj) {
      return true;
      //return obj.packNo.includes("123");
    },
    getFormModel() {
      // var entity = JSON.parse(this.$options.parent.labelContent.entity);
      var entity = this.$options.parent.propsData.entity;
      if (entity.id == null) {
        //新增模式
        this.$set(entity, "lockNo", this.$commonUtil.appConst.nullNo);
        this.$set(
          entity,
          "creatorName",
          this.$commonUtil.appConst.getCurrUserName()
        );
        this.$set(entity, "status", statusEnum.STATUS_READY);
        this.$set(entity, "detailList", []);
        this.$set(entity, "oldDetails", []);
      }
      return entity;
    },
    closeWin: function() {
      this.$commonUtil.tab.close(this);
    },
    //计算比例
    calcUnit: function(details) {
      var $this = this;
      details.forEach(a => {
        $this.$commonUtil.calUnitWeight(
          a,
          a.netWeight,
          a.grossWeight,
          a.poundWeight,
          a.amount
        );
      });
    },
    //初始化form表单状态
    initFormState: function() {
      if (this.formModel.detailList) {
        //编辑模式
        this.calcUnit(this.formModel.detailList);
        this.formModel.oldDetails = this.$commonUtil.deepClone(
          this.formModel.detailList
        );
      }
      var hasSaveAuth = this.$commonUtil.permission.hasSaveAuth(this);
      var hasCheckAuth = this.$commonUtil.permission.hasCheckAuth(this);
      var hasPrintAuth = this.$commonUtil.permission.hasPrintAuth(this);
      if(!hasCheckAuth){
        this.$refs.btn_check.setDisabled(true);
      }
      if(!hasPrintAuth){
        this.$refs.btn_print.setDisabled(true);
      }
      if (!hasSaveAuth || this.formModel.status != statusEnum.STATUS_READY) {
        this.formReadOnly = true;
        this.config.allowEdit = false;
        this.$refs.btn_save.setDisabled(true);
        this.$refs.btn_check.setDisabled(true);
        this.$refs.btn_getstock.setDisabled(true);
        this.$refs.btn_remove.setDisabled(true);
      }
    },
    deleteRows: function() {
      var $this = this;
      //返回选中的数据
      var rows = this.$refs.pmTable.getSelectedRows();
      //从数据源中移除数据
      this.$commonUtil.removeSelectedRows(
        rows,
        this.formModel.detailList,
        (pack, item) => {
          return pack.packId == item.packId;
        },
        row => {
          $this.formModel.oldDetails.splice(
            $this.formModel.oldDetails.findIndex(data => {
              return data.packId == row.packId;
            }),
            1
          );
        }
      );
    },
    /**
     * 挑选产品
     */
    getStock: function() {
      //this.config.allowEdit = true;
      var $this = this;
      this.$commonUtil.selProduct(
        this,
        { cstId: this.formModel.cstId },
        function(stocks) {
          var packNoList = [];
          stocks.forEach(a => {
            if ($this.formModel.detailList.find(item => item.packId == a.id)) {
              packNoList.push(a.packNo);
              return;
            }
            $this.$set(a,'packId', a.id);
            $this.$set(a,'id', null);
            $this.$set(a,'cardNo', a.cstPackNo);
            $this.$set(a,'whsLayer', a.whsLayerId);
            $this.$set(a,'grossWeight', a.usableGrossWeight);
            $this.$set(a,'poundWeight', a.usablePoundWeight);
            $this.$set(a,'amount', a.usableNum);
            $this.$commonUtil.calUnitWeight(
              a,
              a.netWeight,
              a.grossWeight,
              a.poundWeight,
              a.amount
            );
            $this.formModel.detailList.push(a);
            $this.formModel.oldDetails.push($this.$commonUtil.deepClone(a));
          });
          if (packNoList.length > 0) {
            $this.$commonUtil.message.alert(
              "捆包[" + packNoList.join(",") + "]已经存在，不允许重复添加!"
            );
          }
        }
      );
    },
    //----------- form变更事件 begin -----------------
    form_change: function(prop, val, selected) {
      if (prop == "cstId" && selected) {
        this.formModel.cstName = selected.cstFullName;
      }
    },
    //------------------------------------------------
    /**
     * 值改变事件
     */
    cellValueChange: function(row, prop, val, selected) {
      if (prop == "cstId" && selected) {
        row.cstName = selected.cstFullName;
      }
      //1.执行数据联动
      this.detail_change(row, prop, val);
      //2.执行验证
      this.data_valid(row, prop, val);
    },
    //数据处理
    detail_change: function(row, prop, val) {
      //1.执行数据联动
      var outByNum = this.$commonUtil.valid.isOutByNum(row.brandId);
      if (row.calcType != 1 || !outByNum) {
        //非理计产品或非按件出库产品不做计算
        return;
      }
      if (prop == "amount") {
        if (row.netUnit != null) {
          row.netWeight = this.$commonUtil.calc.fixThree(val * row.netUnit);
        }
        if (row.grossUnit != null) {
          row.grossWeight = this.$commonUtil.calc.fixThree(val * row.grossUnit);
        }
        if (row.poundUnit != null) {
          row.poundWeight = this.$commonUtil.calc.fixThree(val * row.poundUnit);
        }
      }
    },
    //数据验证
    data_valid: function(row, prop, val) {
      var old = this.formModel.oldDetails.find(a => a.packId == row.packId);
      if (old == null) old = row;
      var $this = this;
      data_rules
        .filter(a => a.fieldName == prop)
        .forEach(rule => {
          if (rule.validFunc(row, old, $this)) {
            $this.$commonUtil.valid.throwEx(rule.msg);
          }
        });
    },
    //------------------------------------
    //--- 保存方法组 -------------------------
    refreshList: function() {
      var parent = this.$options.parent.propsData.parent;
      if (parent && parent.refreshList) {
        parent.refreshList();
      }
    },
    //更新标题
    updateTitle: function(title) {
      this.$commonUtil.tab.updateTitle(this, title);
    },
    getEntity: function() {
      var submitModel = JSON.parse(JSON.stringify(this.formModel));
      //计算合计值
      submitModel.totalAmount = submitModel.detailList.sum(a => a.amount);
      submitModel.totalNetWeight = submitModel.detailList.sum(a => a.netWeight); 
      submitModel.totalGrossWeight = submitModel.detailList.sum(a => a.grossWeight); 
      submitModel.totalPoundWeight = submitModel.detailList.sum(a => a.poundWeight); 
      return submitModel;
    },
    entity_valid: function(data) {
      this.$refs.pmTable.validator();
      var $this = this;
      if (data.detailList == null || data.detailList.length == 0) {
        this.$commonUtil.valid.throwEx("请至少添加一条捆包信息");
      }
      //明细校验
      data.detailList.forEach(lock => {
        var old = $this.formModel.oldDetails.find(a => a.packId == lock.packId);
        if (old == null) old = lock;
        data_rules.forEach(rule => {
          if (rule.validFunc(lock, old, $this)) {
            $this.$commonUtil.valid.throwEx(rule.msg);
          }
        });
      });
      //校验packno是否重复
      var groups = {},
        repeatNo = [];
      var groups = data.detailList.group(a => a.packNo);
      //查重
      for (var packNo in groups) {
        if (groups[packNo].length > 1) {
          repeatNo.push(packNo);
        }
      }
      if (repeatNo.length > 0) {
        $this.$commonUtil.valid.throwEx("明细中存在重复的捆包号[" + repeatNo.join(",") + "]"
        );
      }
    },
    //保存信息
    saveInfo: function() {
      this.$refs["mainForm"].validate(this,valid => {
          //组装请求参数对象
          var submitModel = this.getEntity();
          //实体校验
          this.entity_valid(submitModel);
          var $this = this;
          if (submitModel.id == null) {
              //新增
              this.baseSave("whslock/add", submitModel, "保存锁定单成功", data => {
                  $this.updateTitle("编辑锁定单[" + data.lockNo + "]");
              });
          } else {
              //修改
              this.baseSave("whslock/update", submitModel, "保存锁定单成功");
          }
      });
    },
    //保存并审核
    saveAndAuditInfo: function() {
      this.$refs["mainForm"].validate(this,valid => {
          //组装请求参数对象
          var submitModel = this.getEntity();
          //实体校验
          this.entity_valid(submitModel);
          var $this = this;
          if (submitModel.id == null) {
            //新增
            this.baseSave(
              "whslock/addAndLock",
              submitModel,
              "保存并审核成功",
              data => {
                $this.updateTitle("编辑锁定单[" + data.lockNo + "]");
              }
            );
          } else {
            //修改
            this.baseSave("whslock/updateAndLock", submitModel, "保存并审核成功");
          }
      });
    },
    printInfo: function() {
      //测试一下数据刷新
      // this.formModel.lockNo = "测试中。。。";
      // this.formModel.status = 2;
    },
    //基础保存方法
    baseSave: function(url, submitModel, msg, callback) {
      var $this = this;
      this.$httpUtil.post(url, submitModel, data => {
        $this.$message({
          message: msg,
          type: "success"
        });
        for (var p in data) {
          $this.$set($this.formModel, p, data[p]);
        }
        //$this.formModel = data;
        if (callback) {
          callback(data);
        }
        //重新刷新表单
        $this.initFormState();
        //刷新主界面数据
        $this.refreshList();
      });
    }
    //---------------------------------------
  }
};
</script> 