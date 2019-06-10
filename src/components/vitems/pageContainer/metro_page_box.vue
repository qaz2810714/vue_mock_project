<template>
    <div class="row-fluid">
        <div class="span12">
            <div class="portlet box">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'metro_page_box'
}
</script>

<style scoped>
    /* .portlet {
        margin-bottom: 5px;
    }
    .portlet.box .portlet-body {
        padding: 5px 5px 2px 5px;
    } */
</style>