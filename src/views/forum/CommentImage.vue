<template>
  <!-- 评论区图片功能 -->
  <div>
    <el-image
    class="comment-img"
    :src="src"
    :zoom-rate="1.2"
    :preview-src-list="imgList ? imgList : [src]"
    :initial-index="0"
    fit="scale-down"
    loading="lazy"
    hide-on-clic-modal
  />
  </div>
</template>

<script setup>

const props = defineProps({
  src:{
    type: String,
  },
  imgList:{
    type: Array
  }
})
</script>

<style lang="scss" >
.comment-img{
  width: 80px;
  height: 80px;
  background: #eee;
}
</style>
