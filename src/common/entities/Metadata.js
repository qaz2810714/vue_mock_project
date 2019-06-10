import wmsStock from './WmsStock'
import wmsNoteAdjust from './WmsNoteAdjust'
import wmsNoteLock from './WmsNoteLock'
import wmsNoteLockDetail from './WmsNoteLockDetail'
import wmsNoteAdjustDetail from './WmsNoteAdjustDetail'
import storeLocation from './StoreLocation'
import whsOut from './WmsOut'
import wmsIn from './WmsIn'
import wmsMove from './WmsMove'
import wmsTransfer from './WmsTransfer'
import wmsTransferDetail from './WmsTransferDetail'
import baseCst from './baseCst'
import baseDictionary from './baseDictionary'
import regular from './CostRegularStatus'
import baseBrand from './BaseBrand'
import role from './Role'
import physicalWeight from './physicalWeight'
/**
 * 导出元数据
 */
export default {
    //库存表
    wmsStock,
    //调整单
    wmsNoteAdjust,
    //调整明细
    wmsNoteAdjustDetail,
    //锁定单
    wmsNoteLock,
    //锁定单明细
    wmsNoteLockDetail,
    //库位转换策略
    storeLocation,
    //货主
    baseCst,
    //出库
    whsOut,
    //入库
    wmsIn,
    //移库
    wmsMove,
    //过户单
    wmsTransfer,
    //过户单明细
    wmsTransferDetail,
    //字典model转换策略
    baseDictionary,
    //计费规则
    regular,
    //品种
    baseBrand,
    //角色
    role,
    //理重
    physicalWeight
};