<template>
    <el-tree
    :data="data"
    show-checkbox
    default-expand-all
    node-key="id"
    ref="tree"
    highlight-current
    :props="defaultProps">
    </el-tree>
</template>

<script>
  export default {
      props:{
          data:Array,
      },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  };
</script>