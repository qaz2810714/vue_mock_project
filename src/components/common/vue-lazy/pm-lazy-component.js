/**
  * vue-lazy-component
  * (c) 2017 赵兵
  * @license MIT
  */
const PmLazyComponent = require('./PmLazyComponent.vue')
const pmLazyComponent = {}

/**
 * Plugin API
 */
pmLazyComponent.install = function (Vue, options) {
  Vue.component(PmLazyComponent.name, PmLazyComponent)
}

pmLazyComponent.component = PmLazyComponent

/**
 * Auto install
 */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(pmLazyComponent)
}

module.exports = pmLazyComponent
