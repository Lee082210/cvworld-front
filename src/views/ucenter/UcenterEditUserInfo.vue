<template>
  <div>
    <Dialog 
    :show="dialogConfig.show" 
    :title="dialogConfig.title" 
    :buttons="dialogConfig.buttons" 
    width="500px"
    :showCancel="false" 
    @close="dialogConfig.show = false">
      <el-form :model="formData" ref="formDataRef" label-width="60px">
        <!-- input输入 -->
        <el-form-item label="昵称" prop="nickName">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <CoverUpload :imageUrlPrefix="proxy.globalInfo.avatarUrl" v-model="formData.avatar"></CoverUpload>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- textarea输入框 -->
        <el-form-item label="简介" prop="personDescription">
              <el-input
              clearable
              placeholder="请输入简介"
              type="textarea"
              :rows="5"
              :maxlength="200"
              resize="none"
              show-word-limit
              v-model="formData.personDescription"
              >
              </el-input>
            </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>



<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router"
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  updateUserInfo: "/ucenter/updateUserInfo",  //修改个人信息
}

const dialogConfig = reactive({
  show: false,
  title: '编辑个人信息',
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        updateUserInfoHandler()
      }
    }
  ]
})

const formData = ref({})
const formDataRef = ref()

//校验
const emit = defineEmits(["resetUserInfo"])
const updateUserInfoHandler = () =>{
  formDataRef.value.validate(async (valid)=>{
    if(!valid) return
    let params = {}
    params = Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: api.updateUserInfo,
      params: params
    })
    if(!result) return
    dialogConfig.show = false
    if(params.avatar instanceof File){
      router.go(0)    //用户更换了头像，刷新页面
    }else{
      emit("resetUserInfo", params)
    }

  })
}
// 父组件控制显示与隐藏
const showEditUserInfoDialog = (userInfo)=>{
  dialogConfig.show = true
  nextTick(()=>{
    formDataRef.value.resetFields()
    const dataInfo = JSON.parse(JSON.stringify(userInfo))
    dataInfo.avatar = {
      imageUrl: dataInfo.userId,
    }
    formData.value = dataInfo
  })
}

defineExpose({showEditUserInfoDialog})

</script>

<style lang="scss" >

</style>
