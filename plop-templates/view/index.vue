<template>
	<div class="{{name}}Container"></div>
</template>

<script setup lang="ts" name="{{name}}">
import { getCurrentInstance, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const {
	proxy: { $Urls, $Request, $Modal }
} = getCurrentInstance() as any;

const router = useRouter();

defineExpose({});

onMounted(() => {});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
