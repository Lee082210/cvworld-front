<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item
      v-for="item in userInfo"
      :key="item.userId"
      class="carousel-style"
    >
      <div class="swipper-panel">
        <span class="swipper-title">风云人物榜</span>
        <div class="header-avatar">
          <Avatar :userId="item.userId" :addLink="false"></Avatar>
          <div class="swipper-userInfo">
            <span
              >昵称：<router-link
                :to="'/user/' + +item.userId"
                class="a-link"
                >{{ item.nickName }}</router-link
              ></span
            >
            <span
              >点赞：<el-tag>{{ item.sales }}</el-tag></span
            >
          </div>
          <div class="swipper-userInfo" style="margin-left: 20px">
            <span>码龄：{{ item.age }}</span>
            <span
              >评级：<el-rate
                v-model="item.Ratevalue"
                allow-half
                :disabled="true"
            /></span>
          </div>
        </div>
        <div class="userInfo-desc">
          <h4>墓志铭：</h4>
          <span>{{ item.personDescription }}</span>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import Avatar from "@/components/Avatar.vue";
import { ref, reactive, getCurrentInstance } from "vue";

//虚拟数据
const userInfo = reactive([
  {
    userId: 1890524956,
    nickName: "测试账号",
    personDescription: "我只是一个测试账号而已123",
    sales: 100,
    age: "3年",
    Ratevalue: 3.5,
  },
  {
    userId: 2793716985,
    nickName: "程序员Lee",
    personDescription: "真是ikun，只会唱跳Rap篮球和Music",
    sales: 89,
    age: "2.5年",
    Ratevalue: 4.5,
  },
  {
    userId: 7437465925,
    nickName: "测试账号02",
    personDescription: "我是测试账号02，你想咋滴？",
    sales: 199,
    age: "5年",
    Ratevalue: 4,
  },
]);
</script>

<style lang="scss" scoped>
.carousel-style {
  padding-left: 10px;
  border-radius: 5px;
  .swipper-panel {
    display: flex;
    flex-direction: column;
    .swipper-title {
      display: flex;
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      justify-content: center;
      align-items: center;
    }
    .header-avatar {
      display: flex;
      .swipper-userInfo {
        display: flex;
        flex-direction: column;
        margin: 5px 0px 10px 10px;
      }
    }
    .userInfo-desc {
      margin-left: 10px;
      h4 {
        line-height: 0px;
      }
    }
  }
}
.el-carousel__item:nth-child(2n) {
  background-color: #fff;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
