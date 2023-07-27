<template>
  <div class="edit-post">
    <el-form :model="formData" 
    :rules="rules" ref="formDataRef" 
    label-width="60px" class="post-panel">
      <div class="post-editor">
        <el-card :body-style="{'padding': '5px'}">
          <template #header>
            <div class="post-editor-title">
              <span>正文</span>
              <div class="change-editor-type">
                <span class="iconfont icon-change" @click="changeEditor">
                  切换{{editorType==0? 'Markdown编辑器':'富文本编辑器'}}
                </span>
              </div>
            </div>
          </template>
          <el-form-item prop="content" label-width="0">
            <EditorHtml :height="htmlEditorHeight"
            v-if="editorType == 0"
            v-model="formData.content"
            ></EditorHtml>
            <EditorMarkdown :height="markdownHeight" 
            v-if="editorType == 1"
            v-model="formData.markdownContent"
            @htmlContent="setHtmlContent"
            ></EditorMarkdown>
          </el-form-item>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{'padding': '5px'}">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <!-- input输入 -->
            <el-form-item label="标题" prop="title">
              <el-input clearable 
              placeholder="提示信息" 
              v-model="formData.title"
              :maxlength="150">
              </el-input>
            </el-form-item>
            <el-form-item label="板块" prop="boardIds">
              <el-cascader
              placeholder="请选择板块"
              :options="boardList"
              :props="boardProps"
              clearable
              v-model="formData.boardIds"
              :style="{width: '100%'}"
              >
              </el-cascader>
            </el-form-item>

            <el-form-item label="封面" prop="cover">
              <CoverUpload v-model="formData.cover"></CoverUpload>
            </el-form-item>
            <!-- textarea输入框 -->
            <el-form-item label="摘要" prop="summary">
              <el-input
              clearable
              placeholder="请选择板块"
              type="textarea"
              :rows="5"
              :maxlength="300"
              resize="none"
              show-word-limit
              v-model="formData.summary"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="附件" prop="cover">
              <AttachmentSelector v-model="formData.attachment"></AttachmentSelector>
            </el-form-item>
            <!--input输入-->
            <el-form-item label="积分" prop="integral" v-if="formData.attachment">
              <el-input clearable placeholder="请输入积分" v-model="formData.integral"></el-input>
              <span class="tips">附件下载积分，0表示无需积分下载</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" 
              :style="{width: '100%'}" 
              @click="postHandler">保存</el-button>
            </el-form-item>
          </div>
          
        </el-card>
        
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { ref, reactive, getCurrentInstance, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router"
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const store = useStore();

// 计算编辑器高度 两者高度不一样
const markdownHeight = window.innerHeight -80 -60
const htmlEditorHeight = window.innerHeight -80 - 140

const api={
  loadBoard4Post: "/forum/loadBoard4Post",
  postArticle: "/forum/postArticle",
  articleDetail4Update: "/forum/articleDetail4Update",
  updateArticle: "/forum/updateArticle",
}
// 判断修改还是新增  监听 route
const articleId = ref(null)
const getArticleDetail = ()=>{
  nextTick( async()=>{
    formDataRef.value.resetFields()
    if (articleId.value) {
      //修改
      let result = await proxy.Request({
        url: api.articleDetail4Update,
        params:{
          articleId: articleId.value
        },
        showError: false,
        errorCallback:(response)=>{
          ElMessageBox.alert(response.info, '错误', {
            "show-close": false,
            callback: (action) => {
              router.go(-1)
            },
          })
        }
      })
      if(!result) return
      let  articleInfo  = result.data.forumArticle
      //设置编辑器
      editorType.value = articleInfo.editorType
      //设置板块信息
      articleInfo.boardIds = []
      articleInfo.boardIds.push(articleInfo.pBoardId)
      if (articleInfo.boardId != null && articleInfo.boardId != 0) {
        articleInfo.boardIds.push(articleInfo.boardId)
      }
      //设置封面信息
      if (articleInfo.cover) {
        articleInfo.cover = {imageUrl: articleInfo.cover} //CoverUpload.vue里通过路径取
      }
      //设置附件
      if(result.data.attachment){
        articleInfo.attachment = {
          name: result.data.attachment.fileName,
        }
        //积分设置
        articleInfo.integral = result.data.attachment.integral
      }
      formData.value = articleInfo
    }else{
      formData.value = {} //重置formData
      editorType.value = proxy.VueCookies.get("editorType") || 0
    }
  })
}
//设置markdown编辑器的富文本信息
const setHtmlContent = (htmlContent)=>{
  formData.value.content = htmlContent
}

watch(
  ()=>route,
  (newVal, oldVal)=>{
    if (newVal.path.indexOf("/editPost") != -1 || 
    newVal.path.indexOf("/newPost") != -1) {
      articleId.value = newVal.params.articleId
      getArticleDetail()
    }
  },
  {immediate: true, deep: true}
)

const formData = ref({})
const formDataRef = ref()
const rules = {
  title: [{ required: true, message: '请输入标题'}, ],
  boardIds: [{required: true, message: '请选择板块'}],
  content: [{required: true, message: '请输入正文'}],
  integral: [{required: true, message: '请输入下载所需积分'},
  {validator: proxy.Verify.number, message: '积分只能为数字'}],
}

//板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName'
}
const boardList = ref([])
const loadBoradList = async ()=>{
  let result = await proxy.Request({
    url: api.loadBoard4Post
  })
  if(!result) return
  boardList.value = result.data
}
loadBoradList()

//编辑器类型切换  0:富文本 1:markdown
const editorType = ref(null)

const changeEditor = ()=>{
  proxy.Confirm("切换编辑器会清空正在编辑的内容，确定要切换吗？", ()=>{
    editorType.value = editorType.value == 0? 1 : 0
    formData.value.content = " "
    formData.value.markdownContent = ""
    proxy.VueCookies.set("editorType", editorType.value, -1)
  })
}

//提交信息
const postHandler = ()=>{
  //校验
  formDataRef.value.validate(async (valid)=>{
    if (!valid) {
      return
    }
    let  params = {}
    Object.assign(params, formData.value) //先把params值做拷贝
    //设置板块ID
    if(params.boardIds.length == 1){
      params.pBoardId = params.boardIds[0]
    }
    else if(params.boardIds.length == 2){
      params.pBoardId = params.boardIds[0]
      params.boardId = params.boardIds[1]
    }
    delete params.boardIds
    //设置编辑器类型
    params.editorType = editorType.value
    //获取编辑框内容
    const contentText = params.content.replace(/<(?!img).*?>/g,"")
    if(contentText == ''){
      proxy.message.warning('正文不能为空')
      return
    }
    if(params.attachment!=null){
      params.attachmentType = 1
    }else{
      params.attachmentType = 0
    }
    //设置封面 后端接收文件类型
    if(!(params.cover instanceof File)){
      delete params.cover
    }
    //附件不是文件类型，值设置为空
    if(!(params.attachment instanceof File)){
      delete params.attachment
    }

    let result = await proxy.Request({
      url: params.articleId ? api.updateArticle : api.postArticle,
      params: params
    })
    if(!result) return
    proxy.Message.success("保存成功")
    //完成发布后跳转到详情页
    router.push(`/post/${result.data}`) //"data":"xxxxx" //result.data是文章ID
  })
}

</script>

<style lang="scss" >
.edit-post{
  .post-panel{
    display: flex;
    .el-card__header{
      padding: 10px;
    }
    .post-editor{
      flex: 1;
      .post-editor-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .change-editor-type{
          .icon-change{
            font-size: 14px;
            cursor: pointer;
            color: var(--link);
          }
        }
      }
    }
    .post-setting{
      margin-left: 10px;
      width: 450px;
      .setting-inner{
        max-height: calc(100vh - 120px);
        overflow: auto;
        .el-form-item{
          align-items: flex-start;
        }
      }
      .tips{
        color: #adacac;
        font-size: 13px;
      }
    }
  }
}

</style>
