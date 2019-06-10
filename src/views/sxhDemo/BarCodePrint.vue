<template>
    <html :id="key">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>入库单</title>
            <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
        </head>
        <body>
            <div id="printDiv">
                <table border="1px" width="400px" height="400px" align="center" cellspacing="0" cellpadding="0" >
                    <tr>
                        <th colspan="4" align="center">武汉永强化纤有限公司产品标签</th>
                    </tr>
                    <tr align="center">
                        <td width="50px">品名</td>
                        <td colspan="3" >{{mainInfo.brand}}</td>
                    </tr>
                    <tr align="center">
                        <td>规格</td>
                        <td colspan="3">{{mainInfo.special}}</td>
                    </tr>
                    <tr  align="center">
                        <td>卷长</td>
                        <td >{{mainInfo.coilLength}}</td>
                        <td >等级</td>
                        <td >{{mainInfo.level}}</td>
                    </tr>
                    <tr  align="center">
                        <td>入库单号</td>
                        <td >{{mainInfo.whsInCode}}</td>
                        <td >颜色</td>
                        <td >{{mainInfo.color}}</td>
                    </tr>
                    <tr  align="center">
                        <td>净重</td>
                        <td >{{mainInfo.netWeight}}</td>
                        <td >批号</td>
                        <td >{{mainInfo.batchNo}}</td>
                    </tr>
                    <tr  align="center">
                        <td>毛重</td>
                        <td >{{mainInfo.grossWeight}}</td>
                        <td >包号</td>
                        <td >{{mainInfo.packNo}}</td>
                    </tr>
                    <tr  align="center">
                        <td>班次</td>
                        <td >{{mainInfo.classes}}</td>
                        <td >生产日期</td>
                        <td >{{mainInfo.productTime}}</td>
                    </tr>
                    <tr align="center">
                        <td colspan="4"><img id="barCode_img" :src="mainInfo.barCodeUrl"></td>
                    </tr>

                </table>
            </div>
        </body>
    </html>
</template>
<script>
import cacheUtil from "@/common/utils/CacheUtil";
import componentUtil from "@/common/utils/ComponentUtil";
import metadata from "@/common/entities/Metadata";
import util from '@/common/js/util.js';
export default {
    props: {
    },
    data:function(){
        return{
            config:{
                mainEntity:metadata.wmsIn,
                detailEntity:metadata.wmsTransferDetail,
                dicCache:null
            },
            mainInfo:{},
            detailInfo:[],
            //打印状态
            isPrinting:false,
            key:this.$commonUtil.appConst.NewGuid(),
        }
    },
    methods: {
        printDiv:function(entity){
            //初始化页面数据
            this.initData(entity);
            //正在打印状态
            this.isPrinting = true;
        },
        getDisplayModel(entity){
            let result = {}
            result.brand = entity.brand
            result.special = entity.gramWeight+"g#"+ entity.clothWidth +"mm#" + entity.num +"卷"
            result.level = ""
            result.whsInCode = entity.whsInCode
            result.color = entity.color
            result.classes = entity.classes
            if(entity.detailInfo){
                result.coilLength = entity.detailInfo.coilLength
                result.netWeight = entity.detailInfo.netWeight;
                result.grossWeight = entity.detailInfo.grossWeight;
                result.batchNo = entity.detailInfo.batchNo;
                result.packNo = entity.detailInfo.packNo;
                result.productTime = util.formatDate.format(new Date(entity.detailInfo.productTime),"yyyy-MM-dd hh:mm:ss");
            }
            //this.$set(result,"barCodeUrl","http://pic37.nipic.com/20140113/8800276_184927469000_2.png");
            result.barCodeUrl = "http://112.74.160.172:8080/api/wmsin/getBarCode?barCode=12556346346";
            return result;
            //字典缓存使用懒加载
            // if(!this.config.dicCache){
            //     this.config.dicCache = cacheUtil.getDic()
            // };
            // let result = {};
            // let stack = null;
            // for(var item in data){
            //     let displayText = componentUtil.getDisplayText(
            //         entity,
            //         item,
            //         data[item],
            //         this.config.dicCache
            //     );
            //     result[item] = displayText; 
            // }
            // stack = componentUtil.getStackName(this.config.dicCache,data,'whsRoomId','whsAreaId');
            // //库位信息
            // if(data['whsStackName']){
            //     stack = stack + ">" + data['whsStackName'];
            // }
            // //层数信息
            // if(data['whsLayer']){
            //     stack = stack + ">" + data['whsLayer'];
            // }
            // result['stack'] = stack;
            // return result;
        },
        initData(entity){
            //this.mainInfo = entity;
            this.mainInfo = this.getDisplayModel(entity);
            this.$nextTick(this.printThis)
            //明细单的转换
            // let _this = this;
            // this.detailInfo = entity.detailList.map(item =>_this.getDisplayModel(item,this.config.detailEntity));
            // //主单的转换
            // this.mainInfo = this.getDisplayModel(entity,this.config.mainEntity);
            // this.mainInfo.whsInfo = cacheUtil.getUser().accountInfo;

            // //遍历数量求合计
            // if(!this.mainInfo.totalAmout){ 
            //     let totalAmout=0; 
            //     this.detailInfo.forEach((row, index) => {
            //             let  value = Number(row.amount);
            //             if (!isNaN(value)) {
            //             totalAmout= totalAmout + value;
            //             } 
            //     });
            //     this.mainInfo.totalAmout=totalAmout;
            // }
            // //遍历重量求合计
            // if(!this.mainInfo.totalNetWeight){ 
            //     let totalNetWeight=0; 
            //     this.detailInfo.forEach((row, index) => {
            //             let  value = Number(row.netWeight);
            //             if (!isNaN(value)) {
            //             totalNetWeight= totalNetWeight + value;
            //             } 
            //     });
            //     this.mainInfo.totalNetWeight=totalNetWeight.toFixed(3);
            // }

        },
        printThis(){
            if(this.mainInfo && this.isPrinting){
                printJS({
                    printable: this.key,
                    type: 'html',
                    scanStyles:false,
                    css: "/static/css/contract.css"

                });
            }
            this.isPrinting = false;
        }
    },
    // updated(){
    //     if(this.mainInfo && this.isPrinting){
    //         printJS({
    //             printable: this.key,
    //             type: 'html',
    //             header: '打印入库单',
    //             scanStyles:false,
    //             css: "/static/css/contract.css"

    //         });
    //     }
    //     this.isPrinting = false;
    // },
}
</script>



