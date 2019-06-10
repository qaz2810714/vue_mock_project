<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body class="edit_padding">
        <pm_form_render
          :model="formModel"
          :rules="rules"
          ref="inForm"
          :entity="mainEntity"
          v-bind:formReadOnly="formReadOnly"
        >
          <pm_form_item
            row="1"
            labletext="过户单号"
            name="transferNo"
            :span="5"
            xtype="text"
            lableWidth="70px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="过户单状态"
            name="transferStatus"
            :span="6"
            xtype="select"
            lableWidth="100px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="过户人"
            name="auditorName"
            :span="8"
            xtype="text"
            :readOnly="true"
            lableWidth="70px"
          ></pm_form_item>
          <pm_form_item
            ref="form_transferTime"
            row="1"
            labletext="过户时间"
            name="transferTime"
            :span="5"
            xtype="date"
            lableWidth="100px"
            :pickerOptions="pickerOptions"
          ></pm_form_item>
          <pm_form_item
            ref="form_oldCst"
            row="2"
            labletext="原货主"
            required
            name="oldCstId"
            :span="5"
            xtype="search_select_input"
            lableWidth="70px"
          ></pm_form_item>
          <pm_form_item
            ref="form_newCst"
            row="2"
            labletext="新货主"
            name="newCstId"
            :span="6"
            xtype="search_select_input"
            :alllowCreate="true"
            autoCreateField="createCstName"
            lableWidth="100px"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="制单人"
            name="creatorName"
            :span="4"
            xtype="text"
            lableWidth="70px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="制单时间"
            name="createTime"
            :span="4"
            xtype="datetime"
            lableWidth="70px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            ref="form_cstInTimeType"
            row="2"
            labletext="货主入库时间"
            name="cstInTimeType"
            :span="5"
            xtype="select"
            lableWidth="100px"
          ></pm_form_item>
          <pm_form_item
            ref="form_remark"
            row="4"
            labletext="备注"
            name="remark"
            :span="24"
            xtype="textarea"
            lableWidth="70px"
          ></pm_form_item>
        </pm_form_render>
        <!-- toolbar工具条部分 -->
        <pm_tool_bar>
          <pm_toolButton
            ref="btn_selectProduct"
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
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table
          ref="pmTable"
          tableKey="NoteTransferEdit-pmTable"
          :dataSource="formModel.aftList"
          :config="config"
          :bottomHeight="170"
        >
          <pm_column prop="cardNo" label="卡号" :canEdit="false" width="150"></pm_column>
          <pm_column prop="packNo" label="捆包号" :canEdit="false" width="150"></pm_column>
          <pm_column prop="brandId" label="品名" :canEdit="false" width="120"></pm_column>
          <pm_column prop="textureId" label="材质" :canEdit="false" width="120"></pm_column>
          <pm_column prop="spec" label="规格" :canEdit="false" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" :canEdit="false" width="120"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" :canEdit="false" width="100"></pm_column>
          <pm_column prop="amount" label="数量" width="150"></pm_column>
          <pm_column prop="netWeight" label="净重" width="150"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="150"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="150"></pm_column>
          <pm_column prop="whsCalcStackId" label="库区" :canEdit="false" width="150"></pm_column>
          <pm_column prop="whsStackName" label="库位" :canEdit="false" width="100"></pm_column>
          <pm_column prop="whsLayer" label="层数" :canEdit="false" width="100"></pm_column>
          <pm_column prop="calcType" label="计重方式" :canEdit="false" width="100"></pm_column>
          <pm_column prop="whsinTime" label="首入库时间" :canEdit="false" width="200"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" :canEdit="false" width="100"></pm_column>
          <pm_column prop="manufactureTime" label="出厂日期" :canEdit="false" width="150"></pm_column>
          <pm_column prop="stoveCode" label="炉号" :canEdit="false" width="100"></pm_column>
          <pm_column prop="costTime" label="货主入库时间" :canEdit="false" width="200"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 页面操作区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <pm_tool_bar :noBackground="true">
          <pm_toolButton
            ref="btn_save"
            btnName="保存"
            btnIcon="el-icon-circle-plus-outline"
            :btnClickFunc="saveInfo"
          ></pm_toolButton>
          <pm_toolButton
            ref="btn_saveAndAudit"
            btnName="保存并审核"
            btnIcon="el-icon-circle-plus-outline"
            :btnClickFunc="saveAndAuditInfo"
          ></pm_toolButton>
          <pm_toolButton
            ref="btn_print"
            btnName="打印"
            btnIcon="el-icon-printer"
            :btnClickFunc="printInfo"
          ></pm_toolButton>
          <pm_toolButton
            ref="btn_settle"
            btnName="结算"
            btnIcon="pm-font pm-icon-ERP_xieyibianhao"
            :btnClickFunc="settleInfo"
          ></pm_toolButton>
          <pm_toolButton btnName="关闭" btnIcon="pm-font pm-icon-ERP_guanbi" :btnClickFunc="closeWin"></pm_toolButton>
        </pm_tool_bar>
      </metro_page_box_body>
    </metro_page_box>
    <noteTransferPrint ref="print" v-show="false"></noteTransferPrint>
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
import layerUtil from "@/common/utils/LayerUtil";
import cacheUtil from "@/common/utils/CacheUtil";
import pm_pagination from "@/components/common/table/pm_pagination";
import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
import commonUtil from "@/common/utils/CommonUtils";
import util from "@/common/js/util.js";
import noteTransferPrint from "./NoteTransferPrint";
import { error } from "util";
const statusEnum = {
  STATUS_READY: 1, //已制单
  STATUS_SUCC: 2, //已过户
  STATUS_DELETE: 3 //已废弃
};
const operTypeEnum = {
  OPER_ADD: "1", //新增
  OPER_EDIT: "2", //修改
  OPER_ADJUST: "3", //调整
  OPER_CHECK: "4" //调整
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
    noteTransferPrint
  },
  data: function() {
    return {
      dataSource: [],
      mainEntity: metadata.wmsTransfer,
      config: {
        entity: metadata.wmsTransferDetail,
        allowEdit: false,
        multiple: true,
        //change事件传入
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
          if (prop == "amount") {
            var newValue = row.amount;
            row.amount = newValue;
            this.$set(row, "netWeight", (newValue * row.netUnit).toFixed(3));
            this.$set(
              row,
              "grossWeight",
              (newValue * row.grossUnit).toFixed(3)
            );
            this.$set(
              row,
              "poundWeight",
              (newValue * row.poundUnit).toFixed(3)
            );
          }
        }
      },
      formReadOnly: false,
      formModel: null,
      totalSize: 0,
      rules: {
        cstId: [{ required: true, message: "请输入货主单位", trigger: "blur" }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    //初始化formModel
    if (this.formModel == null) {
      this.formModel = this.getFormModel();
    }
  },
  mounted() {
    //初始化form状态
    this.initFormState();
  },
  watch: {
    //监听货主入库类型
    "formModel.cstInTimeType"() {
      this.setCostTime();
    },
    "formModel.transferTime"() {
      this.setCostTime();
    }
  },
  methods: {
    //设置货主入库时间
    setCostTime() {
      //如果是首入库时间 货主入库时间和首入库时间保持一致
      if (this.formModel.cstInTimeType == 1) {
        this.formModel.aftList.forEach(
          item => (item.costTime = item.whsinTime)
        );
      }
      //否则 货主入库时间为主单上的过户时间
      else if (this.formModel.cstInTimeType == 2) {
        let transferTime = this.formModel.transferTime;
        this.formModel.aftList.forEach(item => (item.costTime = transferTime));
      }
    },
    /**
     * 挑选产品
     */
    getStock: function(filter, callback) {
      //如果未选择原货主则进行提示
      if (!this.formModel.oldCstId) {
        this.$message("请先选择原货主！");
        return;
      }
      //this.config.allowEdit = true;
      var $this = this;
      this.$commonUtil.selProduct(
        this,
        { cstId: this.formModel.oldCstId },
        function(stocks) {
          var packNoList = [];
          stocks.forEach(a => {
            if ($this.formModel.aftList.find(item => item.packId == a.id)) {
              packNoList.push(a.packNo);
              return;
            }
            $this.$set(a, "packId", a.id);
            // a.packId = a.id;
            $this.$set(a, "id", null);
            // a.id = null;
            $this.$set(a, "cardNo", a.cstPackNo);
            // a.cardNo = a.cstPackNo;
            $this.$set(a, "grossWeight", a.usableGrossWeight);
            // a.grossWeight = a.usableGrossWeight;
            $this.$set(a, "poundWeight", a.usablePoundWeight);
            $this.$set(a, "whsLayer", a.whsLayerId);
            // a.poundWeight = a.usablePoundWeight;
            $this.$set(a, "amount", a.usableNum);
            //a.amount = a.usableNum;
            $this.$commonUtil.calUnitWeight(
              a,
              a.netWeight,
              a.grossWeight,
              a.poundWeight,
              a.amount
            );
            $this.formModel.aftList.push(a);
          });
          if (packNoList.length > 0) {
            $this.$commonUtil.message.alert(
              "捆包[" + packNoList.join(",") + "]已经存在，不允许重复添加!"
            );
          }
        }
      );
      //绑定货主入库时间
      this.setCostTime();
    },
    deleteRows: function() {
      var $this = this;
      //返回选中的数据
      var rows = this.$refs.pmTable.getSelectedRows();
      //从数据源中移除数据
      this.$commonUtil.removeSelectedRows(
        rows,
        this.formModel.aftList,
        (pack, item) => {
          return pack.packId == item.packId;
        }
      );
    },
    getFormModel: function() {
      let entity = this.$options.parent.propsData.entity;
      //如果是新增模式，初始化值
      if (entity.method == operTypeEnum.OPER_ADD) {
        this.$set(entity, "transferNo", this.$commonUtil.appConst.nullNo);
        this.$set(
          entity,
          "creatorName",
          this.$commonUtil.appConst.getCurrUserName()
        );
        this.$set(entity, "createTime", null);
        this.$set(entity, "transferStatus", null);
        this.$set(entity, "auditorName", null);
        //默认选择首入库时间
        this.$set(entity, "cstInTimeType", 1);
        let transferTime = util.formatDate.format(
          new Date(new Date().toLocaleDateString()),
          "yyyy-MM-dd hh:mm:ss"
        );
        this.$set(entity, "transferTime", transferTime);
        this.$set(entity, "preList", []);
        this.$set(entity, "aftList", []);
      }
      //否则进行一次数据转换
      else if (!entity.aftList) {
        this.$set(entity, "cstInTimeType", entity.cstInTimeType);
        entity.aftList = entity.detailList;
      }
      return entity;
    },
    //初始化界面状态
    initFormState: function() {
      var $this = this;
      switch (this.formModel.method) {
        case operTypeEnum.OPER_ADD: {
          this.config.allowEdit = true;
          this.$refs["btn_settle"].setDisabled(true);
          this.$refs["btn_print"].setDisabled(true);
          break;
        }
        case operTypeEnum.OPER_EDIT: {
          this.calcUnit(this.formModel.aftList);
          this.formModel.preList = this.$commonUtil.deepClone(
            this.formModel.aftList,
            $this
          );
          this.config.allowEdit = true;
          this.$refs["btn_settle"].setDisabled(true);
          break;
        }
        case operTypeEnum.OPER_ADJUST: {
          this.calcUnit(this.formModel.aftList);
          this.formModel.preList = this.$commonUtil.deepClone(
            this.formModel.aftList
          );
          this.config.allowEdit = true;
          // this.$refs["form_cstInTimeType"].setDisabled(true);
          this.$refs["btn_saveAndAudit"].setDisabled(true);
          break;
        }
        case operTypeEnum.OPER_CHECK: {
          this.calcUnit(this.formModel.aftList);
          this.formModel.preList = this.$commonUtil.deepClone(
            this.formModel.aftList
          );
          this.config.allowEdit = false;
          this.formReadOnly = true;
          this.$refs["btn_selectProduct"].setDisabled(true);
          this.$refs["btn_remove"].setDisabled(true);
          this.$refs["btn_save"].setDisabled(true);
          this.$refs["btn_saveAndAudit"].setDisabled(true);
          this.$refs["btn_settle"].setDisabled(false);
          break;
        }
      }
      let hasSaveAuth = this.$commonUtil.permission.hasSaveAuth(this);
      let hasCheckAuth = this.$commonUtil.permission.hasCheckAuth(this);
      let hasPrintAuth = this.$commonUtil.permission.hasPrintAuth(this);
      if (!hasSaveAuth) {
        this.$refs["btn_save"].setDisabled(true);
        this.$refs["btn_saveAndAudit"].setDisabled(true);
      }
      if (!hasCheckAuth) {
        this.$refs["btn_saveAndAudit"].setDisabled(true);
      }
      if (!hasPrintAuth) {
        this.$refs["btn_print"].setDisabled(true);
      }
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
    //刷新主单方法
    refreshMain: function() {
      var parent = this.$options.parent.propsData.parentView;
      if (parent && parent.queryData) {
        parent.queryData();
      }
    },
    saveInfo: function() {
      //组装请求参数对象
      let submitModel = this.getEntity();
      if (!submitModel) {
        return;
      }
      //实体校验
      var $this = this;
      if (this.formModel.method == operTypeEnum.OPER_ADD) {
        //新增
        this.baseSave(
          "whsTransfer/addTransferNote",
          submitModel,
          "新增过户单成功",
          data => {
            $this.save2Update(data);
          }
        );
      } else if (this.formModel.method == operTypeEnum.OPER_EDIT) {
        //修改
        this.baseSave(
          "whsTransfer/updateTransferNote",
          submitModel,
          "修改过户单成功",
          data => {
            $this.save2Update(data);
          }
        );
      } else if (this.formModel.method == operTypeEnum.OPER_ADJUST) {
        //修改
        this.baseSave(
          "whsTransfer/updateTransferNote",
          submitModel,
          "调整过户单成功"
        );
      }
    },
    //保存后跳到修改界面
    save2Update: function(data) {
      for (var p in data) {
        if (p == "aftList") {
          var aftList = this.formModel[p];
          var aftListD = data[p];
          for (var i = 0; i < aftListD.length; i++) {
            for (var prop in aftListD[i]) {
              //定义双向绑定
              delete aftList[i][prop];
              this.$set(aftList[i], prop, aftListD[i][prop]);
            }
          }
        } else {
          this.formModel[p] = data[p];
        }
      }
      this.formModel.method = operTypeEnum.OPER_EDIT;
      this.$commonUtil.tab.updateTitle(
        this,
        "编辑过户单[" + data.transferNo + "]"
      );
    },
    //审核后跳到查看界面
    audit2Check: function(data) {
      for (var p in data) {
        if (p == "aftList") {
          var aftList = this.formModel[p];
          var aftListD = data[p];
          for (var i = 0; i < aftListD.length; i++) {
            for (var prop in aftListD[i]) {
              //定义双向绑定
              delete aftList[i][prop];
              this.$set(aftList[i], prop, aftListD[i][prop]);
            }
          }
        } else {
          this.formModel[p] = data[p];
        }
      }
      this.formModel.method = operTypeEnum.OPER_CHECK;
      this.$commonUtil.tab.updateTitle(
        this,
        "查看过户单[" + data.transferNo + "]"
      );
    },
    //基础保存方法
    baseSave: function(url, submitModel, msg, callback) {
      var $this = this;
      this.$httpUtil.post(url, submitModel, data => {
        $this.$message({
          message: msg,
          type: "success"
        });
        if (callback) {
          callback(data);
        }
        //重新刷新表单
        $this.initFormState();
        //刷新主界面数据
        $this.refreshMain();
      });
    },
    validInfo: function(info) {
      if (!info.oldCstId)
        this.$commonUtil.valid.throwEx(this, "原货主信息不能为空!");
      if (!info.newCstId)
        this.$commonUtil.valid.throwEx(this, "新货主信息不能为空!");
      if (!info.aftList || !info.aftList.length > 0)
        this.$commonUtil.valid.throwEx(this, "明细信息不能为空!");
      let brands = cacheUtil.getDic().BrandNameList.list;
      info.aftList.forEach(a => {
        if (a.netWeight <= 0 || a.grossWeight < 0 || a.poundWeight < 0)
          this.$commonUtil.valid.throwEx(this, "过户单明细中重量必须大于0!");
        let brand = brands.filter(item => item.id === a.brandId)[0];
        if (a.amount <= 0 && brand.whsoutType != 2)
          this.$commonUtil.valid.throwEx(this, "过户单明细中数量必须大于0!");
      });
    },
    getEntity: function() {
      //判断货主是否需要自动添加
      if (this.formModel.createCstName) {
        this.createCst();
        return null;
      } else {
        this.$refs["inForm"].validate(this);
        this.validInfo(this.formModel);
        //深拷贝
        let submitModel = JSON.parse(JSON.stringify(this.formModel));
        //计算合计值
        submitModel.totalAmount = submitModel.aftList.sum(a => a.amount);
        submitModel.totalNetWeight = submitModel.aftList.sum(a => a.netWeight);
        submitModel.totalGrossWeight = submitModel.aftList.sum(
          a => a.grossWeight
        );
        submitModel.totalPoundWeight = submitModel.aftList.sum(
          a => a.poundWeight
        );
        return submitModel;
      }
    },
    createCst: function(callback) {
      let _this = this;
      this.$confirm(
        this.formModel.createCstName + "该货主不存在！是否需要自动创建",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let requestModel = {};
          requestModel.cstFullName = _this.formModel.createCstName;
          requestModel.cstShortName = _this.formModel.createCstName;
          httpUtil.post("cst/addCstFast", requestModel, data => {
            _this.$message({
              message: "货主创建成功！",
              type: "success"
            });
            _this.formModel.newCstId = data.id;
            _this.formModel.createCstName = null;
            if (callback) {
              callback(data);
            }
          });
        })
        .catch(() => {
          return;
        });
    },
    //保存并审核
    saveAndAuditInfo: function() {
      let submitModel = this.getEntity();
      if (!submitModel) {
        return;
      }
      var $this = this;
      this.baseSave(
        "whsTransfer/SaveAndAuditTransferNote",
        submitModel,
        "保存并审核过户单成功",
        data => {
          $this.audit2Check(data);
        }
      );
    },
    printInfo: function() {
      let _this = this;
      let info = JSON.parse(JSON.stringify(this.formModel));
      this.$commonUtil.getDetailEntity(
        "whsTransfer/getTransferDetail",
        { id: info.id },
        info,
        function(entity) {
          _this.$refs.print.printDiv(entity);
        }
      );
    },
    settleInfo: function() {
      let _this = this;
      let info = JSON.parse(JSON.stringify(this.formModel));
      if (info.transferStatus != 2) {
        this.$commonUtil.valid.throwEx(this, "当前过户单状态无法进行结算！");
      }
      info.detailList = info.preList;
      this.wrapData(info);
      const costBalanceItem = {
        component: costBalanceAddManage,
        propsData: { entity: info },
        name: "新增结算单"
      };
      this.$tab.open(costBalanceItem);
    },
    closeWin: function() {
      this.$commonUtil.tab.close(this);
    },
    wrapData(entity) {
      entity.businessNo = entity.transferNo;
      entity.cstId = entity.oldCstId;
      entity.businessType = 4;
      entity.createDate = entity.createTime;
      entity.creatorData = entity.creator;
      if (!entity.detailList) {
        return;
      }
      entity.detailList.forEach(element => {
        element.material = element.textureId;
        element.productPlace = element.producingId;
        element.businessNo = element.transferNo;
        element.transferDate = element.auditTime;
        element.whsInFirstDate = element.whsinTime;
        element.createDate = element.createTime;
        element.numFin = element.amount;
        element.transferNum = element.transferTimes;
        element.businessType = 4;
        element.costDate = element.costTime;
      });
      entity.detail = entity.detailList;
    }
  }
};
</script>

<style scoped>
</style>
