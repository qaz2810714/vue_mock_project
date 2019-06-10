import metadata from "@/common/entities/Metadata";
let adjustTypeEnum = metadata.wmsNoteAdjust.adjustType;

/**
 * 基础策略
 */
let baseStrategy = function (pageObj) {
    this.pageObj = pageObj;
    /**
     * 获取验证方法
     */
    this.getValidRules = function () {
        var detailFunc = info => {
            return "捆包【" + info.packNo + "】";
        };
        var rules = [];
        rules.push({
            fieldName: "amount",
            msg: "调整数量必须大于0",
            getPrimaryMsg: detailFunc,
            validFunc: (detail, old) => {
                //1.执行数据联动
                var outByNum = this.pageObj.$commonUtil.valid.isOutByNum(detail.brandId);
                //按吨算 不看数量
                if (!outByNum) return false;
                if (detail.amount == null) detail.amount = 0;
                return detail.amount <= 0;
            }
        });
        rules.push({
            fieldName: "netWeight",
            msg: "调整净重必须大于0",
            getPrimaryMsg: detailFunc,
            validFunc: (detail, old) => {
                if (detail.netWeight == null) detail.netWeight = 0;
                return detail.netWeight <= 0;
            }
        });
        rules.push({
            fieldName: "transferTimes",
            msg: "过户次数不能小于0",
            getPrimaryMsg: detailFunc,
            validFunc: (detail, old) => {
                if (detail.transferTimes == null) detail.transferTimes = 0;
                return detail.transferTimes < 0;
            }
        });
        return rules;
    };
    /**
     * 提交前实体处理
     */
    this.beforeConfirmSetting = function (entity) {
        return entity;
    };
    /**
     * grid可编辑性设置
     */
    this.gridEditConfig = function () {};
    /**
     * 添加新行的设置
     */
    this.addNewDetailSetting = function () {};
    /**
     * 获取过滤条件
     */
    this.getFilter = function () {};
}

/**
 * 正常调整策略
 */
let normalAdjustStrategy = function (pageObj) {
    baseStrategy.call(this,pageObj);
    this.gridEditConfig = function () {
        pageObj.config.allowEdit = true;
    };
    this.getFilter = function () {
        return {
            extFilter: " (1=1) ",
            fStatus : [1, 3, 5],
            errorMsg: "非(在库或已出库)状态，不允许挑选",
            selectedValid : stock => {
                return (stock.status == 1 || stock.status == 3);
            }
        };
    }
};
/**
 * 清理策略
 */
let clearAdjustStrategy = function (pageObj) {
    baseStrategy.call(this,pageObj);
    this.getFilter = function () {
        return {
            extFilter: " (1=1) ",
            fStatus : [1],
            selectedValid : stock => {
                return true;
            }
        };
    };
    this.gridEditConfig = function () {
        pageObj.config.allowEdit = false;
    };
    this.beforeConfirmSetting = function (entity) {
        var newObj = pageObj.$commonUtil.deepClone(entity);
        var sumList = newObj.detailList.filter(a=>!a.ori);
        sumList.forEach(detail=>{
            //清理掉所有的库存数据
            detail.amount = 0;
            detail.netWeight = 0;
            detail.grossWeight = 0;
            detail.poundWeight = 0;
        });
        newObj.totalAmount = sum(sumList,a => a.amount);
        newObj.totalNetWeight = sum(sumList,a => a.netWeight);
        newObj.totalGrossWeight = sum(sumList,a => a.grossWeight);
        newObj.totalPoundWeight = sum(sumList,a => a.poundWeight);
        return newObj;
    };
};
/**
 * 统计合计值
 */
function sum(list,func){
    if(list==null || list.length==0) return 0;
    return list.map(func).reduce((sum, val) => { 
        const value = Number(val);
      if (!isNaN(value)) {
        return sum + value;
      } else {
        return sum;
    }});
}
/**
 * 状态调整策略
 */
let statusAdjustStrategy = function (pageObj) {
    baseStrategy.call(this,pageObj);
    this.getFilter = function () {
        return {
            fStatus : [3],
            selectedValid : stock => {
                return true;
            }
        }
    };
    this.gridEditConfig = function () {
        pageObj.config.allowEdit = false;
    };
};
/**
 * 清理策略
 */
let delAdjustStrategy = function (pageObj) {
    baseStrategy.call(this,pageObj);
    this.gridEditConfig = function () {
        pageObj.config.allowEdit = false;
    };
    this.getFilter = function () {
        return {
            extFilter : " (1=1) ",
            fStatus : [],
            selectedValid : stock => {
                return true;
            }
        }
    };
};


export default {
    sum,
    getAdjustStrategy: function (pageObj, adjustType) {
        switch (adjustType) {
            case adjustTypeEnum.Type_Normal:
                return new normalAdjustStrategy(pageObj);
            case adjustTypeEnum.Type_Clear:
                return new clearAdjustStrategy(pageObj);
            case adjustTypeEnum.Type_ConvertStatus:
                return new statusAdjustStrategy(pageObj);
            case adjustTypeEnum.Type_Del:
                return new delAdjustStrategy(pageObj);
        }
    }
}