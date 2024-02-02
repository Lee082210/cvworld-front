<template>
  <div>
    <div class="header" v-show="showHeader">
      <!-- logo -->
      <transition
        name="animate__animated animate__bounce"
        enter-active-class="animate__backInLeft"
        appear
      >
        <router-link to="/" class="logo">
          <span
            v-for="item in logoInfo"
            :style="{ color: item.color }"
            :key="item.color"
            >{{ item.letter }}</span
          >
        </router-link>
      </transition>
      <div
        class="header-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <div class="show-navigate">
          <span
            class="iconfont icon-expand"
            v-if="showNavigate === 0"
            @click="handlerShowNav(0)"
          ></span>
          <span
            class="iconfont icon-collapse"
            v-else
            @click="handlerShowNav(1)"
          ></span>
        </div>

        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInRight"
          appear
          v-if="showNavigate === 1"
        >
          <!-- 板块信息 -->
          <div class="menu-panel">
            <router-link
              :class="[
                'menu-item home',
                activePboardId == undefined ? 'active' : '',
              ]"
              to="/"
            >
              首页</router-link
            >
            <span @click="handlerMessage"  
            class="menu-item activePro"
            >留言板</span>
            <template v-for="board in boardList" :key="board.boardId">
              <el-popover
                placement="bottom-start"
                :width="300"
                trigger="hover"
                v-if="board.children.length > 0"
              >
                <template #reference>
                  <span
                    :class="[
                      'menu-item',
                      board.boardId == activePboardId ? 'active' : '',
                    ]"
                    @click="boardClickHandler(board)"
                  >
                    {{ board.boardName }}</span
                  >
                </template>
                <div class="sub-board-list">
                  <span
                    :class="[
                      'sub-board',
                      subBoard.boardId == activeBoardId ? 'active' : '',
                    ]"
                    v-for="subBoard in board.children"
                    :key="subBoard.boardId"
                    @click="subClickHandler(subBoard)"
                    >{{ subBoard.boardName }}
                  </span>
                </div>
              </el-popover>
              <span
                :class="[
                  'menu-item',
                  board.boardId == activePboardId ? 'active' : '',
                ]"
                v-else
                @click="boardClickHandler(board)"
                >{{ board.boardName }}</span
              >
            </template>
          </div>
        </transition>
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          appear
        >
          <!-- 登录、注册、用户信息 -->
          <div class="user-info-panel">
            <div class="op-btn">
              <el-button class="op-btn" @click="goSearch">
                <span class="iconfont icon-search"></span>
              </el-button>
            </div>
            <!-- 显示用户信息 -->
            <template v-if="userInfo.userId">
              <div class="message-info">
                <el-dropdown>
                  <el-badge
                    :value="messageCountInfo.total"
                    class="item"
                    :hidden="
                      messageCountInfo.total == null ||
                      messageCountInfo.total == 0
                    "
                  >
                    <div class="iconfont icon-message"></div>
                  </el-badge>

                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        @click="gotoMesssage('reply')"
                        class="message-item"
                      >
                        <span class="text">回复我的</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.reply > 0"
                        >
                          {{
                            messageCountInfo.reply > 99
                              ? "99+"
                              : messageCountInfo.reply
                          }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="gotoMesssage('likePost')"
                        class="message-item"
                      >
                        <span class="text">赞了我的文章</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.likePost > 0"
                        >
                          {{
                            messageCountInfo.likePost > 99
                              ? "99+"
                              : messageCountInfo.likePost
                          }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="gotoMesssage('downloadAttachment')"
                        class="message-item"
                      >
                        <span class="text">下载了我的附件</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.downloadAttachment > 0"
                        >
                          {{
                            messageCountInfo.downloadAttachment > 99
                              ? "99+"
                              : messageCountInfo.downloadAttachment
                          }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="gotoMesssage('likeComment')"
                        class="message-item"
                      >
                        <span class="text">赞了我的评论</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.likeComment > 0"
                        >
                          {{
                            messageCountInfo.likeComment > 99
                              ? "99+"
                              : messageCountInfo.likeComment
                          }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="gotoMesssage('sys')"
                        class="message-item"
                      >
                        <span class="text">系统消息</span>
                        <span class="count-tag" v-if="messageCountInfo.sys > 0">
                          {{
                            messageCountInfo.sys > 99
                              ? "99+"
                              : messageCountInfo.sys
                          }}
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="user-info">
                <el-dropdown>
                  <Avatar
                    class="avatar-userinfo"
                    :userId="userInfo.userId"
                    :width="50"
                    :addLink="false"
                  ></Avatar>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="isPost"
                        >发布帖子</el-dropdown-item
                      >
                      <el-dropdown-item @click="gotoUcnter(userInfo.userId)"
                        >我的主页</el-dropdown-item
                      >
                      <el-dropdown-item @click="loginOut"
                        >退出</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <el-button-group :style="{ 'margin-left': '20px;' }" v-else>
              <div @click="loginAndRegister(1)" class="op-btn avatar-userinfo">
                <el-avatar :icon="UserFilled" />
              </div>
            </el-button-group>
          </div>
        </transition>
      </div>
    </div>
    <div class="body-content">
      <router-view></router-view>
    </div>
    <!-- 底部footer -->
    <div class="footer" v-if="showFooter">
      <div
        class="footer-content container-body"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <el-row>
          <el-col :span="6" class="item">
            <div class="logo">
              <div class="logo-letter">
                <span
                  v-for="item in logoInfo"
                  :style="{ color: item.color }"
                  :key="item.color"
                >
                  {{ item.letter }}
                </span>
              </div>
            </div>
            <div class="info">
              cv论坛欢迎您，愿你在cv的日子里生活如意，事事顺心。
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">备案信息</div>
            <div>
              <a href="https://beian.miit.gov.cn"
                >© 2024 liqicheng All rights reserved</a
              >
            </div>
            <div>
              <a href="https://beian.miit.gov.cn">桂ICP备2024019458号</a>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">友情链接</div>
            <div><a href="http://liqicheng.top">友情链接</a></div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title-img">
              <span>扫码联系我</span>
              <img src="../assets/images/wechatid.jpg" alt="" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 回到顶部 -->
    <el-backtop :right="100" :bottom="100"></el-backtop>
    <!-- 未登录状态操作时发送弹窗引导登录 -->
    <Dialog
      :show="dialogConfig.show"
      :buttons="dialogConfig.buttons"
      :title="dialogConfig.title"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <span :style="{ 'text-align': 'center;' }"
        >当前为未登录状态，是否前往登录页？</span
      >
    </Dialog>
  </div>
</template>

<script setup>
import { UserFilled } from "@element-plus/icons-vue";
import "animate.css";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();


//是否显示菜单
const showNavigate = ref(0); //0-隐藏  1-显示
const handlerShowNav = (type) => {
  if (type === 0) {
    showNavigate.value = 1;
  } else {
    showNavigate.value = 0;
  }
};

const logoInfo = ref([
  {
    letter: "CV",
    color: "#3285FF",
  },
  {
    letter: "World",
    color: "#4d4e50",
  },
]);
const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  getMessageCount: "/ucenter/getMessageCount", //用户消息数量
  logout: "/logout",
  getSysSetting: "/getSysSetting",
};

const dialogConfig = reactive({
  show: false,
  title: "提示",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: () => {
        newPost();
      },
    },
  ],
});

const showHeader = ref(true);

//获取滚动条
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};
const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currenScrollTop = getScrollTop();
    if (currenScrollTop > initScrollTop) {
      //往下滚动
      scrollType = 1;
    } else {
      scrollType = 0;
    }
    initScrollTop = currenScrollTop;
    if (scrollType == 1 && currenScrollTop > 120) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};

//登陆注册
const opType = ref();
const loginAndRegister = (type) => {
  opType.value = type;
  router.push("/login");
};

onMounted(() => {
  initScroll();
  getUserInfo();
  loadSysSetting();
});

//获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  store.commit("updateLoginUserInfo", result.data);
};

//获取板块信息
const boardList = ref([]);
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
  store.commit("saveBoardList", result.data);
};
loadBoard();

//监听 登录用户的信息
const userInfo = ref();
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal !== undefined && newVal !== null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);
//监听用户未登录状态是否要展示登录框
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      //调用登录方法， 1=登录页
      loginAndRegister(1);
    }
  },
  { immediate: true, deep: true }
);

//板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};

//二级板块
const subClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};

//当前选中的板块  一级板块
const activePboardId = ref(0);
watch(
  () => store.state.activePboardId,
  (newVal, oldVal) => {
    activePboardId.value = newVal;
  },
  { immediate: true, deep: true }
);

//当前选中的板块  二级板块
const activeBoardId = ref(0);
watch(
  () => store.state.activeBoardId,
  (newVal, oldVal) => {
    if (newVal != undefined) {
      activeBoardId.value = newVal;
    }
  },
  { immediate: true, deep: true }
);

const isPost = () => {
  if (!store.getters.getLoginUserInfo) {
    dialogConfig.show = true;
  } else {
    newPost();
  }
};
//发布文章
const newPost = () => {
  //判断是否登录状态
  if (!store.getters.getLoginUserInfo) {
    loginAndRegister(1);
  } else {
    router.push("/newPost");
  }
};

const handlerMessage = ()=>{
  //跳转到留言板
  router.push("/msgboard");
}

//点击我的主页跳转用户中心
const gotoUcnter = (userId) => {
  router.push(`/user/${userId}`);
};

//用户消息提示
const gotoMesssage = (type) => {
  router.push(`/user/message/${type}`);
};

const messageCountInfo = ref({});
const loadMessageCount = async () => {
  let result = await proxy.Request({
    url: api.getMessageCount,
  });
  if (!result) return;
  messageCountInfo.value = result.data;
  store.commit("updateMessageCountInfo", result.data);
};
//监听消息数量的变化
watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

//用户退出登录
const loginOut = () => {
  proxy.Confirm("确定要退出登录吗？", async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) return;
    store.commit("updateLoginUserInfo", null);
  });
};
//监听用户是否登录状态，判断是否要请求消息喇叭接口
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      loadMessageCount();
    }
  },
  { immediate: true, deep: true }
);

// 获取系统配置
const loadSysSetting = async () => {
  let result = await proxy.Request({
    url: api.getSysSetting,
  });
  if (!result) {
    return;
  }
  // 保存系统设置
  store.commit("saveSysSetting", result.data);
};

// 搜索
const goSearch = () => {
  router.push("/search");
};

//是否展示底部
const showFooter = ref(true);
watch(
  () => route.path,
  (newVal, oldVal) => {
    if (newVal.indexOf("newPost") != -1 || newVal.indexOf("editPost") != -1) {
      showFooter.value = false;
    } else {
      showFooter.value = true;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.header {
  top: 0px;
  width: 100%;
  height: 70px;
  position: fixed;
  box-shadow: 0px 2px 6px 0px #ddd;
  z-index: 1000;
  background: #fff;
  .logo {
    position: fixed;
    top: 0px;
    left: 0px;
    text-decoration: none;
    margin-top: 10px;
    span {
      font-size: 35px;
    }
  }
  .header-content {
    position: relative;
    align-items: center;
    margin: 0 auto;
    height: 60px;
    display: flex;
    .show-navigate {
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .show-navigate:hover {
      transform: scale(1.5);
      transition: 0.5s;
    }
    .menu-panel {
      flex: 1;
      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }
      .home {
        color: #000;
      }
      .active {
        padding: 5px 10px 5px 10px;
        background-color: var(--link);
        border-radius: 15px;
        color: #fff;
        transition: 0.3s;
      }
      .activePro{
        padding: 5px 10px 5px 10px;
        background-image: linear-gradient(to bottom right, #d834c2, #2088dd);
        border-radius: 15px;
        color: #fff;
        transition: 0.3s;
      }
    }
    .user-info-panel {
      flex: 1;
      position: fixed;
      top: 10;
      right: 0px;
      width: 300px;
      display: flex;
      align-items: center;
      .op-btn {
        cursor: pointer;
        margin-right: 5px;
        .iconfont {
          margin-left: 4px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
      .avatar-userinfo:hover {
        transform: scale(1.2);
        transition: 0.5s;
      }
      .message-info {
        cursor: pointer;
        margin: 0px 20px 0px 15px;
        .icon-message {
          font-size: x-large;
          color: #3285ff;
        }
      }
      .user-info {
        outline: none;
        cursor: pointer;
      }
    }
  }
}

.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;

  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    background: #ddd;
    border: 1px solid #ddd;
    color: rgb(135, 134, 134);
    margin-top: 1px;
    cursor: pointer;
  }

  .sub-board:hover {
    color: var(--link);
  }

  .active {
    background: var(--link);
    color: #fff;
  }

  .active:hover {
    color: #fff;
  }
}

.body-content {
  margin-top: 70px;
  position: relative;
  min-height: calc(100vh - 210px);
}

.message-item {
  display: flex;
  justify-content: space-around;

  .text {
    flex: 1;
  }

  .count-tag {
    height: 15px;
    min-width: 20px;
    line-height: 15px;
    display: inline-block;
    background: #f56c6c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
}

.footer {
  height: 140px;
  margin-top: 10px;
  background: #bdc3c7;
  /* fallback for old browsers */
  // background: -webkit-linear-gradient(to right, #4a6888, #bdc3c7);  /* Chrome 10-25, Safari 5.1-6 */
  // background: linear-gradient(to right, #4a6888, #bdc3c7);

  .footer-content {
    padding-top: 10px;
  }
  .item {
    text-align: center;
    .title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .title-img {
      font-size: 16px;
      width: 100px;
      height: 100px;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    a {
      font-size: 14px;
      text-decoration: none;
      color: var(--text2);
      line-height: 25px;
    }

    .logo {
      .logo-letter {
        font-size: 30px;
        cursor: pointer;
      }
    }

    .info {
      margin-top: 20px;
      color: rgb(93, 91, 91);
    }
  }
}
</style>
