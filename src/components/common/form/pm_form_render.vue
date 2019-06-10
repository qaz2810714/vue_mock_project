<script>
import Vue from 'vue' 
import cacheUtil from '@/common/utils/CacheUtil';
import { major } from 'semver';
Vue.component('pm_form_render',{
    render:function(createElement){
        var slotMap = new Map();
        var slotChildren =[];
        var slotPart = [];
        for (let i = 0; i< this.$slots.default.length; i++) {
            if (this.$slots.default[i].text !== " ") {
                slotChildren.push(this.$slots.default[i]) // 获得 那些 插入的 按钮
            }
        }
        //slot根据row分组
        slotChildren.forEach(slot =>{
            var row = slot.componentOptions.propsData.row;
            if(slotMap.has(row)){
                var slotArr = [];
                slotArr = slotMap.get(row);
                slotArr.push(slot);
                slotMap.set(row,slotArr) 
            }else{
                var slotArr = [];
                slotArr.push(slot);
                slotMap.set(row,slotArr);
            }
        });
        let result =[];
        //slot外层动态拼接el-row标签进行布局
        slotMap.forEach(function(value,key,map){
            result.push(createElement('el-row',value));
        })
        //dom拼接
        var a= createElement("div",{class:"pmForm search_partition"},
            [createElement('el-form',{
                props: {
                    model:this.model,
                    inline:true,
                    rules:this.rules
                },
                ref:"pmform"
                // class: "demo"
              },result
            )])
        return a;
    },
    props: {
        model:Object,
        rules:Object,
        entity:Object,
        change:Function,
        formReadOnly:{type:Boolean,default:false},//全表单禁用开关
    },
    data(){
        return {
            dicCache: cacheUtil.getDic(),
            notifyObj:{
                win:this,
                callback:(cache,win)=>{
                    win.dicCache = cache;
                }
            }
        }
    },
    created() {
        this.$cacheUtil.addTableListener(this.notifyObj);
    },
    destroyed() {
        this.$cacheUtil.removeTableListener(this.notifyObj);
    },
    watch:{
        model:{
            handler:function(val,oldval){
              //console.log("model发生改变");
              //console.log(val);
            },
            deep:true//对象内部的属性监听，也叫深度监听
        }
    },
    mounted(){
        
    },
    methods:{
        validate:function(curr,succ,fail){
            this.$refs.pmform.validate(              
                (valid,validFields) => {
                    if (valid) {
                        if(succ){
                            succ(valid);
                        }
                    } else {
                        if(fail){
                            fail(valid);
                        }else{
                             for (var key in validFields){
                                this.$commonUtil.valid.throwEx(curr,validFields[key][0].message);
                             }
                        }
                    }
            });
        }
    }
})
</script>
<style>
/* 重写el-form-item中的input样式使其宽度按照占比设置 此css需要js根据lable的传入长度动态计算 */
.pm_form_item .el-form-item__content {
    width:80%;
}
.pm_form_item .el-form-item__content .el-date-editor {
    width:100%;      
}
</style>

