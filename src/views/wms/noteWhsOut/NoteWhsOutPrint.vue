<template>
    <html :id="key">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>出库单</title>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

    </head>
    <body>
   <div>
       <div class="cont" id="printDiv">
        <div class="title">出库单</div>
        <div class="contractInfor clearfix">
            <ul class="fl">
                <li><label>出库单号：</label><span>{{mainInfo.whsoutNo}}</span></li>
                <li><label>仓库：</label><span>{{mainInfo.whsInfo.name}}</span></li>
                <li><label>出库时间：</label><span>{{mainInfo.createTime}}</span></li>
                <li><label>外部单据号：</label><span>{{mainInfo.billAttachmentId}}</span></li>
            </ul>
            <ul class="fr">
                <li><label>货主：</label><span>{{mainInfo.cstId}}</span></li>
                <li><label>出库状态：</label><span>{{mainInfo.status}}</span></li>
                <li><label>提货车号：</label><span>{{mainInfo.vehicleNumber}}</span></li>
                <li><label>制单人：</label><span>{{mainInfo.creatorName}}</span></li>
            </ul>
        </div>
        <div class="content" deep="1">
            <div class="text">
                <table class="contentTable" style="margin-top: 10px;">
                    <thead> 
                        <tr>
                            <th style="width: 35px;">序号</th>
                            <th>卡号</th>
                            <th>捆包号</th>
                            <th>品种</th>
                            <th>材质(钢种)</th>
                            <th style="width: 50px;">规格</th>
                            <th>产地</th>
                            <th>数量</th>
                            <th>计重方式</th>
                            <th>净重</th>
                            <th>库位</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :key="item.id" v-for="(item,index) in detailInfo">  
                            <td >{{index+1}}</td>
                            <td >{{item.cstPackNo}}</td>
                            <td >{{item.packNo}}</td>
                            <td >{{item.brandId}}</td>
                            <td >{{item.textureId}}</td>
                            <td >{{item.spec}}</td>
                            <td >{{item.producingId}}</td>
                            <td >{{item.number}}</td>
                            <td >{{item.calcType}}</td>
                            <td >{{item.netWeight}}</td>
                            <td >{{item.stack}}</td>
                            <td >{{item.remark}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>合计</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{mainInfo.allNumber}}</td>
                            <td></td>
                            <td>{{mainInfo.totalNetWeight}}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="bot">
            <table>
                <tbody>
                <tr>
                    <td>说明：{{mainInfo.remark}}</td><td colspan="3"></td>
                </tr>
                <tr>
                    <td width="70">仓库单位：</td><td>{{mainInfo.whsInfo.name}}</td>
                    <td width="70">联系电话：</td><td width="150">{{mainInfo.whsInfo.phone}}</td>
                </tr>
            </tbody></table>
        </div>
    </div>
    </div>
    </body>
    </html>
</template>
<script>
import cacheUtil from "@/common/utils/CacheUtil";
import componentUtil from "@/common/utils/ComponentUtil";
import metadata from "@/common/entities/Metadata";
export default {
    props: {
    },
    data:function(){
        return{
            config:{
                mainEntity:metadata.whsOut,
                detailEntity:metadata.wmsTransferDetail,
                dicCache:null
            },
            mainInfo:{whsInfo:{name:''},stack:''},
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
        getDisplayModel(data,entity){
            //字典缓存使用懒加载
            if(!this.config.dicCache){
                this.config.dicCache = cacheUtil.getDic()
            };
            let result = {};
            let stack = null;
            for(var item in data){
                let displayText = componentUtil.getDisplayText(
                    entity,
                    item,
                    data[item],
                    this.config.dicCache
                );
                result[item] = displayText; 
            }
            stack = componentUtil.getStackName(this.config.dicCache,data,'whsRoomId','whsAreaId');
            if(data['whsStackName']){
                stack = stack + ">" + data['whsStackName'];
            }
            if(data['whsLayer']){
                stack = stack + ">" + data['whsLayer'];
            }
            result['stack'] = stack;
            return result;
        },
        initData(entity){
            //明细单的转换
            let _this = this;
            this.detailInfo = entity.detailList.map(item =>_this.getDisplayModel(item,this.config.detailEntity));
            //主单的转换
            this.mainInfo = this.getDisplayModel(entity,this.config.mainEntity);

            this.mainInfo.whsInfo = cacheUtil.getUser().accountInfo;

            //遍历数量求合计
            if(!this.mainInfo.allNumber){ 
                let allNumber=0; 
                this.detailInfo.forEach((row, index) => {
                        let  value = Number(row.number);
                        if (!isNaN(value)) {
                        allNumber= allNumber + value;
                        } 
                });
                this.mainInfo.allNumber=allNumber;
            }
            //遍历重量求合计
            if(!this.mainInfo.totalNetWeight){ 
                let totalNetWeight=0; 
                this.detailInfo.forEach((row, index) => {
                        let  value = Number(row.netWeight);
                        if (!isNaN(value)) {
                        totalNetWeight= totalNetWeight + value;
                        } 
                });
                this.mainInfo.totalNetWeight=totalNetWeight.toFixed(3);
            }
        }
    },
    updated(){
        if(this.mainInfo && this.isPrinting){
            printJS({
                printable: this.key,
                type: 'html',
                header: '打印出库单',
                scanStyles:false,
                css: "/static/css/contract.css"

            });
        }
        this.isPrinting = false;
    },
}
</script>



