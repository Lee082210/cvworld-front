<template>
  <div class="container-body search-body" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
    <div class="search-panel" :style="{ 'padding-top': startSearch + 'px' }">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <!-- input输入 -->
        <el-form-item>
          <el-input size="large" 
          clearable 
          placeholder="请输入要查找的关键词(至少三个字)" 
          v-model="formData.keyword" 
          @keyup.enter.native="search"
          @focus="startSearchHandler"
          @blur="endSearchHandler"
          @change="changeInput"
          >
            <template #suffix>
              <span class="iconfont icon-search" @click="search" @blur="formData.keyword = $event.target.value.trim()">
              </span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 显示搜索出来的内容 -->
    <div class="article-list">
      <DataList :loading="loading" :dataSource="articleListInfo" @loadData="search" noDataMsg="没有搜索到你想要的关键词">
        <template #default="{ data }">
          <ArticleListItem 
          :data="data" 
          :showComment="showComment"
          :htmlTitle="true"
          >
          </ArticleListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { ref, reactive, getCurrentInstance,watch } from "vue";
import { useRouter, useRoute } from "vue-router"
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const store = useStore();

//从后端取得数据
const api = {
  loadArticle: '/forum/search',
}

//开始搜索框
const startSearch = ref(false)
const startSearchHandler = () => {
  startSearch.value = true
}
const endSearchHandler = ()=>{
  startSearch.value = false
}

const formData = ref({})
const formDataRef = ref()
const rules = {
  keyword: [
    { required: true, message: '请输入关键字' },
    { min: 3, message: '关键字至少3个字' }
  ]
}

const loading = ref(false)
const articleListInfo = ref({})
const search = async () => {
  loading.value = true
  let params = {
    pageNo: articleListInfo.value.pageNo,
    keyword: formData.value.keyword
  }
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false
  })
  loading.value = false
  if (!result) {
    return;
  }
  // 关键字样式
  let list = result.data.list
  list.forEach((element) => {
    element.title = element.title.replace(
      params.keyword,
      "<span style='color:red'>" + params.keyword + "</span>"
    )
  })
  articleListInfo.value = result.data
};

const showComment = ref(false)
watch(() =>store.state.sysSetting, (newVal, oldVal) => {
    if(newVal){
        showComment.value = newVal.commentOpen
    }
}, { immediate: true, deep: true });

const changeInput = ()=>{
    if(formData.value.keyword==""){
        articleListInfo.value = {}
    }
}

</script>

<style lang="scss" >
.search-body {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 210px);

  .search-panel {
    display: flex;
    justify-content: center;

    .el-input {
      width: 700px;
    }
  }
}
</style>

