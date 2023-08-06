<template>
  <div class="cover" :style="{ width: width + 'px', height: width + 'px' }">
    <el-image 
    :style="{ width: width + 'px', height: width + 'px' }"
    fit="scale-down"
    loading="lazy"
    :src="cover ? proxy.globalInfo.imageUrl+ cover : localCover ">

    </el-image>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from "vue";
const {proxy} = getCurrentInstance()

// 使用el-image的时候，通过这种方式导入本地图片(vite官网的方法)，或者在html中在路径前加上src('src/assets/vue.png')
const localCover = new URL('../assets/vue.png',import.meta.url).href

const props = defineProps({
  cover: {
    type: String,
  },
  width: {
    type: Number,
    default: 60,
  }
})

</script>

<style lang="scss" >
.cover{
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
}
</style>
