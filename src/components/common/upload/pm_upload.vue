<template>
  <div style="float:left;padding-right:10px">
    <el-upload
      class="upload-demo"
      :action="url"
      :http-request="request"
      ref="upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="change"
      :on-success="success"
      :before-upload="handleBefore"
      :on-error="error"
      :before-remove="beforeRemove"
      multiple
      list-type="text"
      :limit="5"
      :on-exceed="handleExceed"
      :file-list="resultList"
      :show-file-list="IsShow"
      :auto-upload="autoUpload"
      :disabled="realDisabled"
    >
      <el-button :icon="btnIcon" size="small" class="is-round" type="primary" :disabled="realDisabled">{{labelName}}</el-button>
    </el-upload>
  </div>
</template>

<script>
import { Upload } from "element-ui";
import { debug } from "util";
import commonUtil from "@/common/utils/CommonUtils";
export default {
  components: {
    "el-upload": Upload
  },
  props: {
    //  按钮名称
    labelName: { type: String, default: "点击上传" },
    //是否禁用
    readOnly: {
      type: Boolean,
      default: false
    },
    //是否显示列表
    IsShow: {
      type: Boolean,
      default: true
    },
    //上传路径
    action: {
      type: String,
      default: ""
    },
    //自定义上传方法
    request: {
      type: Function
    },
    //回显列表
    fileList: {
      type: Array,
      default: () => []
    },
    //是否是单个文件上传
    isSingle:{
      type:Boolean,
      default:false
    },
    btnIcon: String,
  },
  data() {
    return {
      //上传文件列表
      //filesList: this.fileList,
      //上传文件显示列表
      resultList: [],
      url: "",
      autoUpload: false,
      //新上传文件列表
      newFileList: [],
      //删除文件列表
      deleteFileList: [],
      realDisabled:{
        type:Boolean,
        default:false
      }
    };
  },
  created(){
    this.realDisabled = this.readOnly;
    this.resultList = this.getResultList();
  },
  watch:{
    readOnly(val,old){
      this.realDisabled = val;
    }
  },
  mounted() {
    //检测是否存在配置上传地址
    if (this.request != undefined) {
      this.autoUpload = true;
    }
  },
  methods: {
    getResultList(){
      var attr =this.$commonUtil.deepClone(this.fileList);
      for(let file of attr){
        file.name = file.fileName;
        file.storeName = file.uid;
      }
      return attr;
    },
    handleRemove(file, fileList) {
      var length = 0;
      if (file.fileStatus != 0) {
        this.deleteFileList.push(file);
      } else {
        this.newFileList.splice(file.index, 1);
        for (var a = 0; a < this.newFileList.length; a++) {
          this.newFileList[a].index = a;
        }
        for (let item of fileList) {
          if (item.fileStatus != 0) {
            length++;
          }
        }
        this.resultList.splice(file.index + length, 1);
        for (var b = 0; a < this.newFileList.length; b++) {
          this.newFileList[b].index = b;
        }
      }
      console.log(file, fileList);
    },
    handleBefore(file) {},
    handlePreview(file) {
      this.$commonUtil.message.confirm('是否下载该文件?',() => {
          this.$httpUtil.postForFile("file/downloadFile", file,file.name, data => {});
      });
    },
    handleExceed(files, fileList) {
      //this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    setDisabled(val){
      //this.$refs.self.disabled = val;
      this.realDisabled = val;
    },
    change(file, fileList) {
      var uuid = this.getUUid();
      var list = fileList;
      var index = 0;
      file.uuid = uuid;
      file.storeName = uuid;
      if(this.isSingle){
        this.newFileList = [];
        this.resultList = [];
      }
      if (this.resultList.length === 0) {
        file.fileStatus = 0;
        file.index = index;
        this.newFileList.push(file);
      }
      for (let i = 0; i < this.resultList.length; i++) {
        let item = this.resultList[i];
        if (item.name != file.name) {
          if (i === this.resultList.length - 1) {
            if (item.fileStatus != 0) {
              file.index = 0;
            } else {
              file.index = item.index + 1;
            }
            file.fileStatus = 0;
            this.newFileList.push(file);
          } else {
            continue;
          }
        } else {
          //this.$message.warning(`该文件已存在列表中，请勿重复添加`);
          for(let j=0;j<this.deleteFileList.length;j++){
            if(file.name==this.deleteFileList[j].name){
              this.newFileList.push(file);
            }
          }
          list = this.resultList;
          break;
        }
      }
      this.resultList = list.slice(0);
    },
    success(response, file, fileList) {
      alert("上传成功");
      this.$refs.upload.clearFiles();
    },
    error(err, file, fileList) {
      alert("上传失败" + err);
      this.$refs.upload.clearFiles();
    },
    //获取新上传文件列表
    getNewFileList: function() {
      return this.newFileList;
    },
    //获取删除文件列表
    getDeleteFileList: function() {
      return this.deleteFileList;
    },
    //清空新增文件列表和删除文件列表
    clearAllFile: function(){
      this.newFileList=[];
      this.deleteFileList=[];
    },
    //获取uuid
    getUUid: function() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    }
  }
};
</script>
<style>
.upload-demo .el-upload,
.upload-demo .el-upload-list,
.upload-demo .el-upload-list__item {
  float: left;
}
.upload-demo .el-upload-list__item {
  width:auto!important;
  margin-left: 20px !important;
}
.upload-demo .el-upload-list__item:first-child {
  margin-top: 5px;
}
</style>
