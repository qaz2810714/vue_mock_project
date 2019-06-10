<template>
    <div class="row-fluid">
        <div class="span12">
            <!-- BEGIN PAGE TITLE & BREADCRUMB-->
            <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="#/">主页</a>
                    <i class="icon-angle-right"></i>
                </li>
                <li v-for="(menuItem, index) in menuPathArray" :key="menuItem.id">
                    <i :class="menuItem.icon"></i>
                    <a :href="menuItem.children ? 'javascript:;' : '#' + menuItem.url">{{menuItem.name}}</a>
                    <i v-if="index != menuPathArray.length - 1" class="icon-angle-right"></i>
                </li>
            </ul>
            <!-- END PAGE TITLE & BREADCRUMB-->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'metro_pageheader',
        props: {
            menuPathArray: {
                type: Array,
                default: []
            }
        }
    }
</script>

<style scoped>
    /* .page-content .breadcrumb {
        background-color: rgb(187, 187, 187);
        padding: 2px 15px;
    } */
</style>


