<template>
  <el-button ref="self" size="small" :type="btnType" round
    :key="btnName"
    :icon="btnIcon"
    @click="btnClickFunc"
    v-has="btnPermission"
    :disabled="realDisabled"
  >{{btnName}}</el-button>
</template>
 
<script>
export default {
  name: "pm_toolButton",
  props: {
    btnType:{
      type:String,
      default:"primary"
    } ,
    btnName: String ,
    btnIcon: String ,
    btnClickFunc: { type: Function ,default:function(){}},
    btnPermission: String,
    btnDisabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      realDisabled:{
        type:Boolean,
        default:false
      }
    };
  },
  created(){
    this.realDisabled = this.btnDisabled;
  },
  watch:{
    btnDisabled(val,old){
      this.realDisabled = val;
    }
  },
  methods:{
    setDisabled(val){
      //this.$refs.self.disabled = val;
      this.realDisabled = val;
    }
  }
};
</script>