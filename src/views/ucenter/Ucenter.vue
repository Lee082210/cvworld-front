<template>
  <div class="container-body ucenter" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
    <!-- 板块导航信息 -->
    <div class="user-banner">
      <!-- 面包屑导航栏效果 -->
      <router-link to="/" class="a-link"> 首页 </router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="ucenter-panel">
      <div class="user-side">
        <!-- 头像信息 -->
        <div class="avatar-panel">
          <div class="edit-btn a-link" v-if="isCurrentUser" @click="updateUserInfo">编辑资料</div>
          <div class="avatar-inner">
            <Avatar :userId="userInfo.userId" :addLink="false" :width="120"></Avatar>
          </div>
          <div class="nick-name">
            <span class="">{{ userInfo.nickName }}</span>
            <span v-if="userInfo.sex == 0" class="iconfont icon-woman"></span>
            <span v-if="userInfo.sex == 1" class="iconfont icon-man"></span>
          </div>
          <div class="desc">
            {{ userInfo.personDescription }}
          </div>
        </div>
        <!-- 积分信息 -->
        <div class="user-extend-panel">
          <div class="info-item">
            <div class="label iconfont icon-integral">积分</div>
            <div :class="['value', isCurrentUser ? 'a-link' : '']" @click="showIntegralRecord">
              {{ userInfo.currentIntegral }}
            </div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-like">获赞</div>
            <div class="value">{{ userInfo.likeCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-post">发帖</div>
            <div class="value">{{ userInfo.postCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-register">加入</div>
            <div class="value">{{ userInfo.joinTime }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-login">最后登录</div>
            <div class="value">{{ userInfo.lastLoginTime }}</div>
          </div>
        </div>
      </div>
      <div class="article-panel">
        <el-tabs :model-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane label="发帖" :name="0"></el-tab-pane>
          <el-tab-pane label="评论" :name="1"></el-tab-pane>
          <el-tab-pane label="点赞" :name="2"></el-tab-pane>
        </el-tabs>
        <div class="article-list">
          <DataList
            :loading="loading"
            :dataSource="articleListInfo"
            @loadData="loadArticle"
            noDataMsg="暂无相关文章">
            <template #default="{ data }">
              <ArticleListItem
                :data="data"
                :showEdit="activeTabName == 0 && isCurrentUser"
                :showComment="showComment"></ArticleListItem>
            </template>
          </DataList>
        </div>
      </div>
    </div>
    <!-- 修改用户信息 -->
    <UcenterEditUserInfo ref="ucenterEditUserInfoRef" @resetUserInfo="resetUserInfoHandler">
    </UcenterEditUserInfo>
    <!-- 用户积分记录 -->
    <UserIntegralRecord ref="ucenterIntegralRecordRef"></UserIntegralRecord>
  </div>
</template>

<script setup>
import UcenterEditUserInfo from './UcenterEditUserInfo.vue'
import UserIntegralRecord from './UserIntegralRecord.vue'
import ArticleListItem from '@/views/forum/ArticleListItem.vue'
import { ref, getCurrentInstance, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const store = useStore()

const api = {
  getUserInfo: '/ucenter/getUserInfo', //获取用户信息
  loadUserArticle: '/ucenter/loadUserArticle', //获取用户发帖
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

//主页右侧文章详情
const activeTabName = ref(0)
const changeTab = (type) => {
  activeTabName.value = type
  loadArticle()
}
//控制骨架屏显示
const loading = ref(false)
const articleListInfo = ref({})
const loadArticle = async () => {
  loading.value = true
  let params = {
    pageNo: articleListInfo.value.pageNo,
    type: activeTabName.value,
    userId: userId.value,
  }
  let result = await proxy.Request({
    url: api.loadUserArticle,
    params: params,
    showLoading: false,
  })
  loading.value = false
  if (!result) return
  articleListInfo.value = result.data
}

const isCurrentUser = ref(false)
//重置当前用户
const resetCurrentUser = () => {
  // 重新设定当前用户
  const loginUserInfo = store.getters.getLoginUserInfo
  if (loginUserInfo && loginUserInfo.userId === userId.value) {
    isCurrentUser.value = true
  } else {
    isCurrentUser.value = false
  }
}
//watch的触发要优先于onMounted
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser()
  },
  { immediate: true, deep: true }
)
watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal
      resetCurrentUser()
      loadUserInfo()
      loadArticle()
    }
  },
  { immediate: true, deep: true }
)

//修改用户信息
const ucenterEditUserInfoRef = ref(null)
const updateUserInfo = () => {
  ucenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value)
}

const resetUserInfoHandler = (data) => {
  userInfo.value = data
}

//获取用户积分
const ucenterIntegralRecordRef = ref(null)
const showIntegralRecord = () => {
  ucenterIntegralRecordRef.value.showRecord()
}

//根据后端接口判断是否关闭评论区
const showComment = ref(false)
//监听showComment
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.ucenter {
  .user-banner {
    color: #9ba7b9;
    line-height: 30px;
    .icon-right {
      padding: 0px 5px;
    }
  }
  .ucenter-panel {
    display: flex;
    .user-side {
      width: 300px;
      margin-right: 10px;
      .avatar-panel {
        background: #fff;
        text-align: center;
        padding: 10px;
        .edit-btn {
          text-align: right;
          font-size: 14px;
        }
        .avatar-inner {
          display: flex;
          justify-content: center;
        }
        .nick-name {
          .icon-woman {
            margin-left: 5px;
            color: var(--pink);
          }
          .icon-man {
            margin-left: 5px;
            color: var(--link);
          }
        }
        .desc {
          margin-top: 5px;
          text-align: center;
          font-size: 14px;
          color: #929393;
        }
      }
      .user-extend-panel {
        margin-top: 5px;
        background: #fff;
        padding: 10px;
        .info-item {
          display: flex;
          justify-content: space-between;
          line-height: 30px;
          .label {
            font-size: 13px;
          }
          .label::before {
            font-size: 22px;
            color: #adadad;
            padding-right: 5px;
          }
          .value {
            font-size: 13px;
          }
        }
      }
    }
    .article-panel {
      flex: 1;
      background: #fff;
      padding: 0px 10px 10px 10px;
    }
  }
}
</style>
