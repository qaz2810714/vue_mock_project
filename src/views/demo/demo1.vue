<template>
<div>
    <x_upload></x_upload>

    <x_tree width="200" height="200" :name="name" parentName="abc" childName="def" ref="demo1"></x_tree>
    <!-- <x_treeGrid :data="options"></x_treeGrid> -->
    <el-button @click="show"></el-button>

    <!-- <pm_dic-menu filedName="name" valueKey="index" labelName="字典分类" height="300" :data="list"></pm_dic-menu> -->
    <pm_tree :data="data2"></pm_tree>
</div>
</template>

<script>
    import Upload from '@/components/common/upload/pm_upload';
    import TreeSelect from '@/components/common/treeSelect/pm_treeSelect';
    import TreeGrid from '@/components/common/treeSelect/TreeGrid';
    import pm_dicMenu from '@/components/common/dicMenu/pm_dicMenu';
    import pm_tree from '@/components/common/tree/pm_tree';
    export default {
        components: {'x_upload':Upload,'x_tree':TreeSelect,'x_treeGrid':TreeGrid,'pm_dicMenu':pm_dicMenu,'pm_tree':pm_tree},
        data() {
            return {
            name:'DicWhsCalcStackName',
            //数据源
            list:[{
                name:"费用类型",
                index:"1",
            },
            {
                name:"调整类型",
                index:"2",
            },
            {
                name:"调整类型",
                index:"3",
            },
            {
                name:"调整类型",
                index:"4",
            },
            {
                name:"调整类型",
                index:"5",
            },
            {
                name:"调整类型",
                index:"6",
            },
            {
                name:"调整类型",
                index:"7",
            },
            {
                name:"调整类型",
                index:"8",
            },
            ],
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        };
        },
        methods:{
            show(){
                console.log(this.$refs.demo1.getValue());
            }
        },
    };
</script>