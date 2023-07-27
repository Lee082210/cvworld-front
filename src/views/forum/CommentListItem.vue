<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="commnet-info">
      <div class="nick-name">
        <span class="name" @click="gotoUcenter(commentData.userId)">{{ commentData.nickName }}</span>
        <span class="tag-author" v-if="commentData.userId == articleUserId">作者</span>
      </div>
      <div class="comment-content">
        <div>
          <span v-if="commentData.topType == 1" class="tag tag-topping">置顶</span>
          <span class="tag no-audit" v-if="commentData.status==0">待审核</span>
          <span v-html="commentData.content"></span>
        </div>
        <CommentImage 
          :style="{'margin-top': '10px'}"
          v-if="commentData.imgPath" 
          :src="proxy.globalInfo.imageUrl + commentData.imgPath.replace('.', '_.')"
          :imgList="[proxy.globalInfo.imageUrl + commentData.imgPath]">
        </CommentImage>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span class="address">&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span>
        </div>
        <div :class="['iconfont icon-good', commentData.likeType==1? 'active': '']" 
        @click="doLike(commentData)">
          {{ commentData.goodCount > 0 ? commentData.goodCount : '点赞' }}
        </div>
        <div class="iconfont icon-comment" @click="showReplyPanel(commentData,0)">回复</div>
        <el-dropdown v-if="articleUserId == currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="opTop(commentData)">
                {{ commentData.topType == 0 ? '设为置顶' : '取消置顶' }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 二级回复评论展示 -->
      <div class="comment-sub-list" v-if="commentData.children">
        <div class="comment-sub-item" v-for="sub in commentData.children">
          <Avatar :userId="sub.userId" :width="30"></Avatar>
          <div class="comment-sub-info">
            <div class="nick-name">
              <span class="name" @click="gotoUcenter(sub.userId)">{{ sub.nickName }}</span>
              <span class="tag-author" v-if="sub.userId == articleUserId">作者</span>
              <span class="reply-name">回复</span>
              <span @click="gotoUcenter(sub.replyUserId)" class="1-link">
                @{{ sub.replyNickName }}</span>
              <span>：</span>
              <span class="sub-content" v-html="sub.content"></span>
            </div>
            <div class="op-panel">
              <div class="time">
                <span>{{ sub.postTime }}</span>
                <span class="address">&nbsp;·&nbsp;{{ sub.userIpAddress }}</span>
              </div>
              <div :class="['iconfont icon-good', sub.likeType==1? 'active': '']" 
              @click="doLike(sub)">
                {{ sub.goodCount > 0 ? sub.goodCount : '点赞' }}
              </div>
              <div class="iconfont icon-comment" @click="showReplyPanel(sub,1)">回复</div>  
            </div>
          </div>
        </div>
      </div>
      <!-- 显示评论 -->
      <div class="reply-info" v-if="commentData.showReply">
        <CommentPost 
        :articleId="articleId" 
        :avatarWidth="30" 
        :userId="currentUserId" 
        :placeholderInfo="placeholderInfo"
        :showInsertImg="false"
        :pCommentId="pCommentId" 
        :replyUserId="replyUserId" 
        @postCommentFinish="postCommentFinish">
        </CommentPost>
      </div>
    </div>
  </div>
</template>

<script setup>
import CommentPost from './CommentPost.vue';
import CommentImage from './CommentImage.vue';
import {ref, reactive, getCurrentInstance} from "vue";
import {useRouter, useRoute} from "vue-router"
import { useStore } from 'vuex'
const {proxy} = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const store = useStore();

const api={
  doLike: "/comment/doLike",
  changeTopType: "/comment/changeTopType",
}
const props = defineProps({
  articleId: {
    type: String
  },
  commentData: {
    type: Object
  },
  articleId: {
    type: String
  },
  articleUserId: {
    type: String
  },
  currentUserId: {
    type: String
  }
})

//显示评论框
const pCommentId = ref(0)
const replyUserId = ref(0)
const placeholderInfo = ref(null)
const emit = defineEmits(["hiddenAllReply", "reloadData"])

const showReplyPanel = (curData, type) => {
  //先把curData状态 缓存起来
  const havaShow = props.commentData.showReply == undefined ? false : props.commentData.showReply
  //将方法暴露出去
  emit('hiddenAllReply')
  if(type == 0){
    //一级评论回复
    props.commentData.showReply = !havaShow
  }else{
    //二级评论回复
    props.commentData.showReply = true
  }
  
  //点击回复后，展开回复框
  pCommentId.value = props.commentData.commentId
  replyUserId.value = curData.userId
  placeholderInfo.value = '回复 @'+ curData.nickName
}

//获取数据后，隐藏所有数据框
//评论发布完成，回调并清空内容
const postCommentFinish = (resultData) => {
  props.commentData.children = resultData
  placeholderInfo.value = undefined
}

const gotoUcenter = (userId) => {
    router.push(`/user/${userId}`)
}

//点赞事件
const doLike = async (data)=>{
  let result = await proxy.Request({
    url: api.doLike,
    showLoading: false,   //取消点赞loading效果
    params:{
      commentId: data.commentId
    }
  })
  if(!result) return
  data.goodCount = result.data.goodCount
  data.likeType = result.data.likeType
}

//置顶方法
const opTop = async (data) => {
    let result = await proxy.Request({
      url: api.changeTopType,
      params: {
        commentId: data.commentId,
        topType: data.topType == 1 ? 0 : 1
      }
    })
    if (!result) {
      return;
    }
    emit("reloadData")
}

</script>

<style lang="scss" >
.comment-item {
  display: flex;
  padding-top: 15px;

  .commnet-info {
    flex: 1;
    margin-left: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;

    .nick-name {
      .name {
        font-size: 14px;
        color: var(--text2);
        margin-right: 10px;
        cursor: pointer;
      }

      .tag-author {
        background: var(--pink);
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        padding: 0px 3px;
      }
    }
    .comment-content {
      margin-top: 5px;
      font-size: 15px;
      line-height: 22px;
      .tag{
        font-weight: normal;
        font-size: 12px;
        border-radius: 5px;
        padding: 0px 5px;
        margin-right: 10px;
      }
      .tag-topping{
        border: 1px solid var(--pink);
        color: var(--pink);
      }
      .no-audit{
        color: var(--text2);
        border: 1px solid var(--text2);
      }
    }
    .op-panel {
      display: flex;
      align-items: center;
      margin-top: 5px;
      font-size: 13px;
      color: var(--text2);

      .time {
        margin-right: 20px;
      }
      .iconfont {
        margin-right: 15px;
        font-size: 14px;
        color: var(--icon);
        cursor: pointer;
      }
      .iconfont::before {
        margin-right: 3px;
      }
      .active{
        color: var(--link);

      }
    }

    .comment-sub-list {
      margin-top: 10px;

      .comment-sub-item {
        display: flex;
        margin: 5px 0px;
        font-size: 14px;

        .comment-sub-info {
          margin-left: 5px;

          .nick-name {
            .reply-name {
              margin: 0px 5px;
            }

            .sub-content {
              font-size: 15px;
            }
          }
        }

      }
    }

    .reply-info {
      margin-top: 15px;
    }
  }
}</style>
