<template>
    <el-container>
        <el-main style="padding:10px;">
            <iframe :src="iframeSrc" style="width:100%;border:none;"></iframe>
        </el-main>
    </el-container>
</template>

<script>
export default {
    props: {
        iframeSrc: {type: String}
    },
    mounted() {
        if(!this.iframeSrc) {
            this.iframeSrc = this.$route.meta.iframeSrc;
        }
    }
}
</script>

