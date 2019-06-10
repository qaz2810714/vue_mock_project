<template>
  <el-container class="edit_padding">
    <el-main>
      <pm_form_render
        :model="formModel"
        :entity="$metaData.wmsNoteAdjust"
        :formReadOnly="formReadOnly"
        :rules="rules"
        :change="form_change"
        ref="mainForm"
      >
        <pm_form_item
          row="1"
          labletext="调整单号"
          name="adjustNo"
          :span="6"
          xtype="text"
          lableWidth="80px"
          :readOnly="true"
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
          :span="6"
          xtype="text"
          lableWidth="80px"
          :readOnly="true"
        ></pm_form_item>
        <pm_form_item
          row="1"
          labletext="制单时间"
          name="createTime"
          :span="6"
          xtype="datetime"
          lableWidth="80px"
          :readOnly="true"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="审核人"
          name="auditorName"
          :span="6"
          xtype="text"
          lableWidth="80px"
          :readOnly="true"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="审核时间"
          name="auditTime"
          :span="6"
          xtype="datetime"
          lableWidth="80px"
          :readOnly="true"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="状态"
          name="status"
          :span="6"
          xtype="select"
          lableWidth="80px"
          :readOnly="true"
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="调整类型"
          name="adjustType"
          :span="6"
          xtype="select"
          lableWidth="80px"
        ></pm_form_item>
        <pm_form_item
          row="3"
          labletext="调整原因"
          name="remark"
          :span="24"
          xtype="textarea"
          lableWidth="80px"
        ></pm_form_item>
      </pm_form_render>
      <!-- toolbar工具条部分 -->
      <pm_tool_bar>
        <pm_toolButton
          btnName="选择明细"
          ref="btn_getstock"
          btnIcon="el-icon-sold-out"
          :btnClickFunc="getStock"
        ></pm_toolButton>
        <pm_toolButton
          btnName="移除"
          ref="btn_remove"
          btnIcon="el-icon-remove"
          :btnClickFunc="deleteRows"
        ></pm_toolButton>
      </pm_tool_bar>
      <pm_table ref="pmTable" tableKey="NoteAdjustEdit-pmTable" :dataSource="formModel.showDbList" :config="config" :bottomHeight="170">
        <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
        :callback="requestTransactionLogs" renderType="input"></vue_column>-->
        <pm_column prop="packNo" label="捆包号" width="150" :min="1" :max="50" required></pm_column>
        <pm_column prop="cstId" label="货主" :cellCanEdit="cellCanEdit" width="200" required></pm_column>
        <pm_column prop="cardNo" label="卡号" width="120"></pm_column>
        <pm_column prop="brandId" label="品名(品种)" width="150" required></pm_column>
        <pm_column prop="textureId" label="材质(钢种)" width="100" watchField="brandId" required></pm_column>
        <pm_column prop="spec" label="规格" width="120" required></pm_column>
        <pm_column prop="producingId" label="产地" width="200" required></pm_column>
        <pm_column prop="calcType" label="计重方式" width="100" required></pm_column>
        <pm_column prop="measurementUnit" label="数量单位" width="100" required></pm_column>
        <pm_column prop="unitNumber" label="单包支数" width="100" required></pm_column>
        <pm_column prop="amount" label="数量" width="150"></pm_column>
        <pm_column prop="netWeight" label="净重" width="150"></pm_column>
        <pm_column prop="grossWeight" label="毛重" width="150"></pm_column>
        <pm_column prop="poundWeight" label="磅重" width="150"></pm_column>
        <pm_column prop="whsCalcStackId" label="库区" width="160" required></pm_column>
        <pm_column prop="whsStackName" label="库位" width="70"></pm_column>
        <pm_column prop="whsLayer" label="层级" width="70"></pm_column>
        <pm_column prop="remark" label="备注" width="200"></pm_column>
        <pm_column prop="manufactureTime" label="出厂日期" width="160"></pm_column>
        <pm_column prop="stoveCode" label="炉号" width="100"></pm_column>
        <pm_column prop="whsinTime" label="首入库日期" width="160"></pm_column>
        <pm_column prop="costTime" label="货主入库时间" width="160"></pm_column>
        <pm_column prop="transferTimes" label="过户次数" width="100"></pm_column>
      </pm_table>
    </el-main>
    <el-footer style="padding:0px;">
      <!-- toolbar工具条部分 -->
      <pm_tool_bar :noBackground="true">
        <pm_toolButton
          btnName="保存"
          ref="btn_save"
          btnIcon="el-icon-success"
          :btnClickFunc="saveInfo"
        ></pm_toolButton>
        <pm_toolButton
          btnName="保存&amp;审核"
          ref="btn_check"
          btnIcon="el-icon-circle-check-outline"
          :btnClickFunc="saveAndAuditInfo"
        ></pm_toolButton>
        <pm_toolButton btnName="打印" ref='btn_print' btnIcon="el-icon-printer" :btnClickFunc="printFunc"></pm_toolButton>
        <pm_toolButton btnName="关闭" btnIcon="el-icon-close" :btnClickFunc="closeWin"></pm_toolButton>
      </pm_tool_bar>
      <noteAdjustPrint ref="print" v-show="false"></noteAdjustPrint>
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
import extend from "./adjustEditExtend";
import noteAdjustPrint from "./NoteAdjustPrint";

export default {
  components: {
    x_table: Table,
    pm_search,
    pm_form_item,
    pm_table,
    pm_column,
    pm_toolButton,
    pm_tool_bar,
    noteAdjustPrint
  },
  data: function() {
    return {
      rules: {
        cstId: [{ required: true, message: "请输入货主单位", trigger: "blur" }]
      },
      const: {
        statusEnum: this.$metaData.wmsNoteAdjust.statusEnum,
        adjustType: this.$metaData.wmsNoteAdjust.adjustType
      },
      dataSource: [],
      formModel: Object,
      formReadOnly:false,
      adjustType: Number,
      adjustStrategy:Object,//调整策略
      config: {
        entity: metadata.wmsNoteAdjustDetail,
        allowEdit: true,
        multiple: true,
        sortable: false,
        height: 240,
        rowCanEdit: function(obj) {
          return true;
          //if (obj.cstName == null) return false;
          //return obj.cstName.includes("江阴");
        },
        change: this.cellValueChange
      }
    };
  },
  created() {
    this.formModel = this.getFormModel();
    this.adjustType = this.formModel.adjustType;
  },
  mounted() {
    //初始化form状态
    this.initFormState();
  },
  watch: {
    formModel: {
      handler: function(val) {
        this.adjustType = val.adjustType;
      },
      deep: true
    },
    adjustType(val){
      //调整单类型改变
      this.adjustStrategy = extend.getAdjustStrategy(this,val);
    }
  },
  methods: {
    btn_func_search: function() {},
    btn_func_reset: function() {},
    btn_func: function() {},
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
        "whsadjust/getList",
        "whsadjust/getDetailList",
        { page: 0, size: 10000, adjustId: this.formModel.id },
        entity=>{
          $this.$refs.print.printDiv(entity);
        }
      );
    },
    getParam: function() {
      console.log(this.formModel);
      this.$refs["demoForm"].validate();
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
        this.$set(entity, "adjustNo", this.$commonUtil.appConst.nullNo);
        this.$set(entity,"creatorName",this.$commonUtil.appConst.getCurrUserName());
        this.$set(entity, "status", this.const.statusEnum.STATUS_READY);
        this.$set(entity, "adjustType", this.const.adjustType.Type_Normal);
        this.$set(entity, "detailList", []);
        this.$set(entity, "oldDetails", []);
        this.$set(entity, "oriDbList", []);
        this.$set(entity, "showDbList", []);
      }
      return entity;
    },
    closeWin: function() {
      this.$commonUtil.tab.close(this);
    },
    //初始化form表单状态
    initFormState: function() {
      if (this.formModel.detailList) {
        //编辑模式
        this.calcUnit(this.formModel.detailList);
        this.$set(
          this.formModel,
          "oldDetails",
          this.$commonUtil.deepClone(this.formModel.detailList)
        );
        this.$set(
          this.formModel,
          "oriDbList",
          this.$commonUtil.deepClone(
            this.formModel.detailList.filter(a => a.ori)
          )
        );
        this.$set(
          this.formModel,
          "showDbList",
          this.$commonUtil.deepClone(
            this.formModel.detailList.filter(a => !a.ori)
          )
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
      if (!hasSaveAuth || this.formModel.status != this.const.statusEnum.STATUS_READY) {
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
      var remove = (list,packId)=>{
          //逆向赋值，完成删除操作
          return list.filter(a=>a.packId != packId);
      };
      //从数据源中移除数据
      this.$commonUtil.removeRows(
        rows,
        row => {
          $this.formModel.detailList = remove($this.formModel.detailList,row.packId);
          $this.formModel.oldDetails = remove($this.formModel.oldDetails,row.packId);
          $this.formModel.oriDbList = remove($this.formModel.oriDbList,row.packId);
          $this.formModel.showDbList = remove($this.formModel.showDbList,row.packId);
        }
      );
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
    /**
     * 挑选产品
     */
    getStock: function() {
      var filter = this.adjustStrategy.getFilter();
      filter.cstId = this.formModel.cstId;
      //this.config.allowEdit = true;
      var $this = this;
      this.$commonUtil.selProduct(this, filter, function(stocks) {
        var packNoList = [];
        stocks.forEach(a => {
          if ($this.formModel.showDbList.find(item => item.packId == a.id)) {
            packNoList.push(a.packNo);
            return;
          }
          a.ori = false;
          a.relation = $this.$commonUtil.appConst.NewGuid();
          $this.$set(a,'packId', a.id);
          $this.$set(a,'id', null);
          $this.$set(a,'cardNo', a.cstPackNo);
          $this.$set(a,'whsLayer', a.whsLayerId);
          $this.$set(a,'amount', a.usableNum);
          $this.$commonUtil.calUnitWeight(
            a,
            a.netWeight,
            a.grossWeight,
            a.poundWeight,
            a.amount
          );
          $this.adjustStrategy.addNewDetailSetting(a);
          $this.formModel.showDbList.push(a);
          $this.formModel.detailList.push(a);
          //生成一条旧值信息
          var old = $this.$commonUtil.deepClone(a);
          old.ori = true;
          $this.formModel.oldDetails.push(old);
          $this.formModel.oriDbList.push(old);
          $this.formModel.detailList.push(old);
        });
        if (packNoList.length > 0) {
          $this.$commonUtil.message.alert(
            "捆包[" + packNoList.join(",") + "]已经存在，不允许重复添加!"
          );
        }
      });
    },
    //----------- form变更事件 begin -----------------
    form_change:function(prop, val,selected){
      if(prop=="cstId" && selected){
        this.formModel.cstName = selected.cstFullName;
      }
    },
    //------------------------------------------------
    //----------- 单元格变更事件 begin -----------------
    /**
     * 值改变事件
     */
    cellValueChange: function(row, prop, val,selected) {
      if(prop=="cstId" && selected){
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
      var valid = val=>{
        return val != null && val != 0;
      };
      if (prop == "amount") {
        if (valid(row.netUnit)) {
          row.netWeight = this.$commonUtil.calc.fixThree(val * row.netUnit);
        }
        if (valid(row.grossUnit)) {
          row.grossWeight = this.$commonUtil.calc.fixThree(val * row.grossUnit);
        }
        if (valid(row.poundUnit)) {
          row.poundWeight = this.$commonUtil.calc.fixThree(val * row.poundUnit);
        }
      }
    },
    //数据验证
    data_valid: function(row, prop, val) {
      var validList = this.formModel.oldDetails.concat(this.formModel.oriDbList);
      var old = validList.find(a => a.packId == row.packId);
      if (old == null) old = row;
      var $this = this;
      this.adjustStrategy.getValidRules()
        .filter(a => a.fieldName == prop)
        .forEach(rule => {
          if (rule.validFunc(row, old, $this)) {
            $this.$commonUtil.valid.throwEx(rule.msg);
          }
        });
    },
    //----------------------------------------------
    //-------------- 保存事件 begin -----------------
    //刷新列表
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
      submitModel.detailList = this.formModel.showDbList.concat(this.formModel.oriDbList);
      var sumList = submitModel.detailList.filter(a=>!a.ori);
      submitModel.totalAmount = extend.sum(sumList,a => a.amount);
      submitModel.totalNetWeight = extend.sum(sumList,a => a.netWeight);
      submitModel.totalGrossWeight = extend.sum(sumList,a => a.grossWeight);
      submitModel.totalPoundWeight = extend.sum(sumList,a => a.poundWeight);
      return submitModel;
    },
    entity_valid: function(data) {
      var $this = this;
      this.$refs.pmTable.validator();
      if (data.detailList == null || data.detailList.length == 0) {
        this.$commonUtil.valid.throwEx("请至少添加一条捆包信息");
      }
      //明细校验
      var validList = this.formModel.oldDetails.concat(this.formModel.oriDbList);
      var data_rules = this.adjustStrategy.getValidRules();
      data.showDbList.forEach(note => {
        var old = validList.find(a => a.packId == note.packId);
        if (old == null) old = note;
        data_rules.forEach(rule => {
          if (rule.validFunc(note, old, $this)) {
            $this.$commonUtil.valid.throwEx(rule.msg);
          }
        });
      });
      //校验packno是否重复
      var repeatNo = [];
      var groups = data.showDbList.group(a => a.packNo);
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
          this.baseSave("whsadjust/add", submitModel, "保存调整单成功", data => {
            $this.updateTitle("编辑调整单[" + data.adjustNo + "]");
          });
        } else {
          //修改
          this.baseSave("whsadjust/update", submitModel, "保存调整单成功");
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
            "whsadjust/addAndCheck",
            submitModel,
            "保存并审核成功",
            data => {
              $this.updateTitle("编辑调整单[" + data.adjustNo + "]");
            }
          );
        } else {
          //修改
          this.baseSave("whsadjust/updateAndCheck", submitModel, "保存并审核成功");
        }
      });
    },
    printInfo:function(){
      //测试一下数据刷新
      // this.formModel.lockNo = "测试中。。。";
      // this.formModel.status = 2;
    },
    //基础保存方法
    baseSave: function(url, submitModel, msg, callback) {
      var $this = this;
      //服务端需要这个属性，客户端已经将数据组装到了 detailList 字段中
      submitModel.oldList = [];
      this.$httpUtil.post(url, submitModel, data => {
        $this.$message({
          message: msg,
          type: "success"
        });
        for(var p in data){
          $this.$set($this.formModel,p,data[p]);
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
    //-----------------------------------------------
  }
};
</script>