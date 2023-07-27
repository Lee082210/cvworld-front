<template>
  <div>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="400px"
      :showCancel="false" @close="closeDialog">
      <el-form :model="formData" :rules="rules" ref="formDataRef" class="login-register">
        <!-- 账号邮箱或手机登录 -->
        <el-form-item prop="email">
          <el-input size="large" clearable placeholder="请输入邮箱" v-model="formData.email">
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'" size="large" clearable
            placeholder="请输入密码" v-model="formData.password">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            <template #suffix>
              <span @click="eyeChange('passwordEyeOpen')"
                :class="['iconfont', passwordEyeType.passwordEyeOpen ? 'icon-eye' : 'icon-close-eye']"></span>
            </template>
          </el-input>
        </el-form-item>
        <div v-if="opType == 0 || opType == 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input size="large"  placeholder="请输入邮箱验证码" v-model="formData.emailCode">
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button class="send-email-btn" type="primary" size="large"
              @click="getEmailCode">获取验证码</el-button>
            </div>
            <el-popover placement="left" :width="450" trigger="click">
              <div>
                <p>1、在垃圾箱中查找邮箱验证码</p>
                <p>2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                <p>3、将邮箱【154205993@qq.com】添加到白名单</p>
                <a target="_blank" href="http://easybbs.wuhancoder.com/post/46lrsLUQjQhpZyP">不知道怎么设置？</a>
              </div>
              <template #reference>
                <span class="a-link" :style="{ 'font-size': '14px' }">未获取到验证码?</span>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="nickName" v-if="opType == 0">
            <el-input maxLength="20" size="large" clearable placeholder="请输入昵称" v-model="formData.nickName">
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="RegisterPassword">
            <el-input :type="passwordEyeType.registerPasswordEyeOpen ? 'text' : 'password'" size="large"
              placeholder="请输入密码" v-model="formData.RegisterPassword">
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span @click="eyeChange('registerPasswordEyeOpen')"
                  :class="['iconfont', passwordEyeType.registerPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye']"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input :type="passwordEyeType.reRegisterPasswordOpen ? 'text' : 'password'" size="large"
              placeholder="请再次输入密码" v-model="formData.repassword">
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span @click="eyeChange('reRegisterPasswordOpen')"
                  :class="['iconfont', passwordEyeType.reRegisterPasswordOpen ? 'icon-eye' : 'icon-close-eye']"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 验证码 -->
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input size="large" placeholder="请输入验证码" v-model="formData.checkCode" @keyup.enter="doSubmit">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl" class="check-code" @click="changCheckCode(0)">
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 1">
          <div class="rememberme-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码?</a>
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">没有账号?</a>
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 0">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号?</a>
        </el-form-item>
        <el-form-item v-if="opType == 2">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登录?</a>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="op-btn" @click="doSubmit">
            <span v-if="opType == 0">注册</span>
            <span v-if="opType == 1">登录</span>
            <span v-if="opType == 2">重置密码</span>
          </el-button>
          
        </el-form-item>
      </el-form>
    </Dialog>

    <!-- 发送邮箱验证码弹窗 -->
    <Dialog
    :show="dialogConfig4SendMailCode.show"
    :title="dialogConfig4SendMailCode.title"
    :buttons="dialogConfig4SendMailCode.buttons"
    width="500px"
    :showCancel="false"
    @close="dialogConfig4SendMailCode.show = false"
    >
      <el-form
      :model="formData4SendMailCode"
      :rules="rules"
      ref="formData4SendMailCodeRef"
      label-width="80px"
      class="login-register"
      >
      <el-form-item label="邮箱" prop="checkCode">&nbsp;&nbsp;{{ formData.email }}</el-form-item>
      <!-- input输入 -->
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input size="large"  placeholder="请输入验证码" v-model="formData4SendMailCode.checkCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl4SendMailCode" class="check-code" @click="changCheckCode(1)">
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router"
import { useStore } from 'vuex'
import md5 from 'js-md5'
const { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const store = useStore()

const api = {
  checkCode: '/api/checkCode',
  sendEmailCode: '/sendEmailCode',
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd",
  
}
//发送验证码弹窗
const formData4SendMailCode = ref({})
const formData4SendMailCodeRef = ref()
const dialogConfig4SendMailCode = reactive({
  show: false,
  title:'发送邮箱验证码',
  buttons:[{
    type: 'primary',
    text: '发送验证码',
    click: ()=>{
      sendEmailCode()
    }
  }]
})
const getEmailCode = ()=>{
  //检测注册时是否输入邮箱
  formDataRef.value.validateField('email', (valid)=>{
    if(!valid){
      return;
    }
    dialogConfig4SendMailCode.show = true
  })
  nextTick(()=>{
    changCheckCode(1)
    formData4SendMailCodeRef.value?.resetFields()
    formData4SendMailCode.value = {
      email: formData.value.email
    }
  })
}
//发送邮件验证码
const sendEmailCode = ()=>{
  formData4SendMailCodeRef.value.validate(async (valid)=>{
    if(!valid){
      return;
    }
    const params = Object.assign({}, formData4SendMailCode.value)
    params.type = opType.value ==0 ? 0 : 1;
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      errorCallback: ()=>{
        changCheckCode(1);
      }
    })
    if (!result) {
      return;
    }
    //验证码发送成功
    proxy.Message.success("验证码已发送，请注意查收")
    dialogConfig4SendMailCode.show = false
  })
}


//验证码
const checkCodeUrl = ref(api.checkCode)
const checkCodeUrl4SendMailCode = ref(api.checkCode)
const changCheckCode = (type) => {
  if (type==0) {
    checkCodeUrl.value = api.checkCode + "?type=" + type + "&time" + new Date().getTime();
  }else{
    checkCodeUrl4SendMailCode.value = api.checkCode + "?type=" + type + "&time" + new Date().getTime();
  }
  
}
//密码显示隐藏操作
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  registerPasswordEyeOpen: false,
  reRegisterPasswordOpen: false,
})
const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type]
}

//发送邮箱验证码弹窗


//dialogConfig相应配置
const dialogConfig = reactive({
  show: false,
  title: '标题',

})
//验证两次密码是否一致
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.RegisterPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

//0:注册  1:登录
const opType = ref()
const showPanel = (type) => {
  opType.value = type
  resetForm();
}
defineExpose({ showPanel })

const formData = ref({})
const formDataRef = ref()
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { max: 150, message: '邮箱过长' },
    { validator: proxy.Verify.email, message: '请输入正确的邮箱' }
  ],
  password: [{ required: true, message: '请输入密码' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码' }],
  nickName: [{ required: true, message: '请输入昵称' }],
  RegisterPassword: [
    { required: true, message: '请输入密码' },
    { validator: proxy.Verify.password, message: '密码只能是8-18位数字，字母，特殊字符' }],
  repassword: [{ required: true, message: "请再次输入密码" },
  { validator: checkRePassword, message: "两次输入的密码不一致" }
  ],
  checkCode: [{ required: true, message: '请输入图片验证码' }]

}

//重置表单
const resetForm = () => {
  dialogConfig.show = true
  if (opType.value == 0) {
    dialogConfig.title = '注册'
  } else if (opType.value == 1) {
    dialogConfig.title = '登录'
  } else if (opType.value == 2) {
    dialogConfig.title = '重置密码'
  }
  nextTick(() => {
    changCheckCode(0)
    formDataRef.value.resetFields();
    formData.value = {}

    //登录的重置，从cookie中拿到上次的信息  
    if (opType.value == 1) {
      const cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo
      }
    }
  })
  
}

//登录、注册、重置密码、提交表单
const doSubmit = ()=>{
  formDataRef.value.validate(async (valid)=>{
    if (!valid) {
      return;
    }
    let params = {}
    Object.assign(params, formData.value)
    //注册
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.RegisterPassword
      delete params.RegisterPassword
      delete params.repassword
    }
    if (opType.value == 1) {
      let cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      let cookiePassword = cookieLoginInfo==null? null : cookieLoginInfo.password

      if (params.password !== cookiePassword) {
        params.password = md5(params.password)
      }
    }
    let url = null
    if (opType.value == 0) {
      url = api.register
    }else if(opType.value == 1){
      url = api.login
    }else if(opType.value ==2){
      url = api.resetPwd
    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback:()=>{
        changCheckCode(0)
      }
    })
    console.log(result);
    if (!result) {
      console.log(result);
      console.log('这里失败了');
      return
    }
    //注册完成返回
    if(opType.value == 0){
      proxy.Message.success('注册账户成功, 请登录')
      showPanel(1)
    }else if(opType.value == 1){
      //登录
      if(params.rememberMe){
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe
        }
        proxy.VueCookies.set('loginInfo', loginInfo, '7days')
      }else{
        proxy.VueCookies.remove('loginInfo')
      }
      dialogConfig.show = false
      proxy.Message.success('登录成功')
      store.commit('updateLoginUserInfo', result.data)
    }else if(opType.value ==2){
      //重置密码后转到登录页
      proxy.Message.success('重置密码成功,请登录')
      showPanel(1)
    }
  })
}

const closeDialog = ()=>{
  dialogConfig.show = false
  store.commit("showLogin", false)
}
</script>

<style lang="scss" >
.login-register {
  .send-email-panel {
    display: flex;
    justify-content: space-between;

    .send-email-btn {
      margin-left: 10px;
    }
  }

  .check-code-panel {
    display: flex;

    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .rememberme-panel {
    width: 100%;
  }

  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .op-btn {
    width: 100%;
  }
}
</style>
