<template>
    <metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body class="edit_padding">
                <pm_form_render :model="formModel" :rules="rules" ref="inFrom" :entity='config.entity' v-bind:formReadOnly='formReadOnly'>
                    <pm_form_item row="1" labletext="入库单号" name="whsinCode" :span="6" xtype="text" lableWidth="70px"  :readOnly='true'></pm_form_item>
                    <pm_form_item row="1" labletext="货主单位" name="cstId" :span="6" xtype="search_select_input" lableWidth="90px" required></pm_form_item>
                    <pm_form_item row="1" labletext="入库方式" name="whsinType" :span="6" xtype="select" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="1" labletext="入库类型" name="whsinStyle" :span="6" xtype="select" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="2" labletext="制单人" name="creatorNameTime" :span="6" xtype="text" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="2" labletext="审核人" name="auditorNameTime" :span="6" xtype="text" lableWidth="75px"  :readOnly='true'></pm_form_item>
                    <pm_form_item row="2" labletext="入库通知单号" name="billAttachmentId" :span="6" xtype="text" lableWidth="100px"></pm_form_item>
                    <pm_form_item row="2" labletext="入库状态" name="status" :span="6" xtype="select" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="3" labletext="备注" name="remark" :span="24" xtype="textarea" lableWidth="70px" :rowHeight='2'></pm_form_item>
                </pm_form_render>
                <pm_upload ref="upload" btnIcon='el-icon-upload2' :fileList.sync='formModel.fileList'></pm_upload>
                <pm_tool_bar>
                    <pm_toolButton  ref="downExcel" btnName ="下载导入模板" btnIcon ="el-icon-download" :btnClickFunc ='downImportModel'></pm_toolButton>
                    <pm_upload ref="uploadExcel" btnIcon='el-icon-upload2' labelName='导入' :IsShow='false' :isSingle='true' :request='uploadExcel'></pm_upload>
                    <pm_toolButton ref="addDetail" btnName ="添加明细" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='addDetail'></pm_toolButton>
                    <pm_toolButton ref="duplicate" btnName ="复制" btnIcon ="el-icon-news" :btnClickFunc ='copyRows'></pm_toolButton>
                    <pm_toolButton ref="remove" btnName ="移除" btnIcon ="el-icon-remove-outline" :btnClickFunc ='deleteRows'></pm_toolButton>
                </pm_tool_bar>
            </metro_page_box_body>
        </metro_page_box>

        <!-- 数据展示区域 -->
        <metro_page_box>
            <!-- body内容区域 -->
            <metro_page_box_body>
                <pm_table ref="pmTable" tableKey="NoteWhsInEdit-pmTable" :dataSource="dataSource" :config="config" :bottomHeight="170">
                    <pm_column prop="cardNo" label="卡号" width="200"></pm_column>
                    <pm_column prop="packNo" label="捆包号" width="200"></pm_column>
                    <pm_column prop="brandId" label="品名" width="200" required></pm_column>
                    <pm_column prop="textureId" label="材质" width="200" watchField="brandId" required></pm_column>
                    <pm_column prop="spec" label="规格" width="200" required></pm_column>
                    <pm_column prop="producingId" label="产地" width="200" required></pm_column>
                    <pm_column prop="calcType" label="计重方式" width="200" :cellCanEdit='cellCanEdit' required></pm_column>
                    <pm_column prop="measurementUnit" label="数量单位" width="200" required></pm_column>
                    <pm_column prop="amount" label="数量" width="200" required></pm_column>
                    <pm_column prop="netWeight" label="净重" width="200" required></pm_column>
                    <pm_column prop="grossWeight" label="毛重" width="200"></pm_column>
                    <pm_column prop="poundWeight" label="磅重" width="200"></pm_column>
                    <pm_column prop="unitNumber" label="单包支数" width="200"></pm_column>
                    <pm_column prop="whsCalcStackId" label="库区" width="200" parentPropName='whsRoomId' childPropName='whsAreaId' required></pm_column>
                    <pm_column prop="whsStackName" label="库位" width="200"></pm_column>
                    <pm_column prop="whsLayer" label="入库层" width="200"></pm_column>
                    <pm_column prop="transceiver" label="收发人" width="200"></pm_column>
                    <pm_column prop="slinger" label="吊机工" width="200"></pm_column>
                    <pm_column prop="whsManager" label="仓管" width="200"></pm_column>
                    <pm_column prop="manufactureTime" label="出厂时间" width="200"></pm_column>
                    <pm_column prop="transportCode" label="车船号" width="200"></pm_column>
                    <pm_column prop="whsinTime" label="首入库时间" width="200" required></pm_column>
                    <pm_column prop="stoveCode" label="炉号" width="200"></pm_column>
                    <pm_column prop="remark" label="备注" width="200"></pm_column>
                </pm_table>
                <pm_tool_bar :noBackground="true">
                    <pm_toolButton ref='add' btnName ="保存" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='saveInfo'></pm_toolButton>
                    <pm_toolButton ref='save' btnName ="保存并审核" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='saveAndAuditInfo'></pm_toolButton>
                    <pm_toolButton ref='btn_print' btnName ="打印" btnIcon ="el-icon-printer" :btnClickFunc ='printInfo'></pm_toolButton>
                    <pm_toolButton btnName ="关闭" btnIcon ="el-icon-error" :btnClickFunc ='closeWin'></pm_toolButton>
                </pm_tool_bar>
            </metro_page_box_body>
        </metro_page_box>

        <el-dialog
            :title.sync='dialogTitle'
            :visible.sync="dialogVisible"
            width="30%">
            <div :key="item.id" v-for="item in dialogContent">{{item}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </metro_page>
</template>

<script>
    import metro_page from '@/components/vitems/pageContainer/metro_page';
    import metro_page_box from '@/components/vitems/pageContainer/metro_page_box';
    import metro_page_box_tool_bar from '@/components/vitems/pageContainer/metro_page_box_tool_bar';
    import metro_page_box_body from '@/components/vitems/pageContainer/metro_page_box_body';
    import metro_pageheader from '@/components/vitems/pageheader';
    import pm_form_render from '@/components/common/form/pm_form_render';
    import pm_form_item from '@/components/common/form/pm_form_item';
    import pm_search from '@/components/vitems/pageSearch/pm_search';
    import pm_toolButton from "@/components/common/button/pm_toolButton";
    import pm_tool_bar from "@/components/common/table/pm_tool_bar";
    import pm_table from "@/components/common/table/pm_table";
    import pm_column from "@/components/common/table/pm_column";
    import httpUtil from "@/common/utils/HttpUtil";
    import metadata from "@/common/entities/Metadata";
    import pm_pagination from "@/components/common/table/pm_pagination";
    import cacheUtil from "@/common/utils/CacheUtil";
    import commonUtil from "@/common/utils/CommonUtils";
    import pm_upload from "@/components/common/upload/pm_upload";
    import printJS from 'print-js'
    const statusEnum = {
        STATUS_READY:1, //待入库
        STATUS_SUCC:2,//入库完成
        STATUS_DELETE:3,//已废弃
    };
    const operTypeEnum = {
        OPER_ADD:'3',//新增
        OPER_EDIT:'1',//修改
        OPER_ADJUST:'2',//调整
    };
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination,pm_upload},
        data: function() {
            var validBillAttachment=(rule, value,callback)=>{
                var reg = /^[a-zA-Z0-9\,]+$/
                if (value && !reg.test(value)){
                    callback(new Error('通知单只允许数字，字母和英文逗号!'))
                }else {
                    callback()
                }
            }
            return {
                dataSource: [],
                dicCache:cacheUtil.getDic(),
                config: {
                  entity: metadata.wmsIn,
                  allowEdit: true,
                  multiple: true,
                  change:function(row,prop,val){
                      var brandNameList = this.$cacheUtil.getDic().BrandNameList.list;
                      if(prop == "calcType"){
                           this.$set(row,'calcType',val);
                      }
                      if(prop != "measurementUnit" && prop != "brandId" && prop != "textureId" && prop != "spec" && prop != "producingId" && prop != "amount"){
                          return;
                      }
                      var brand= brandNameList.filter(item => item.id === row.brandId)[0];
                      if(!brand){
                          return;
                      }
                      if(brand.whsoutType == 2){//按吨出库的品名
                            // this.$set(row,'amount',0);
                            this.isTunOut = true;
                            this.$set(row,'calcType',2);
                            return;
                      }else{
                          //如果前一个品名是按吨出库 则置空计重方式
                          if(this.isTunOut){
                            this.$set(row,'calcType',null);
                          }
                      }
                      if(row.calcType != 1)
                      {
                        //非理计产品不做计算
                        return;
                      }
                      if (prop == "measurementUnit" || prop == "brandId" || prop == "textureId" || prop == "spec" || prop == "producingId"){
                        var clacDto = {};
                        clacDto.adjustmentType = row.measurementUnit;
                        clacDto.producingId = row.producingId;
                        clacDto.spec = row.spec;
                        clacDto.brandId = row.brandId;
                        var amount = row.amount;
                        httpUtil.post("base/getPhysicalWeightBySelective", clacDto, data => {
                            if (data == -1)
                            {
                                row.calcWeight = 0;
                            }else{
                                row.calcWeight = data;
                            }
                            if(row.amount!=0){
                                row.netWeight = (row.calcWeight.toFixed(6) * amount).toFixed(3);
                            }
                        },null,false);
                      }else if(prop == "amount"){
                          if(row.calcWeight == null || row.calcWeight == 'undefined'){
                              return;
                          }
                          var amount = row.amount;
                          row.netWeight = (row.calcWeight.toFixed(6) * amount).toFixed(3);
                      }
                  }
                },
                totalSize:{
                  type:Number,
                  default:0
                },
                rules: {
                    billAttachmentId: [
                        { trigger: 'blur', validator: validBillAttachment}
                   ] 
                },
                counter:0,
                formReadOnly:false,
                deleteIdList:[],
                delPackNoList:[],
                calcWeight:0,
                formModel:Object,
                dialogVisible:false,
                dialogTitle:"",
                dialogContent:String,
                isTunOut:false //品名是否是按吨出库
            }
        },
        created(){
            //获取数据源
            this.formModel = this.getFormModel();
        },
        mounted(){
           var hasSaveAuth = this.$commonUtil.permission.hasSaveAuth(this);
           var hasCheckAuth = this.$commonUtil.permission.hasCheckAuth(this);
           var hasPrintAuth = this.$commonUtil.permission.hasPrintAuth(this);
           if(this.formModel.editFlag == operTypeEnum.OPER_ADJUST){
               this.adjustBtnInit();
           }else if(this.formModel.editFlag == operTypeEnum.OPER_EDIT){
                if(this.formModel.status == statusEnum.STATUS_SUCC){
                    this.$refs["add"].setDisabled(true);
                    this.$refs["save"].setDisabled(true);
                    this.$refs["cost"].setDisabled(false);
                    this.$refs["downExcel"].setDisabled(true);
                    this.$refs["uploadExcel"].setDisabled(true);
                    this.$refs["addDetail"].setDisabled(true);
                    this.$refs["duplicate"].setDisabled(true);
                    this.$refs["remove"].setDisabled(true);
                    this.$refs["upload"].setDisabled(true);
               }else{
                   this.$refs["cost"].setDisabled(true);
               }
           }else{
               this.$refs["btn_print"].setDisabled(true);
               this.$refs["cost"].setDisabled(true);
           }
           if(!hasSaveAuth){
               this.$refs["add"].setDisabled(true);
           }
           if(!hasCheckAuth){
               this.$refs["save"].setDisabled(true);
           }
           if(!hasPrintAuth){
                this.$refs["btn_print"].setDisabled(true);
           }
        },
        methods: {
            wrapData(entity){
                entity.businessNo = entity.whsinCode;
                entity.cstId = entity.cstId;
                entity.businessType = 1;
                entity.createDate = entity.createTime;
                entity.creatorData = entity.creator;
                if(!entity.detailList){
                    return;
                }
                entity.detailList.forEach(element => {
                    element.material = element.textureId;
                    element.productPlace = element.producingId;
                    element.businessNo = element.whsinCode;
                    //element.transferDate = element.transferTime;
                    element.whsInFirstDate = element.whsinTime;
                    element.createDate = element.createTime;
                    element.numFin = element.amount;
                    if(!element.transferTimes){
                        element.transferNum = 0;
                    }else{
                        element.transferNum = element.transferTimes;
                    }
                    element.businessType = 1;
                    element.costDate = element.costTime;
                });
                entity.detail=entity.detailList;
            },
            printInfo:function(){
                let _this = this;
                this.$commonUtil.getDetailEntity("whsin/getInDetailByMainId",
                    {whsinMainId: this.formModel.id},
                     this.formModel,
                    function(entity){
                        _this.$refs.print.printDiv(entity);
                });
            },
            getFormModel:function(){
                 //获取数据源
                var entity = this.$options.parent.propsData.entity;
                this.$set(entity,"env","bs");
                if(entity.editFlag == '3'){
                    entity.whsinCode = this.$commonUtil.appConst.nullNo;
                    entity.creatorName = cacheUtil.getUser().configUser.name;
                    this.$set(entity,"status",1);
                    this.$set(entity,"whsinType",1);
                    this.$set(entity,"whsinStyle",2);
                }else if(entity.editFlag == '1'){//编辑操作
                    //如果是已完成状态的单据 禁用整个界面
                    if(entity.status == 2){
                        this.formReadOnly = true;
                        this.config.allowEdit = false;
                    }
                }
                if(entity.createTime){
                    entity.creatorNameTime = entity.creatorName + " ." + entity.createTime;
                }
                if(entity.auditorName){
                    entity.auditorNameTime = entity.auditorName + " ." + entity.auditTime;
                }
                this.dataSource = entity.detailList;
                return entity;
            },
            adjustBtnInit:function(){
                this.$refs.save.setDisabled(true);
                this.$refs.cost.setDisabled(false);
            },
            closeWin: function(){
                this.$commonUtil.tab.close(this);
            },
            addDetail:function(){
                var $this = this;
                if(!$this.dataSource){
                   $this.dataSource = []; 
                }
                var detail = {};
                this.counter += 1;
                detail.index = this.counter;
                detail.netWeight = 0;
                detail.grossWeight = 0;
                detail.poundWeight = 0;
                this.$set(detail,"whsinTime",new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()));
                $this.dataSource =  $this.dataSource.concat(detail);
            },
            deleteRows: function() {
                var $this = this;
                //返回选中的数据
                var rows = this.$refs.pmTable.getSelectedRows();
                if(rows == null || rows.length<=0){
                    this.$commonUtil.valid.throwEx(this, "请先选择一条需要移除的数据!");
                }
                //从数据源中移除数据
                commonUtil.removeSelectedRows2(rows,this.dataSource);
                if(!$this.deleteIdList){
                    $this.deleteIdList = [];
                }
                if(!$this.delPackNoList){
                    $this.delPackNoList = [];
                }
                rows.forEach(row => {
                    if(row.id){
                        $this.deleteIdList.push(row.id);
                        $this.delPackNoList.push(row.packId);
                    }
                });
            },
            copyRows:function(){
                var $this = this;
                var rows = $this.$refs.pmTable.getSelectedRows(); 
                var newRows = [];
                if(rows == null || rows.length <= 0){
                   var row =  $this.$refs.pmTable.currentRow;
                   rows.push(row);
                }
                rows.forEach(row => {
                    var newRow = {};
                    newRow=JSON.parse(JSON.stringify(row));
                    $this.counter += 1;
                    newRow.id = null;
                    newRow.index = $this.counter;
                    newRow.packNo = null;
                    newRow.cardNo = null;
                    newRows.push(newRow);
                });
                $this.dataSource =  $this.dataSource.concat(newRows);
            },
            cellCanEdit:function(row,prop){
                var brandNameList = this.$cacheUtil.getDic().BrandNameList.list;
                var brand= brandNameList.filter(item => item.id === row.brandId)[0];
                if(brand && brand.whsoutType == 2){//按吨出库的品名
                    if(prop == 'calcType'){
                        return false;
                    }
                }else{
                    return true;
                }
            },
            downImportModel:function(){
              httpUtil.postForFile("whsin/downTemplate", null,'入库导入模板.xls', data => {
              }); 
            },
            //更新标题
            updateTitle: function(title) {
                this.$commonUtil.tab.updateTitle(this, title);
            },
            validateDetails:function(details){
                if(details == null || details.length<=0)
                {
                    this.$commonUtil.valid.throwEx("明细不能为空！");
                }
                var brandNameList = this.$cacheUtil.getDic().BrandNameList.list;
                var rowNum = 1;
                details.forEach(item => {
                    var brand= brandNameList.filter(brand => brand.id === item.brandId)[0];
                    // if(this.$commonUtil.IsNull(item.whsStackName)){
                    //      this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据库位信息不能为空!");
                    // }
                    if(this.$commonUtil.IsNull(item.brandId)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据品名不能为空!");
                    }                                                                                                                                   
                    if(this.$commonUtil.IsNull(item.textureId)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据材质不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.spec)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据规格不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.producingId)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据产地不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.amount)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据数量不能为空!");
                    }
                    if(brand && brand.whsoutType == 1 && item.amount<=0){
                          this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据按件出库的品名数量必须大于0!");
                    }
                    if(brand && brand.whsoutType == 2 && item.netWeight<=0){
                          this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据按吨出库的品名净重必须大于0!");
                    }
                    if(this.$commonUtil.IsNull(item.netWeight)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据净重不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.calcType)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据计重方式不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.measurementUnit)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据数量单位不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.whsinTime)){
                         this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据首入库时间不能为空!");
                    }
                    if(this.$commonUtil.IsNull(item.whsRoomId)&& this.$commonUtil.IsNull(item.whsAreaId))
                    {
                        this.$commonUtil.valid.throwEx(this,"第"+rowNum+"行数据入库库区信息不能为空!");
                    }
                    //前端校验不能有重复的捆包号
                    if(!this.$commonUtil.IsNull(item.packNo) && details.filter(a =>{if(a.packNo &&  a.packNo === item.packNo){
                        return a;
                    }else{
                        return null;
                    }}).length > 1){
                        this.$commonUtil.valid.throwEx("重复的捆包号:" + item.packNo);
                    }
                    rowNum = rowNum+1;
                });
            },
            saveInfo:function(){
                this.$refs["inFrom"].validate(this);
                //组装请求参数对象  
                var $this = this;
                var cstList= this.dicCache.CstList.list;
                this.formModel.cstName = cstList.filter(item => item.id === this.formModel.cstId)[0].cstFullName;
                this.formModel.detailList = this.dataSource;
                var files=this.$refs.upload.getNewFileList();
                var fileDeleteList = [];
                if(this.$refs.upload.getDeleteFileList().length>0){
                    this.$refs.upload.getDeleteFileList().forEach(item => {
                        fileDeleteList.push(item.id);
                    });
                }
                this.formModel.fileDeleteList = fileDeleteList;
                this.validateDetails(this.formModel.detailList);
                if(this.formModel.editFlag==operTypeEnum.OPER_ADD){//新增操作
                    httpUtil.postWithFile("whsin/addInInfo", this.formModel,files, data => {
                        this.$message({
                            message: '新增入库单成功',
                            type: 'success'
                        });
                        $this.$refs.upload.clearAllFile();
                        $this.handleBackData(data);
                        $this.$refs["btn_print"].setDisabled(false);
                        $this.updateTitle("编辑入库单[" + data.whsinCode + "]");
                         //变为修改操作
                        $this.formModel.editFlag = operTypeEnum.OPER_EDIT;
                        $this.$options.parent.propsData.parentView.queryData();
                    });
                }else{//修改操作
                    this.formModel.delIdList = this.deleteIdList;
                    this.formModel.delPackIdList = this.delPackNoList;
                    httpUtil.postWithFile("whsin/updateInInfo",this.formModel,files, data => {
                        var titleHead = '修改';
                        if(this.formModel.editFlag==operTypeEnum.OPER_ADJUST){
                            titleHead = '调整';
                        }
                        this.$message({
                            message: titleHead + '入库单成功',
                            type: 'success'
                        });
                        $this.$refs.upload.clearAllFile();
                        $this.handleBackData(data);
                        $this.$options.parent.propsData.parentView.queryData();
                    });
                }
            },
            uploadExcel:function(){
                var $this = this;
                var files=this.$refs.uploadExcel.getNewFileList();
                httpUtil.postWithFile("whsin/uploadExcel", this.formModel,files, (data,flag) => {
                    if(!$this.dataSource){
                        $this.dataSource = []; 
                    }
                    if(flag){
                        var resObj = JSON.parse(data.split('\\n').join('hh'));
                        console.log(resObj.content);
                        this.dialogTitle = resObj.title;
                        this.dialogContent = resObj.content.split('hh');
                        this.dialogVisible = true;
                    }else{
                        data.forEach(element => {
                            $this.counter += 1;
                            element.index = $this.counter;
                        });
                        $this.dataSource =  $this.dataSource.concat(data);
                    }
                });
            },
            saveAndAuditInfo:function(){
                this.$refs["inFrom"].validate(this);
                var $this = this;
                var cstList= this.dicCache.CstList.list;
                this.formModel.cstName = cstList.filter(item => item.id === this.formModel.cstId)[0].cstFullName;
                var files=this.$refs.uploadExcel.fileList;
                this.formModel.detailList = this.dataSource;
                this.formModel.delIdList = this.deleteIdList;
                this.formModel.delPackIdList = this.delPackNoList;
                var files=this.$refs.upload.getNewFileList();
                var fileDeleteList = [];
                this.validateDetails(this.formModel.detailList);
                if(this.$refs.upload.getDeleteFileList().length>0){
                    this.$refs.upload.getDeleteFileList().forEach(item => {
                        fileDeleteList.push(item.id);
                    });
                }
                this.formModel.fileDeleteList = fileDeleteList;
                httpUtil.postWithFile("whsin/saveWithAuditInInfo", this.formModel,files, data => {
                        this.$message({
                            message: '保存并审核入库单成功',
                            type: 'success'
                        });
                        //禁用按钮
                        this.$refs["add"].setDisabled(true);
                        this.$refs["save"].setDisabled(true);
                        this.$refs["cost"].setDisabled(false);
                        this.$refs["downExcel"].setDisabled(true);
                        this.$refs["uploadExcel"].setDisabled(true);
                        this.$refs["addDetail"].setDisabled(true);
                        this.$refs["duplicate"].setDisabled(true);
                        this.$refs["remove"].setDisabled(true);
                        this.$refs["upload"].setDisabled(true);
                        this.$refs["btn_print"].setDisabled(false);
                        //回显数据
                        $this.handleBackData(data);
                        $this.formReadOnly = true;
                        $this.config.allowEdit = false;
                        this.$refs.upload.clearAllFile();
                        $this.updateTitle("查看入库单[" + data.whsinCode + "]");
                        //变为修改操作
                        $this.formModel.editFlag = operTypeEnum.OPER_EDIT;
                        //刷新管理界面数据
                        $this.$options.parent.propsData.parentView.queryData();
                });
            },
            handleBackData:function(data){
                for(var p in data){
                    this.$set(this.formModel,p,data[p]);
                }
                this.$set(this.formModel,'fileList',data['fileList']);
                if(this.formModel.createTime){
                    this.formModel.creatorNameTime = this.formModel.creatorName + " ." + this.formModel.createTime;
                }
                if(this.formModel.auditorName){
                    this.formModel.auditorNameTime = this.formModel.auditorName + " ." + this.formModel.auditTime;
                }
                this.dataSource = this.formModel.detailList;
            },
        },
    }
</script>

<style scoped>
  
</style>
