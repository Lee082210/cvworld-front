<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in 4" :key="item" class="carousel-style">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const api = {
  getUserInfo: '/ucenter/getUserInfo',
}

const userId = ref(null)
const userInfo = ref({})

const loadUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    params: {
      userId: userId.value,
    },
    //如果用户信息错误，返回一个错误信息提示
    errorCallback: () => {
      setTimeout(() => {
        router.push('/')
      }, 1500)
    },
  })
  if (!result) return
  userInfo.value = result.data
}

watch(
  () => route.params.userId,
  (newValue, oldValue) => {
    if (newValue) {
      userId.value = newValue
      loadUserInfo()
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.carousel-style {
  border-radius: 5px;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
