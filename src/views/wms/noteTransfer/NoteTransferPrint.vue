<template>
    <html :id="key">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>过户单</title>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

    </head>
    <body>
   <div>
       <div class="cont" id="printDiv">
        <div class="title">过户单</div>
        <div class="contractInfor clearfix">
            <ul class="fl">
                <li><label>过户单号：</label><span>{{mainInfo.transferNo}}</span></li>
                <li><label>原货主：</label><span>{{mainInfo.oldCstId}}</span></li>
                <li><label>仓库：</label><span>{{mainInfo.whsInfo.name}}</span></li>
                <li><label>新货主：</label><span>{{mainInfo.newCstId}}</span></li>
            </ul>
            <ul class="fr">
                <li><label>过户时间：</label><span>{{mainInfo.transferTime}}</span></li>
                <li><label>过户状态：</label><span>{{mainInfo.transferStatus}}</span></li>
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
                            <th>计量方式</th>
                            <th>净重</th>
                            <th>毛重</th>
                            <th>磅重</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :key="item.id" v-for="(item,index) in detailInfo">  
                            <td >{{index+1}}</td>
                            <td >{{item.cardNo}}</td>
                            <td >{{item.packNo}}</td>
                            <td >{{item.brandId}}</td>
                            <td >{{item.textureId}}</td>
                            <td >{{item.spec}}</td>
                            <td >{{item.producingId}}</td>
                            <td >{{item.amount}}</td>
                            <td >{{item.calcType}}</td>
                            <td >{{item.netWeight}}</td>
                            <td >{{item.grossWeight}}</td>
                            <td >{{item.poundWeight}}</td>
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
                            <td>{{mainInfo.totalAmout}}</td>
                            <td></td>
                            <td>{{mainInfo.totalNetWeight}}</td>
                            <td>{{mainInfo.totalGrossWeight}}</td>
                            <td>{{mainInfo.totalPoundWeight}}</td>
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
                mainEntity:metadata.wmsTransfer,
                detailEntity:metadata.wmsTransferDetail,
                dicCache:null
            },
            mainInfo:{
                whsInfo:{}
            },
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
            for(var item in data){
                let displayText = componentUtil.getDisplayText(
                    entity,
                    item,
                    data[item],
                    this.config.dicCache
                );
                result[item] = displayText; 
            }
            return result;
        },
        initData(entity){
            //明细单的转换
            let _this = this;
            this.detailInfo = entity.detailList.map(item =>_this.getDisplayModel(item,this.config.detailEntity));
            //主单的转换
            this.mainInfo = this.getDisplayModel(entity,this.config.mainEntity);
            this.mainInfo.whsInfo = cacheUtil.getUser().accountInfo;
        }
    },
    updated(){
        if(this.mainInfo && this.isPrinting){
            printJS({
                printable: this.key,
                type: 'html',
                header: '打印过户单',
                scanStyles:false,
                css: "/static/css/contract.css"

            });
        }
        this.isPrinting = false;
    },
}
</script>



