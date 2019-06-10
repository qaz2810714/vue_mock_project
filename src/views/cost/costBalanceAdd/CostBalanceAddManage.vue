<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- form表单显示区域 -->
        <pm_form_render :model="formModel" :rules="rules" ref="demoForm">
          <pm_form_item
            row="1"
            labletext="货主单位"
            name="cstId"
            :span="7"
            xtype="select"
            lableWidth="100px"
            :readOnly="true"
            required
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="结算单位"
            name="balanceCompanyId"
            :span="7"
            xtype="select"
            lableWidth="100px"
            required
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="结算清单号"
            name="balanceNo"
            :span="10"
            xtype="text"
            lableWidth="100px"
            :readOnly="true"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="结算方式"
            name="balanceType"
            :span="7"
            xtype="select"
            lableWidth="100px"
            required
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="付款方式"
            name="payType"
            :span="7"
            xtype="select"
            lableWidth="100px"
            watchField="balanceType"
            required
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="结算计重"
            name="weightType"
            :span="10"
            xtype="radio"
            :radioGroup="group"
            lableWidth="100px"
            required
          ></pm_form_item>
          <pm_form_item
            row="3"
            labletext="实结金额"
            name="actMoney"
            :span="4"
            xtype="text"
            lableWidth="100px"
          ></pm_form_item>
          <pm_form_item
            row="3"
            labletext="确认已结"
            name="isBalance"
            :span="3"
            xtype="check"
            lableWidth="100px"
          ></pm_form_item>
          <pm_form_item
            row="3"
            labletext="建档日期"
            name="createDate"
            :span="7"
            xtype="date"
            lableWidth="100px"
            required
          ></pm_form_item>
          <pm_form_item
            row="3"
            labletext="建档人"
            name="creatorName"
            :span="10"
            xtype="text"
            lableWidth="100px"
            :readOnly="true"
            required
          ></pm_form_item>
          <pm_form_item
            row="4"
            labletext="备注"
            name="remark"
            :span="24"
            xtype="textarea"
            lableWidth="100px"
          ></pm_form_item>
        </pm_form_render>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <!-- toolbar工具条部分 -->
        <el-tabs type="border-card">
          <el-tab-pane label="结算清单明细">
            <pm_tool_bar>
              <pm_toolButton
                ref="selectDetail"
                btnName="挑选待结算计费单"
                btnIcon="el-icon-circle-plus"
                :btnClickFunc="selectDetail"
                :btnDisabled="selectBtn"
              ></pm_toolButton>
              <pm_toolButton
                ref="addDetail"
                btnName="新增明细"
                btnIcon="el-icon-circle-plus-outline"
                :btnClickFunc="addDetail"
                :btnDisabled="changeBtn"
              ></pm_toolButton>
              <pm_toolButton
                ref="deleteDetail"
                btnName="移除"
                btnIcon="el-icon-remove-outline"
                :btnClickFunc="deleteDetail"
              ></pm_toolButton>
              <pm_toolButton
                ref="addCostBill"
                btnName="保存计费单"
                btnIcon="el-icon-circle-check-outline"
                :btnClickFunc="addCostBill"
                :btnDisabled="changeBtn"
              ></pm_toolButton>
              <pm_toolButton
                ref="addCostBalanceBill"
                btnName="保存结算单"
                btnIcon="el-icon-circle-check"
                :btnClickFunc="addCostBalanceBill"
                :btnDisabled="costBtn"
              ></pm_toolButton>
              <pm_toolButton
                ref="printCostBalanceBill"
                btnName="打印结算单"
                btnIcon="el-icon-printer"
                :btnClickFunc="printCostBalanceBill"
                :btnDisabled='true'
              ></pm_toolButton>
              <pm_toolButton
                ref="clearDetail"
                btnName="清空"
                btnIcon="el-icon-delete"
                :btnClickFunc="clearDetail"
              ></pm_toolButton>
            </pm_tool_bar>
            <pm_table
              ref="pmTable1"
              :dataSource="dataSource1"
              tableKey="CostBalanceAddManage-pmTable1"
              :config="config1"
              :bottomHeight="345"
            >
              <pm_column prop="costType" label="费用类型" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="businessNo" label="业务单据号" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="packNo" label="捆包号" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="whsDayNum" label="仓储天数" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="whsFreeDayNum" label="免仓储天数" width="150" placeholder></pm_column>
              <pm_column prop="transferNum" label="过户次数" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="numFin" label="商品数量" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="netWeight" label="商品净重" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="grossWeight" label="商品毛重" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="poundWeight" label="商品磅重" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="balancePreNum" label="待结算量" width="150" placeholder></pm_column>
              <pm_column prop="unitprice" label="结算单价" width="150" placeholder></pm_column>
              <pm_column prop="regularUnit" label="计费单位" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="settleExpress" label="计算公式" width="300" placeholder :canEdit='false'></pm_column>
              <pm_column prop="settleAmt" label="应结金额" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="settleActAmt" label="实结金额" width="150" placeholder></pm_column>
              <pm_column prop="brandId" label="品名" width="180" placeholder="请输入货主内容" :canEdit='false'></pm_column>
              <pm_column prop="textureId" label="材质" width="150" watchField="brandId" :canEdit='false'></pm_column>
              <pm_column prop="spec" label="规格" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="producingId" label="产地" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="cardNo" label="卡号" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="balanceNode" label="结算节点" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="businessType" label="业务类型" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="createTime" label="单据生成时间" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column
                prop="oriPackNo"
                label="原捆包号"
                width="150"
                parentPropName="whsRoomId"
                childPropName="whsAreaId"
                :canEdit='false'
              ></pm_column>
              <pm_column prop="rangeApply" label="应用范围" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="whsInFirstDate" label="首次入库日期" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="transferDate" label="过户日期" width="150" placeholder :canEdit='false'></pm_column>
              <pm_column prop="remark" label="备注" width="200" placeholder></pm_column>
            </pm_table>
          </el-tab-pane>
          <el-tab-pane label="历史清单明细">
            <pm_tool_bar></pm_tool_bar>
            <pm_table
              ref="pmTable2"
              tableKey="CostBalanceAddManage-pmTable2"
              :dataSource="dataSource2"
              :config="config2"
              :bottomHeight="410"
            >
              <pm_column prop="packNo" label="捆包号" width="150" placeholder></pm_column>
              <pm_column prop="brandId" label="品名" width="180" placeholder></pm_column>
              <pm_column prop="textureId" label="材质" width="150" watchField="brandId"></pm_column>
              <pm_column prop="spec" label="规格" width="150" placeholder></pm_column>
              <pm_column prop="producingId" label="产地" width="150" placeholder></pm_column>
              <pm_column
                prop="costType"
                label="费用类型"
                :min="0"
                :step="0.001"
                width="150"
                placeholder
              ></pm_column>
              <pm_column prop="whsDayNum" label="仓储天数" width="150" placeholder></pm_column>
              <pm_column
                prop="whsFreeDayNum"
                label="免仓储天数"
                :min="0"
                :step="1"
                width="150"
                placeholder
              ></pm_column>
              <pm_column prop="transferNum" label="过户次数" width="150" placeholder></pm_column>
              <pm_column prop="unitprice" label="结算单价" width="150" placeholder></pm_column>
              <pm_column prop="settleExpress" label="结算公式" width="150" placeholder></pm_column>
              <pm_column prop="regularUnit" label="计费单位" width="150" placeholder></pm_column>
              <pm_column
                prop="settleActAmt"
                label="结算金额"
                width="150"
                parentPropName="whsRoomId"
                childPropName="whsAreaId"
              ></pm_column>
              <pm_column prop="numFin" label="商品数量" width="150" placeholder></pm_column>
              <pm_column prop="netWeight" label="商品净重" width="150" placeholder></pm_column>
              <pm_column prop="grossWeight" label="商品毛重" width="150" placeholder></pm_column>
              <pm_column prop="poundWeight" label="商品磅重" width="150" placeholder></pm_column>
              <pm_column prop="businessType" label="业务类型" width="150" placeholder></pm_column>
              <pm_column prop="businessNo" label="业务单据号" width="150" placeholder></pm_column>
              <pm_column
                prop="createDate"
                label="生成日期"
                width="150"
                parentPropName="whsRoomId"
                childPropName="whsAreaId"
              ></pm_column>
              <pm_column prop="regularDetailNo" label="价格规则明细号" width="150" placeholder></pm_column>
              <pm_column prop="oriPackNo" label="原捆包号" width="150" placeholder></pm_column>
              <pm_column prop="balanceStatus" label="结算状态" width="150" placeholder></pm_column>
              <pm_column prop="cardNo" label="卡号" width="150" placeholder></pm_column>
              <pm_column prop="remark" label="结算清单号" width="150" placeholder></pm_column>
            </pm_table>
            <pm_pagination :totalSize="totalSize" :queryData="getList"></pm_pagination>
          </el-tab-pane>
        </el-tabs>
      </metro_page_box_body>
    </metro_page_box>
  </metro_page>
</template>

<script>
import metro_page from "@/components/vitems/pageContainer/metro_page";
import metro_page_box from "@/components/vitems/pageContainer/metro_page_box";
import metro_page_box_tool_bar from "@/components/vitems/pageContainer/metro_page_box_tool_bar";
import metro_page_box_body from "@/components/vitems/pageContainer/metro_page_box_body";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import pm_radio from "@/components/common/radio/pm_radio";
import metadata from "@/common/entities/Metadata";
import commonUtil from "@/common/utils/CommonUtils";
import cacheUtil from "@/common/utils/CacheUtil";
import httpUtil from "@/common/utils/HttpUtil";
import pm_pagination from "@/components/common/table/pm_pagination";
import costSelectItem from "@/views/cost/costBalanceManage/CostSelectItem";
import costbalanceAddEdit from "./CostBalanceAddEdit";
import util from '@/common/js/util.js';
import { setTimeout } from "timers";
export default {
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_tool_bar,
    pm_tool_bar,
    pm_toolButton,
    pm_table,
    pm_column,
    metro_page_box_body,
    pm_form_item,
    pm_radio,
    pm_pagination
  },
  data: function() {
    return {
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      config1: {
        entity: metadata.regular,
        allowEdit: true,
        multiple: false
      },
      config2: {
        entity: metadata.regular,
        allowEdit: false,
        multiple: false
      },
      rules: {},
      counter: 0,
      totalSize: 0,
      group: [
        { key: 1, value: "净重" },
        { key: 2, value: "毛重" },
        { key: 3, value: "磅重" }
      ],
      formModel: {},
      changeBtn:false,
      selectBtn:false,
      costBtn:false,
    };
  },
  created() {
    this.formModel = this.getFormModel();
  },
  watch: {
    weightType(val, oldVal) {
      if (oldVal != undefined) {
        var $this = this;
        $this.changeDetail(val);
      }
    }
  },
  computed: {
    weightType() {
      return this.formModel.weightType;
    }
  },
  mounted(){
    if(this.formModel.businessOtherNo != undefined){
      this.changeBtn=true;
    }
  },
  methods: {
    getFormModel() {
      var entity = this.$options.parent.propsData.entity;
      entity.balanceCompanyId=entity.cstId;
      entity.actMoney=0;
      entity.detailList.forEach(a=>{
        a.balanceNode=a.businessType;
      });
      if (entity.businessOtherNo != undefined) {
        entity.businessNo = entity.businessOtherNo;
        this.$set(entity,"weightType",entity.balanceWeightType);
          entity.detailList.forEach(a=>{
            a.regularUnit=parseInt(a.regularUnit);
            a.balanceNode=undefined;
          if(a.costType==1){
            this.$set(a,"settleExpress","结算单价*待结算量*(仓储天数-免仓储天数)");
            this.$set(a,"settleAmt",a.unitprice * a.balancePreNum * (a.whsDayNum - a.whsFreeDayNum));
            this.$set(a,"settleActAmt",a.unitprice * a.balancePreNum * (a.whsDayNum - a.whsFreeDayNum));      
          }else{
            if(entity.balanceWeightType==1){
              this.$set(a,"settleExpress","结算单价*商品净重");
              this.$set(a,"settleAmt",a.unitprice * a.netWeight);
              this.$set(a,"settleActAmt",a.unitprice * a.netWeight);
            }else if(entity.balanceWeightType==2){
              this.$set(a,"settleExpress","结算单价*商品毛重");
              this.$set(a,"settleAmt",a.unitprice * a.grossWeight);
              this.$set(a,"settleActAmt",a.unitprice * a.grossWeight);
            }else{
              this.$set(a,"settleExpress","结算单价*商品磅重");
              this.$set(a,"settleAmt",a.unitprice * a.poundWeight);
              this.$set(a,"settleActAmt",a.unitprice * a.poundWeight);
            }
          }         
        });
        this.dataSource1=entity.detailList;
      }
      else{
        entity.balanceWeightType=entity.weightType;
      }
      entity.remark = "";
      entity.balanceNo = this.$commonUtil.appConst.nullNo;
      this.dataSource = entity.detailList;
      console.log(entity);
      return entity;
    },
    getDate:function(date1,date2){
      var dateStart=date1.substr(0,10);
      var dateEnd=date2.substr(0,10);
      var d1=new Date(dateStart);
      var d2=new Date(dateEnd);
      var iDays = (d2-d1) / 1000 / 60 / 60 /24;//把相差的毫秒数转换为天数
      return iDays+1 ;
		},
    changeDetail: function(val) {
	  var $this = this;
      this.$refs.pmTable1.updateRow((a, index) => {
        if (a.costType == 1) {
          if (val == 1) {
            a.balancePreNum = a.netWeight;
          } else if (val == 2) {
            a.balancePreNum = a.grossWeight;
          } else {
            a.balancePreNum = a.poundWeight;
          }
          $this.$set(
            a,
            "settleExpress",
            "结算单价*待结算量*(仓储天数-免仓储天数)"
          );
          a.settleAmt =
            a.unitprice * a.balancePreNum * (a.whsDayNum - a.whsFreedayNum);
          a.settleActAmt = a.settleAmt;
        } else {
          if (val == 1) {
            a.balancePreNum = a.netWeight;
            a.settleAmt = a.unitprice * a.netWeight;
            a.settleActAmt = a.settleAmt;
            $this.$set(a, "settleExpress", "结算单价*商品净重");
          } else if (val == 2) {
            a.balancePreNum = a.grossWeight;
            a.settleAmt = a.unitprice * a.grossWeight;
            a.settleActAmt = a.settleAmt;
            $this.$set(a, "settleExpress", "结算单价*商品毛重");
          } else {
            a.balancePreNum = a.poundWeight;
            a.settleAmt = a.unitprice * a.poundWeight;
            a.settleActAmt = a.settleAmt;
            $this.$set(a, "settleExpress", "结算单价*商品磅重");
          }
        }
      });
    },
    queryData: function(param) {
      if (!param.size) {
        param.size = this.$refs.pager.pageSize;
      }
      var table = this;
      httpUtil.post("balance/queryBalanceDetail", param, data => {
        data.content.forEach(a=>{
          a.producingId=a.productPlace;
          a.textureId=a.material;
          a.unitprice=a.settleUnitprice;
        });
        table.dataSource2 = data.content;
        table.totalSize = data.total;
      });
      this.$refs.pageControl.refreshData();
    },
    getList: function(page, size) {
      var param = {};
      param.page = page;
      param.size = size;
      this.queryData(param);
    },
    addDetail: function() {
      var $this = this;
      var entity = this.formModel;
      entity.rangeApply = 1;
      entity.costType = 1;
      entity.regularUnit = 1;
      entity.isUnifyUnitPrice = 2;
      var data = this.formModel.detailList;
      var oldBrandId;
      var list = [];
      for (var i = 0; i < data.length; i++) {
        let obj = {};
        if (i === 0) {
          oldBrandId = data[i].brandId;
          obj.brandId = oldBrandId;
          obj.cstId = entity.cstId;
          obj.regularType = 1;
          list.push(obj);
        } else {
          if (data[i].brandId === oldBrandId) {
            continue;
          } else {
            obj.brandId = data[i].brandId;
            obj.cstId = entity.cstId;
            obj.regularType = 1;
            list.push(obj);
          }
        }
      }
      var oldList = this.dataSource1;
      httpUtil.post("regular/getRegularDetailBS", list, data => {
        data.forEach(a=>{
          a.cstId=entity.cstId;
        });
        var resultList = data;
        entity.list = resultList;
        this.$layer.iframe({
          content: {
            content: costbalanceAddEdit, //传递的组件对象
            parent: $this, //当前的vue对象
            data: {
              entity: JSON.stringify(entity),
              selected: function(rows) {
                console.log(rows);
                rows.forEach(a => {
                  $this.wrapData(entity, a,$this);
                  if (oldList.length != 0) {
                    var count=0;
                    oldList.forEach(b => {
                      if (b.costType === a.costType && b.packNo === a.packNo) {
                        count=0;
                        return;
                      } else {
                        count++;
                      }
                    });
                    if(count!=0){
                      $this.dataSource1.push(a);
                    }
                  } else {
                    $this.dataSource1.push(a);
                  }
                });
              }
            }
          },
          area: ["650px", "500px"],
          shadeClose: false,
          title: "计费项目选择"
        });
      });
    },

    selectDetail: function(parent) {
      var $this = this;
      var oldList = this.dataSource1;
      this.$layer.iframe({
        content: {
          content: costSelectItem, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            entity: JSON.stringify({ cstIdNo: this.formModel.cstId }),
            selected: function(rows) {
              console.log(rows);
              var packNoList = [];
              rows.forEach(a => {
                $this.wrapData($this.formModel, a);
                if (oldList.length != 0) {
                  var count=0;
                  oldList.forEach(b => {
                    if (b.costType === a.costType && b.packNo === a.packNo) {
                      count=0;
                      return;
                    } else {
                      count++;
                    }
                  });
                  if(count!=0){
                    $this.dataSource1.push(a);
                  }
                } else {
                  $this.dataSource1.push(a);
                }
              });
              $this.changeBtn=true;
            }
          }
        },
        area: ["1000px", "600px"],
        shadeClose: false,
        title: "待结算明细"
      });
    },
    deleteDetail: function() {
      //返回选中的数据
      var row = this.$refs.pmTable1.currentRow;
      if(row==undefined){
        this.$message.error('请选择一笔资料');
        return;
      }
      var rows = [];
      rows.push(row);
      //从数据源中移除数据
      if(row.businessType==5){
        this.$commonUtil.removeSelectedRows(rows, this.dataSource1,(data,row)=>{
          return (data.costType == row.costType) && (data.packNo == row.packNo);
        });
      }else{
        this.$commonUtil.removeSelectedRows2(rows, this.dataSource1);
      }
      var resultRow=this.$refs.pmTable1.getTableInfo();
      if(resultRow.length==0){
        this.costBtn=false;
        this.changeBtn=false;
        this.selectBtn=false;
      }
    },
    clearDetail: function() {
      //返回选中的数据
      var rows = this.$refs.pmTable1.getTableInfo();
      var flag = 0;
      rows.forEach(a=>{
        flag=a.businessType;
      });
      //从数据源中移除数据
      if(flag==5){
        this.$commonUtil.removeSelectedRows(rows, this.dataSource1,(data,row)=>{
          return (data.costType == row.costType) && (data.packNo == row.packNo);
        });
      }else{
        this.$commonUtil.removeSelectedRows2(rows, this.dataSource1);
      }
      this.costBtn=false;
      this.changeBtn=false;
      this.selectBtn=false;
    },
    addCostBill: function() {
      var $this = this;
      this.$refs["demoForm"].validate(this);
      var param = this.formModel;
      if (this.dataSource1.length === 0) {
        this.$message.error("请至少添加一笔明细");
        return;
      }
      var detail=this.$commonUtil.appConst.deepClone(this.dataSource1);
      detail.forEach(a=>{
        a.id=undefined;
        a.balanceNum=0;
        if(a.whsFreeDayNum!=0){
          a.whsFreedayNum=a.whsFreeDayNum;
        }
      });
      param.detail = detail;
      httpUtil.post("costCommon/addCostBill", param, data => {
        this.$message({
          message: "保存计费单成功",
          type: "success"
        });
        $this.costBtn=true;
        $this.changeBtn=true;
      });
    },
    addCostBalanceBill: function() {
      var param ={};
      var $this=this;
      param.bla=this.formModel;
      param.blaList=this.formModel;
      this.$refs["demoForm"].validate(this);
      if (this.dataSource1.length === 0) {
        this.$message.error("请至少添加一笔明细");
        return;
      }
      var detail=this.$commonUtil.appConst.deepClone(this.dataSource1);
      detail.forEach(a=>{
        a.id=undefined;
        a.balanceNum=a.balancePreNum;
        a.whsFreedayNum=a.whsFreeDayNum;
        a.settleUnitprice=a.unitprice;
      });
      param.blaList.cstId = this.formModel.cstId;
      param.blaList.createDate = this.formModel.createDate;
      param.blaList.balanceNo = this.formModel.balanceNo;
      param.blaList.balanceCompanyId = this.formModel.balanceCompanyId;
      param.blaList.actMoney = this.formModel.actMoney;
      param.blaList.balanceType = this.formModel.balanceType;
      param.blaList.businessType = this.formModel.businessType;
      param.blaList.businessNo = this.formModel.businessNo;
      param.blaList.auditTime = this.formModel.auditTime;
      param.blaList.id=undefined;
      param.bla.detail = detail;
      

      param.bla.balanceCompanyId = this.formModel.balanceCompanyId;
      param.bla.weightType= this.formModel.weightType;
      param.bla.cstId = this.formModel.cstId;
      param.bla.createDate= this.formModel.createDate;
      param.bla.actMoney = this.formModel.actMoney;
      param.bla.amtMoney = this.formModel.amtMoney;
      param.bla.balanceType = this.formModel.balanceType;
      param.bla.businessNo = this.formModel.businessNo;
      param.bla.payType = this.formModel.payType;
      param.bla.id=undefined;
      if (this.formModel.isBalance==true)
      {
        param.bla.balanceStatus = 2;
      }
      else
      {
        param.bla.balanceStatus = 1;
      }
      param.blaList.details = detail;
      httpUtil.post("costCommon/addCostBalanceBill", param, data => {
        this.$message({
          message: "保存结算单成功",
          type: "success"
        });
        $this.costBtn=true;
        $this.changeBtn=true;
        $this.selectBtn=true;
        $this.formModel.balanceNo=data.data.balanceNo;
      });
    },
    printCostBalanceBill: function() {},

    wrapData(entity, a) {
      if(a.whsInFirstDate!=undefined){
        this.$set(a,'whsInFirstDate',a.whsInFirstDate);
      }else{
        this.$set(a,'whsInFirstDate',a.whsinTime);
      }
    this.$set(a,'businessType',this.formModel.businessType);
    if(!a.whsFreedayNum && !a.whsFreeDayNum){
      this.$set(a,'whsFreeDayNum',0);
      this.$set(a,'whsFreedayNum',0);
    }
    if(!a.whsDayNum){
      var newDate=util.formatDate.format(new Date(),"yyyy-MM-dd hh:mm:ss")
      this.$set(a,'whsDayNum',this.getDate(a.whsInFirstDate,newDate));
    }
	  var costType = a.costType;
	  delete a['costType'];
	  this.$set(a,'costType',costType);
      // a.producingId=a.productPlace;
      //a.costType=a.regularType;
      if (entity.weightType == 1) {
        a.balancePreNum = a.netWeight;
        if (a.costType == 1) {
          a.settleAmt =
            a.unitprice * a.balancePreNum * (a.whsDayNum - a.whsFreeDayNum);
          a.settleActAmt = a.settleAmt;
          a.settleExpress = "结算单价*待结算量*(仓储天数-免仓储天数)";
        } else {
          a.settleAmt = a.unitprice * a.netWeight;
          a.settleActAmt = a.settleAmt;
          a.settleExpress = "结算单价*商品净重";
        }
      } else if (entity.weightType == 2) {
        a.balancePreNum = a.grossWeight;
        if (a.costType == 1) {
          a.settleAmt =
            a.unitprice * a.balancePreNum * (a.whsDayNum - a.whsFreeDayNum);
          a.settleActAmt = a.settleAmt;
          a.settleExpress = "结算单价*待结算量*(仓储天数-免仓储天数)";
        } else {
          a.settleAmt = a.unitprice * a.grossWeight;
          a.settleActAmt = a.settleAmt;
          a.settleExpress = "结算单价*商品毛重";
        }
      } else {
        a.balancePreNum = a.poundWeight;
        if (a.costType == 1) {
          a.settleAmt =
            a.unitprice * a.balancePreNum * (a.whsDayNum - a.whsFreeDayNum);
          a.settleActAmt = a.settleAmt;
          a.settleExpress = "结算单价*待结算量*(仓储天数-免仓储天数)";
        } else {
          a.settleAmt = a.unitprice * a.poundWeight;
          a.settleActAmt = a.settleAmt;
          a.settleExpress = "结算单价*商品磅重";
        }
      }
    }
  }
};
</script>