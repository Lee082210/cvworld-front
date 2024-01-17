<template>
  <div class="cover-upload">
    <el-upload
      name="file"
      :show-file-list="false"
      accept=".png, .PNG, .jpg, .JPG, .jpge, .JPGE, .gif, .GIF, .bmp, .BMP"
      :multiple="false"
      :http-request="uploadImage"
    >
      <div class="cover-upload-btn">
        <template v-if="localFile">
          <img :src="localFile" />
        </template>
        <template v-else>
          <img
            :src="
              (imageUrlPrefix ? imageUrlPrefix : proxy.globalInfo.imageUrl) +
              modelValue.imageUrl
            "
            v-if="modelValue && modelValue.imageUrl"
          />
          <span class="iconfont icon-add" v-else></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  imageUrlPrefix: {
    type: String,
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const localPreview = ref(false);
const localFile = ref();
const emit = defineEmits();

const uploadImage = async (file) => {
  //上传图片后，会返回一个file，读取文件流
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    localFile.value = target.result;
  };
  localPreview.value = true;
  emit("update:modelValue", file);
};
</script>

<style lang="scss" >
.cover-upload {
  .cover-upload-btn {
    background: #cecdcd;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .iconfont {
      font-size: 50px;
      color: #ddd;
    }
    img {
      width: 100%;
    }
  }
}
</style>
