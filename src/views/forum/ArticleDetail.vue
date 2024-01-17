<template>
  <!-- 文章详情页 -->
  <div
    class="container-body article-detail-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    v-if="Object.keys(articleInfo).length > 0"
  >
    <!-- 板块导航信息 -->
    <div class="board-info">
      <!-- 面包屑导航栏效果 -->
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">
        {{ articleInfo.pBoardName }}
      </router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link
          class="a-link"
          :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
        >
          {{ articleInfo.boardName }}
        </router-link>
        <span class="iconfont icon-right"></span>
      </template>
      <span>{{ articleInfo.title }}</span>
    </div>
    <!-- 文章具体内容 -->
    <div
      class="detail-container"
      :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
    >
      <div class="article-detail">
        <!-- 1标题、2用户信息、3文章详情 -->
        <div class="title">
          <el-tag v-if="articleInfo.status == 0" type="danger">待审核</el-tag>
          {{ articleInfo.title }}
        </div>
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>
          <div class="user-info-detail">
            <router-link :to="'/user/' + articleInfo.userId" class="nick-name">
              {{ articleInfo.nickName }}
            </router-link>
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address"
                >&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span
              >
              <span class="iconfont icon-eye-solid">
                {{
                  articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount
                }}
              </span>
              <router-link
                :to="`/editPost/${articleInfo.articleId}`"
                class="a-link btn-edit"
                v-if="articleInfo.userId == currentUserInfo.userId"
              >
                <span class="iconfont icon-edit">编辑</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!-- 附件 -->
      <div class="attachment-panel" v-if="attachment" id="view-attachment">
        <div class="title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip item"></div>
          <div class="file-name item">{{ attachment.fileName }}</div>
          <div class="size item">
            {{ proxy.Utils.sizeToStr(attachment.fileSize) }}
          </div>
          <div class="item">
            需要<span class="integral">{{ attachment.integral }}</span
            >积分
          </div>
          <div class="download-count item">
            已下载{{ attachment.downloadCount }}
          </div>
          <div class="download-btn item">
            <el-button
              type="primary"
              size="small"
              @click="downloadAttachment(attachment.fileId)"
              >下载</el-button
            >
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div
        class="comment-panel"
        id="view-comment"
        v-if="showComment && articleInfo.status == 1"
      >
        <CommentList
          v-if="articleInfo.articleId"
          :articleId="articleInfo.articleId"
          :articleUserId="articleInfo.userId"
          @updateCommentCount="updateCommentCount"
        >
        </CommentList>
      </div>
    </div>
    <!-- 文章目录 -->
    <div class="toc-panel">
      <div class="top-container">
        <div class="toc-title">目录</div>
        <div class="toc-list">
          <template v-if="tocArray.length == 0">
            <div class="no-toc">未解析到目录</div>
          </template>
          <template v-else>
            <div v-for="toc in tocArray" :key="toc.id">
              <span
                @click="gotoAnchor(toc.id)"
                :class="['toc-item', toc.id == anchorId ? 'active' : '']"
                :style="{ 'padding-left': toc.level * 15 + 'px' }"
                >{{ toc.title }}</span
              >
            </div>
          </template>
        </div>
      </div>
      <!-- 相关推荐-->
      <div class="hot-recommend"></div>
    </div>
  </div>

  <!-- 左侧快捷操作按钮 -->
  <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
    <!-- 点赞图标 -->
    <el-badge
      :value="articleInfo.goodCount"
      type="info"
      :hidden="!articleInfo.goodCount > 0"
    >
      <div class="quick-item" @click="doLikeHandler">
        <span
          :class="['iconfont icon-good', haveLike ? 'have-like' : '']"
        ></span>
      </div>
    </el-badge>
    <!-- 评论图标 -->
    <el-badge
      v-if="showComment"
      :value="articleInfo.commentCount"
      type="info"
      :hidden="!articleInfo.commentCount > 0"
    >
      <div
        class="quick-item"
        @click="goToPosition('view-comment')"
        v-if="showComment"
      >
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <!-- 附件图标 -->
    <div class="quick-item" @click="goToPosition('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <!-- 图片预览 -->
    <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
  </div>
</template>

<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";
import CommentList from "./CommentList.vue";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  // getUserInfo: "/ucenter/getUserInfo",  //获取用户信息
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "/forum/doLike",
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
  attachmentDownload: "/api/forum/attachmentDownload",
};

//编写接口拿到详情页数据
const articleInfo = ref({}); //文章详情
const attachment = ref({}); //附件
const haveLike = ref(false); //是否已点赞
const currentUserInfo = ref({});

const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;

  store.commit("setActivePboardId", result.data.forumArticle.pBoardId);
  store.commit("setActiveBoardId", result.data.forumArticle.boardId);
  //图片预览
  imagePreview();
  //代码高亮
  highlightCode();
  //生成目录
  makeToc();
};
//监听登录用户
watch(
  () => store.getters.getLoginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  getArticleDetail(route.params.articleId);
});

//快捷操作按钮设置
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110;

const goToPosition = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};

//点赞事件
const doLikeHandler = async () => {
  //判断是否登录
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  let result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId,
    },
  });
  if (!result) {
    return;
  }
  haveLike.value = !haveLike.value;
  let goodCount = 1;
  if (!haveLike.value) {
    goodCount = -1;
  }
  articleInfo.value.goodCount = articleInfo.value.goodCount + goodCount;
};

//下载附件操作
const downloadAttachment = async (fileId) => {
  //判断是否登录
  if (!currentUserInfo.value) {
    store.commit("showLogin", true);
    return;
  }
  //0积分情况下不用判断用户积分，或者下载用户为发布者
  if (
    attachment.value.integral == 0 ||
    currentUserInfo.value.userId != articleInfo.value.userId
  ) {
    downloadDo(fileId);
    return;
  }
  //获取用户积分
  let result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId,
    },
  });
  if (!result) {
    return;
  }
  //判断用户是否下载过附件
  if (result.data.haveDownload) {
    downloadDo(fileId);
    return;
  }
  //判断积分是否足够下载附件
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不足，无法下载");
    return;
  }
  proxy.Confirm(
    `你还有${result.data.userIntegral}积分，当前下载会扣除${attachment.value.integral}积分，确定要下载吗？`,
    () => {
      downloadDo(fileId);
    }
  );
};

const downloadDo = (fileId) => {
  document.location.href = api.attachmentDownload + "?fileId=" + fileId;
  attachment.value.downloadCount = attachment.value.downloadCount + 1;
};
//文章图片预览
const imageViewerRef = ref(null);
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#detail")
      .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};

//代码高亮
const highlightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((item) => {
      hljs.highlightBlock(item);
    });
  });
};

//更新评论数量
const updateCommentCount = (commentCount) => {
  articleInfo.value.commentCount = commentCount;
};

//文章作者资料

//获取目录
const tocArray = ref([]);
const makeToc = () => {
  nextTick(() => {
    //定义要解析的标签
    const tocTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
    //获取所有H标签
    const contentDom = document.querySelector("#detail");
    const childNodes = contentDom.childNodes;

    let index = 0;
    childNodes.forEach((item) => {
      let tagName = item.tagName;
      if (tagName == undefined || !tocTags.includes(tagName.toUpperCase())) {
        return true;
      }
      index++;
      let id = "toc" + index;
      item.setAttribute("id", id);
      tocArray.value.push({
        id: id,
        title: item.innerText, //拿到标签内的文本
        level: Number.parseInt(tagName.substring(1)), //区分出一级二级标题
        offsetTop: item.offsetTop, //标题距离顶部的距离
      });
    });
  });
};
const anchorId = ref(null);
const gotoAnchor = (domId) => {
  const dom = document.querySelector("#" + domId);
  dom.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
//监听滚动条 关联目录一起变化
const listenerScroll = () => {
  let currenScrollTop = getScrollTop();
  tocArray.value.some((item, index) => {
    if (
      (index < tocArray.value.length - 1 &&
        currenScrollTop >= tocArray.value[index].offsetTop &&
        currenScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index == tocArray.value.length - 1 &&
        currenScrollTop < tocArray.value[index].offsetTop)
    ) {
      anchorId.value = item.id;
      return true;
    }
  });
};
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", listenerScroll, false);
});
onUnmounted(() => {
  window.addEventListener("scroll", listenerScroll, false);
});

//根据后端接口判断是否关闭评论区
const showComment = ref(false);
//监听showComment
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen;
    }
  },
  { immediate: true, deep: true }
);
</script>


<style lang="scss" >
.article-detail-body {
  position: relative;

  .board-info {
    line-height: 30px;

    .icon-right {
      margin: 0px 10px;
    }
  }

  .detail-container {
    .article-detail {
      background: #fff;
      padding: 15px;

      .title {
        font-weight: bold;
      }

      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;

        .user-info-detail {
          margin-left: 10px;

          .nick-name {
            color: #4e5969;
            font-size: 15px;
          }

          .nick-name:hover {
            color: var(--link);
          }

          .time-info {
            margin-top: 5px;
            font-size: 13px;
            color: var(--text2);

            .iconfont {
              margin-left: 10px;
              color: #9f9f9f;
            }

            .iconfont::before {
              padding-right: 3px;
            }

            .btn-edit {
              color: var(--link);

              .iconfont {
                color: var(--link);
              }

              .icon-edit {
                font-size: 14px;
              }
            }
          }
        }
      }

      .detail {
        letter-spacing: 2px;
        line-height: 22px;

        a {
          text-decoration: none;
          color: var(--link);
        }

        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }

    .attachment-panel {
      background: #fff;
      margin-top: 10px;
      padding: 20px;

      .title {
        font-size: 18px;
      }

      .attachment-info {
        display: flex;
        align-items: center;
        color: #9f9f9f;
        margin-top: 10px;

        .item {
          margin-right: 10px;
        }

        .icon-zip {
          font-size: 20px;
          color: #6ca1f7;
        }

        .file-name {
          color: #6ca1f7;
        }

        .integral {
          color: red;
          padding: 0px 5px;
        }
      }
    }

    .comment-panel {
      background: #fff;
      margin-top: 10px;
      padding: 20px;
    }
  }
}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 190px;
  text-align: center;

  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }

  .quick-item {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 30px;
    cursor: pointer;

    .iconfont {
      font-size: 22px;
      color: var(--text2);
    }

    .have-like {
      color: var(--link);
    }

    .icon-good:hover {
      color: var(--link);
    }

    .icon-comment:hover {
      color: var(--link);
    }

    .icon-attachment:hover {
      color: var(--link);
    }
  }
}

.toc-panel {
  position: absolute;
  top: 35px;
  right: 0px;
  width: 285px;

  .top-container {
    width: 285px;
    position: fixed;
    background: #fff;

    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }

    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;

      .no-toc {
        text-align: center;
        color: #797979;
        font-size: 13px;
        line-height: 40px;
      }

      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        border-radius: 3px;
        font-size: 14px;
      }

      .toc-item:hover {
        background: #dedfe0;
      }

      .active {
        border-left: 2px solid #6ca1f7;
        border-radius: 0px 3px 3px 0px;
        background: #dedfe0;
      }
    }
  }

  .hot-recommend {
    position: fixed;
    width: 285px;
    background: #fff;
    border-radius: 5px;
  }
}
</style>
