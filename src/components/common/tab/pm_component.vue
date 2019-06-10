<template>
  <div class="content pr10">
      <slot :row="tabData">
        <component :is="tabData.component" v-if="tabData.component"></component>
      </slot>
  </div>
</template>

<script>
export default {
  data(){
    return {
      propsData:Object,
    }
  },
  props: {
    tabData: Object,
  },
  created() {
    this.propsData = this.tabData.propsData;
  }
};
</script>
