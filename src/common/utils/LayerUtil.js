/**
 * Layer插件的全局使用
 */
export default {
    closeWin: function () {
        this.$layer.close(this.$options.propsData.layerid);
    }
}