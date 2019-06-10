<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body class="edit_padding">
        <pm_form_render
          :model="formModel"
          :rules="rules"
          ref="outForm"
          :entity="config.entity"
          v-bind:formReadOnly="formReadOnly"
        >
          <pm_form_item
            row="1"
            labletext="出库单号"
            name="whsoutNo"
            :span="6"
            xtype="text"
            lableWidth="100px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="货主单位"
            name="cstId"
            :span="6"
            xtype="search_select_input"
            lableWidth="100px"
            required
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="提货单位"
            name="deliveryId"
            :span="6"
            xtype="search_select_input"
            lableWidth="100px"
            required
            watchField="cstId"
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="提货车号"
            name="vehicleNumber"
            :span="6"
            xtype="text"
            lableWidth="100px"
            required
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="外部单据号"
            name="billAttachmentId"
            :span="6"
            xtype="text"
            lableWidth="100px"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="司机姓名"
            name="driverName"
            :span="6"
            xtype="text"
            lableWidth="100px"
            :rowHeight="3"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="司机身份证"
            name="driverIdCard"
            :span="6"
            xtype="text"
            lableWidth="100px"
            :rowHeight="3"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="司机电话"
            name="driverPhone"
            :span="6"
            xtype="text"
            lableWidth="100px"
            :rowHeight="3"
          ></pm_form_item>
          <pm_form_item
            row="5"
            labletext="出库单状态"
            name="status"
            :span="4"
            xtype="select"
            lableWidth="100px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="5"
            labletext="制单人"
            name="creatorName"
            :span="5"
            xtype="text"
            lableWidth="100px"
            :rowHeight="3"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="5"
            labletext="制单时间"
            name="createTime"
            :span="5"
            xtype="date"
            lableWidth="100px"
            :rowHeight="3"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="5"
            labletext="出库人"
            name="modifierName"
            :span="5"
            xtype="text"
            lableWidth="100px"
            :rowHeight="3"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            ref="form_auditTime"
            :canEdit="auditTimeCanEdit"
            row="5"
            labletext="出库时间"
            name="auditTime"
            :span="5"
            xtype="datetime"
            lableWidth="100px"
            :rowHeight="3"
            :pickerOptions="pickerOptions"
          ></pm_form_item>
          <pm_form_item
            row="6"
            labletext="备注"
            name="remark"
            :span="24"
            xtype="textarea"
            lableWidth="100px"
            :rowHeight="2"
          ></pm_form_item>
        </pm_form_render>
        <pm_upload ref="upload" :fileList="formModel.fileList"></pm_upload>
        <pm_tool_bar>
          <pm_toolButton
            ref="select"
            btnName="挑选明细"
            btnIcon="el-icon-circle-plus-outline"
            :btnClickFunc="getStock"
          ></pm_toolButton>
          <pm_toolButton
            ref="remove"
            btnName="移除"
            btnIcon="el-icon-remove-outline"
            :btnClickFunc="deleteRows"
          ></pm_toolButton>
        </pm_tool_bar>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table
          ref="pmTable"
          tableKey="NoteWhsOutEdit-pmTable"
          :dataSource="dataSource"
          :config="config"
          :bottomHeight="170"
        >
          <pm_column prop="cstPackNo" label="卡号" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="packNo" label="捆包号" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="brandId" label="品名" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="textureId" label="材质" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="spec" label="规格" width="150" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="producingId" label="产地" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="calcType" label="计重方式" width="100" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" width="100" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="number" label="数量" width="140" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="netWeight" label="净重" width="140" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="140" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="140" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" width="100" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column
            prop="whsCalcStackId"
            label="库区"
            width="200"
            parentPropName="whsRoomId"
            childPropName="whsAreaId"
            :cellCanEdit="cellCanEdit"
          ></pm_column>
          <pm_column prop="stackName" label="库位" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <!-- <pm_column prop="costDays" label="仓储天数" width="200" :cellCanEdit='cellCanEdit'></pm_column> -->
          <!-- <pm_column prop="transferTimes" label="过户次数" width="200" :cellCanEdit='cellCanEdit'></pm_column> -->
          <!-- <pm_column prop="costTime" label="货主入库时间" width="200" :cellCanEdit='cellCanEdit'></pm_column> -->
          <pm_column prop="floorNum" label="层数" width="120" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="whsinTime" label="首入库日期" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="stoveCode" label="炉号" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="remark" label="备注" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="manufactureTime" label="出厂日期" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="transceiver" label="收发人" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="slinger" label="吊机工" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <pm_column prop="whsManager" label="仓管" width="200" :cellCanEdit="cellCanEdit"></pm_column>
          <!-- <pm_column prop="createTime" label="制单时间" width="200" :canEdit='false'></pm_column>
          <pm_column prop="creatorName" label="制单人" width="200" :canEdit='false'></pm_column>-->
          <!-- <pm_column prop="packType" label="包装方式" width="200"></pm_column>
          <pm_column prop="packDesc" label="包装描述" width="200"></pm_column>-->
        </pm_table>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 页面操作区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <pm_tool_bar :noBackground="true">
          <pm_toolButton
            ref="btn_print"
            btnName="打印"
            btnIcon="el-icon-printer"
            :btnClickFunc="printInfo"
          ></pm_toolButton>
          <pm_toolButton ref="out" btnName="出库" btnIcon="el-icon-goods" :btnClickFunc="outWhs"></pm_toolButton>
          <pm_toolButton
            ref="cost"
            btnName="结算"
            btnIcon="el-icon-tickets"
            :btnClickFunc="settleInfo"
          ></pm_toolButton>
          <pm_toolButton
            ref="save"
            btnName="保存并审核"
            btnIcon="el-icon-edit-outline"
            :btnClickFunc="saveInfo"
          ></pm_toolButton>
          <pm_toolButton ref="close" btnName="关闭" btnIcon="el-icon-error" :btnClickFunc="closeWin"></pm_toolButton>
        </pm_tool_bar>
      </metro_page_box_body>
    </metro_page_box>
    <noteWhsOutPrint ref="print" v-show="false"></noteWhsOutPrint>
  </metro_page>
</template>

<script>
import metro_page from "@/components/vitems/pageContainer/metro_page";
import metro_page_box from "@/components/vitems/pageContainer/metro_page_box";
import metro_page_box_tool_bar from "@/components/vitems/pageContainer/metro_page_box_tool_bar";
import metro_page_box_body from "@/components/vitems/pageContainer/metro_page_box_body";
import metro_pageheader from "@/components/vitems/pageheader";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
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
import pm_upload from "@/components/common/upload/pm_upload";
import printJS from "print-js";
import noteWhsOutPrint from "./NoteWhsOutPrint";
import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
const statusEnum = {
  STATUS_READY: 1, //待出库
  STATUS_SUCC: 2, //出库完成
  STATUS_DELETE: 3 //已废弃
};
const operTypeEnum = {
  OPER_ADD: "3", //新增
  OPER_EDIT: "1", //修改
  OPER_ADJUST: "2" //调整
};
export default {
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_tool_bar,
    metro_page_box_body,
    metro_pageheader,
    pm_search,
    pm_form_item,
    pm_toolButton,
    pm_tool_bar,
    pm_table,
    pm_column,
    pm_pagination,
    pm_upload,
    noteWhsOutPrint
  },
  data: function() {
    var validPhone = (rule, value, callback) => {
      var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (value && !reg.test(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      dataSource: [],
      config: {
        entity: metadata.whsOut,
        allowEdit: true,
        multiple: true,
        //   rowCanEdit: function(obj) {
        //   }
        change: function(row, prop, val) {
          var brand = cacheUtil
            .getDic()
            .BrandNameList.list.filter(item => item.id === row.brandId)[0];
          if (!brand) {
            return;
          }
          if (row.calcType != 1 || brand.whsoutType == 2) {
            //非理计产品,按品名吨计 不做计算
            return;
          }
          if (prop == "number") {
            var newValue = row.number;
            row.netWeight = (newValue * row.netUnit).toFixed(3);
            row.grossWeight = (newValue * row.grossUnit).toFixed(3);
            row.poundWeight = (newValue * row.poundUnit).toFixed(3);
          }
          //   console.log('value = '+val+'  prop =' + prop);
        }
      },
      totalSize: 0,
      rules: {
        driverPhone: [{ trigger: "blur", validator: validPhone }]
      },
      formReadOnly: false,
      cutIdList: [],
      delPackNoList: [],
      formModel: Object,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    //获取数据源
    this.formModel = this.getFormModel();
  },
  methods: {
    closeWin: function() {
      this.$commonUtil.tab.close(this);
    },
    //结算
    settleInfo() {
      var $this = this;
      var submitModel = JSON.parse(JSON.stringify(this.formModel));
      submitModel.detailList = this.dataSource;
      this.wrapData(submitModel);
      const costBalanceItem = {
        component: costBalanceAddManage,
        propsData: { entity: submitModel },
        name: "新增结算单"
      };
      this.$tab.open(costBalanceItem);
    },
    //组装数据
    wrapData(entity) {
      entity.businessNo = entity.whsoutNo;
      entity.cstId = entity.cstId;
      entity.businessType = 2;
      entity.createDate = entity.createTime;
      entity.creatorData = entity.creator;
      if (!entity.detailList) {
        return;
      }
      entity.detailList.forEach(element => {
        element.material = element.textureId;
        element.productPlace = element.producingId;
        element.businessNo = element.whsoutNo;
        //element.transferDate = element.transferTime;
        element.whsInFirstDate = element.whsinTime;
        element.createDate = element.createTime;
        element.numFin = element.number;
        if (!element.transferTimes) {
          element.transferNum = 0;
        } else {
          element.transferNum = element.transferTimes;
        }
        element.businessType = 1;
        element.costDate = element.costTime;
      });
      entity.detail = entity.detailList;
    },
    //打印
    printInfo: function() {
      let _this = this;
      this.$commonUtil.getDetailEntity(
        "whsout/getWhsoutDetailInfoByMainId",
        {
          id: this.formModel.id,
          mainId: this.formModel.id,
          bizType: 2,
          bizId: this.formModel.id
        },
        this.formModel,
        function(entity) {
          _this.$refs.print.printDiv(entity);
        }
      );
    },
    //获取数据源
    getFormModel: function() {
      var entity = this.$options.parent.propsData.entity;
      entity.detailList = entity.detail;
      this.$set(entity, "env", "bs");
      this.$set(entity, "driverPhone", null);
      return entity;
    },

    initData() {
      var entity = this.formModel;
      /**
       * 权限控制
       */
      var hasSaveAuth = this.$commonUtil.permission.hasSaveAuth(this);
      var hasCheckAuth = this.$commonUtil.permission.hasCheckAuth(this);
      var hasPrintAuth = this.$commonUtil.permission.hasPrintAuth(this);
      if (!this.deleteIdList) {
        this.deleteIdList = [];
      }
      if (!this.delPackNoList) {
        this.delPackNoList = [];
      }
      //根据操作类型处理按钮的显示
      if (this.formModel.editFlag == operTypeEnum.OPER_ADJUST) {
        this.$refs["out"].setDisabled(true);
        this.$refs.form_auditTime.canEdit = true;
        entity.canEditCols = [
          "number",
          "netWeight",
          "grossWeight",
          "poundWeight",
          "calcType",
          "remark",
          "transceiver",
          "slinger",
          "whsManager"
        ];
        this.calcUnit(entity.detailList, false);
      } else if (this.formModel.editFlag == operTypeEnum.OPER_EDIT) {
        this.$refs["save"].setDisabled(true);
        this.$refs["select"].setDisabled(true);
        this.$refs["remove"].setDisabled(true);
        this.$refs["upload"].setDisabled(true);
        this.$refs["btn_print"].setDisabled(false);
        this.$refs["cost"].setDisabled(false);
        if (this.formModel.status == statusEnum.STATUS_SUCC) {
          this.$refs["out"].setDisabled(true);
          //已出库
          this.config.allowEdit = false;
          this.updateTitle("查看出库单[" + this.formModel.whsoutNo + "]");
          this.$refs.form_auditTime.canEdit = false;
        } else {
          this.$refs["out"].setDisabled(false);
          //待出库状态下的数据调整
          entity.canEditCols = ["netWeight", "calcType", "remark"];
          this.$refs.form_auditTime.canEdit = true;
        }

        //TODO:编辑操作
        //如果是已完成状态的单据 禁用整个界面
        this.formReadOnly = true;
        entity.detail.forEach(element => {
          this.$set(
            element,
            "oriNetWeight",
            this.$commonUtil.deepClone(element.netWeight)
          );
          this.$set(
            element,
            "oriCalcType",
            this.$commonUtil.deepClone(element.calcType)
          );
          this.$set(
            element,
            "oriRemark",
            this.$commonUtil.deepClone(element.remark)
          );
        });
        this.calcUnit(entity.detail, false);
      } else if (this.formModel.editFlag == operTypeEnum.OPER_ADD) {
        this.$refs["btn_print"].setDisabled(true);
        this.$refs["cost"].setDisabled(true);
        this.$refs["out"].setDisabled(true);
        this.$refs.form_auditTime.canEdit = true;

        this.$set(entity, "auditTime", new Date());
        entity.whsoutNo = this.$commonUtil.appConst.nullNo;
        entity.creatorName = cacheUtil.getUser().configUser.name;
        this.$set(entity, "status", 1);
        entity.canEditCols = [
          "number",
          "netWeight",
          "grossWeight",
          "poundWeight",
          "remark",
          "transceiver",
          "slinger",
          "whsManager",
          "calcType"
        ];
      }
      if (!hasSaveAuth) {
        this.$refs["add"].setDisabled(true);
      }
      if (!hasCheckAuth) {
        this.$refs["save"].setDisabled(true);
      }
      if (!hasPrintAuth) {
        this.$refs["btn_print"].setDisabled(true);
      }
      this.dataSource = entity.detail;
    },
    cellCanEdit: function(obj, prop) {
      var canEditCols = this.formModel.canEditCols;
      return canEditCols && canEditCols.includes(prop);
    },
    addDetail: function() {
      var $this = this;
      if (!$this.dataSource) {
        $this.dataSource = [];
      }
      var detail = {};
      this.counter += 1;
      detail.index = this.counter;
      $this.dataSource = $this.dataSource.concat(detail);
    },
    //删除行数据
    deleteRows: function() {
      var $this = this;
      //返回选中的数据
      var rows = this.$refs.pmTable.getSelectedRows();
      //从数据源中移除数据
      commonUtil.removeSelectedRows(rows, this.dataSource, (pack, moveItem) => {
        return pack.packId == moveItem.packId;
      });
      rows.forEach(row => {
        if (row.id) {
          $this.deleteIdList.push(row.id);
          $this.delPackNoList.push(row.packNo);
        }
      });
    },
    //保存数据
    saveInfo: function() {
      this.$refs["outForm"].validate(this);
      //组装请求参数对象
      var $this = this;
      var cstList = cacheUtil.getDic().CstList.list;
      this.formModel.cstName = cstList.filter(
        item => item.id === this.formModel.cstId
      )[0].cstFullName;
      this.formModel.deliveryName = cstList.filter(
        item => item.id === this.formModel.deliveryId
      )[0].cstFullName;
      this.formModel.detail = this.dataSource;
      var files = this.$refs.upload.getNewFileList();
      if (this.formModel.editFlag == "3") {
        //新增操作
        httpUtil.postWithFile(
          "whsout/addWhsOut",
          this.formModel,
          files,
          data => {
            this.$message({
              message: "新增出库单成功",
              type: "success"
            });
            $this.$refs.upload.clearAllFile();
            $this.updateTitle("编辑出库单[" + data.whsoutNo + "]");
            $this.handleBackData(data);
            //this.cellCanEdit();
            this.formModel.editFlag = operTypeEnum.OPER_EDIT;
            this.initData();
            $this.$options.parent.propsData.parentView.queryData();
          }
        );
      } else {
        //调整修改操作
        this.formModel.cutIdList = this.deleteIdList;
        this.formModel.delPackNoList = this.delPackNoList;
        var fileDeleteList = [];
        if (this.$refs.upload.getDeleteFileList().length > 0) {
          this.$refs.upload.getDeleteFileList().forEach(item => {
            fileDeleteList.push(item.id);
          });
        }
        this.formModel.fileDeleteList = fileDeleteList;
        httpUtil.postWithFile(
          "whsout/adjustWhsOut",
          this.formModel,
          files,
          data => {
            var titleHead = "修改";
            if (this.formModel.editFlag == operTypeEnum.OPER_ADJUST) {
              titleHead = "调整";
            }
            this.$message({
              message: titleHead + "出库单成功",
              type: "success"
            });
            $this.$refs.upload.clearAllFile();
            $this.handleBackData(data);
            this.initData();
            $this.$options.parent.propsData.parentView.queryData();
          }
        );
      }
    },
    handleBackData: function(data) {
      for (var p in data) {
        this.$set(this.formModel, p, data[p]);
      }
      this.calcUnit(data.detail,false);
      this.dataSource = this.formModel.detail;
    },
    //获取库存信息
    getStock: function(filter, callback) {
      var $this = this;
      commonUtil.selProduct(this, { cstId: this.formModel.cstId }, function(
        stocks
      ) {
        //需要添加新的记录到数据源中
        if (!$this.dataSource) {
          $this.dataSource = [];
        }
        $this.$options.methods.calcUnit(stocks, true);
        //处理数据 部分字段处理
        stocks.forEach(element => {
          if (
            $this.dataSource.length > 0 &&
            $this.dataSource.filter(item => item.packId === element.id).length >
              0
          ) {
            //如果有重复数据则不进行添加
            return;
          }
          element.packId = element.id;
          element.id = null;
          element.number = element.usableNum;
          element.netWeight = element.usableWeight;
          element.grossWeight = element.usableGrossWeight;
          element.poundWeight = element.usablePoundWeight;
          element.remark = null;
          element.stackName = element.whsStackName;
          element.floorNum = element.whsLayerId;
          $this.dataSource.push(element);
        });
      });
    },
    //计算比例
    calcUnit: function(details, isNew) {
      //isNew  是否是新挑选的明细
      var $this = this;
      if (isNew) {
        details.forEach(a => {
          commonUtil.calUnitWeight(
            a,
            a.usableWeight,
            a.usableGrossWeight,
            a.usablePoundWeight,
            a.usableNum
          );
        });
      } else {
        details.forEach(a => {
          commonUtil.calUnitWeight(
            a,
            a.netWeight,
            a.grossWeight,
            a.poundWeight,
            a.number
          );
        });
      }
    },
    //更新标题
    updateTitle: function(title) {
      this.$commonUtil.tab.updateTitle(this, title);
    },
    //出库操作
    outWhs: function() {
      var $this = this;
      //查询业务单据是否结算
      this.formModel.detail = this.dataSource;
      var weightChange =
        this.formModel.detail.filter(
          item => item.netWeight != item.oriNetWeight
        ).length > 0;
      var calcTypeChange =
        this.formModel.detail.filter(item => item.calcType != item.oriCalcType)
          .length > 0;
      var param = commonUtil.deepClone(this.formModel);
      param.status = 2;
      param.netWeightType = "out";
      var costModel = {};
      costModel.businessNo = this.formModel.whsoutNo;
      if (weightChange || calcTypeChange) {
        //如果有重量发生改变的明细
        this.$confirm("单据发生调整，是否执行保存并出库?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          httpUtil.post("costCommon/queryCostBill", costModel, data => {
            var hasJs = data != null && data.Count > 0;
            if (hasJs) {
              this.$message({
                message: "该出库单已结算不允许做出库操作！",
                type: "fail"
              });
              return;
            } else {
              httpUtil.post("whsout/updateWhsOutDetail", param, data => {
                $this.handleBackData(data);
                httpUtil.post("whsout/stockOutInfo", param, data => {
                  $this.handleBackData(data);
                  this.$message({
                    message: "出库成功",
                    type: "success"
                  });
                  $this.$refs["out"].setDisabled(true);
                  this.updateTitle(
                    "查看出库单[" + this.formModel.whsoutNo + "]"
                  );
                  $this.config.allowEdit = false;
                  $this.formModel.editFlag = "1";
                  $this.initData();
                  $this.$options.parent.propsData.parentView.queryData();
                });
              });
            }
          });
        });
      } else {
        //没有重量发生改变可以直接出库
        httpUtil.post("whsout/stockOutInfo", param, data => {
          $this.handleBackData(data);
          this.$message({
            message: "出库成功",
            type: "success"
          });
          $this.$refs["out"].setDisabled(true);
          this.updateTitle("查看出库单[" + this.formModel.whsoutNo + "]");
          $this.config.allowEdit = false;
          $this.formModel.editFlag = "1";
          $this.initData();
          $this.$options.parent.propsData.parentView.queryData();
        });
      }
    }
  },
  computed: {
    /**
     * 审核时间是否允许编辑
     */
    auditTimeCanEdit: function() {
      if (this.formModel.editFlag == operTypeEnum.OPER_ADJUST) {
        return true;
      } else if (this.formModel.editFlag == operTypeEnum.OPER_EDIT) {
        if (this.formModel.status == statusEnum.STATUS_SUCC) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  },
  mounted() {
    this.initData();
  }
};
</script>