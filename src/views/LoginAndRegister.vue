<template>
  <div class="login-body">
    <el-button type="primary" class="back-index op-btn" @click="backToIndex()"
      ><span class="iconfont icon-login"></span
    ></el-button>
    <div class="login-form">
      <!-- <BackgroundParticles></BackgroundParticles> -->
      <div class="login-panel">
        <el-form :model="formData" :rules="rules" ref="formDataRef" class="login-register">
          <div class="login-title">CVWorld论坛</div>
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
            <el-input
              :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'"
              size="large"
              clearable
              placeholder="请输入密码"
              v-model="formData.password">
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('passwordEyeOpen')"
                  :class="[
                    'iconfont',
                    passwordEyeType.passwordEyeOpen ? 'icon-eye' : 'icon-close-eye',
                  ]"></span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 注册的时候显示-->
          <div v-if="opType == 0 || opType == 2">
            <el-form-item prop="emailCode">
              <div class="send-email-panel">
                <el-input size="large" placeholder="请输入邮箱验证码" v-model="formData.emailCode">
                  <template #prefix>
                    <span class="iconfont icon-checkcode"></span>
                  </template>
                </el-input>
                <el-button class="send-mail-btn" type="primary" size="large" @click="getEmailCode"
                  >获取邮箱验证码</el-button
                >
              </div>
              <el-popover placement="left" :width="450" trigger="click">
                <div>
                  <p>1、在垃圾箱中查找邮箱验证码</p>
                  <p>2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                  <p>3、将邮箱【154205993@qq.com】添加到白名单</p>
                  <a target="_blank" href="http://easybbs.wuhancoder.com/post/46lrsLUQjQhpZyP"
                    >不知道怎么设置？</a
                  >
                </div>
                <template #reference>
                  <span class="a-link" :style="{ 'font-size': '14px' }">未获取到验证码?</span>
                </template>
              </el-popover>
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item prop="nickName" v-if="opType == 0">
              <el-input
                maxLength="20"
                size="large"
                clearable
                placeholder="请输入昵称"
                v-model="formData.nickName">
                <template #prefix>
                  <span class="iconfont icon-account"></span>
                </template>
              </el-input>
            </el-form-item>
            <!-- 注册密码、找回密码 -->
            <el-form-item prop="RegisterPassword">
              <el-input
                :type="passwordEyeType.registerPasswordEyeOpen ? 'text' : 'password'"
                size="large"
                placeholder="请输入密码"
                v-model="formData.RegisterPassword">
                <template #prefix>
                  <span class="iconfont icon-password"></span>
                </template>
                <template #suffix>
                  <span
                    @click="eyeChange('registerPasswordEyeOpen')"
                    :class="[
                      'iconfont',
                      passwordEyeType.registerPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye',
                    ]"></span>
                </template>
              </el-input>
            </el-form-item>
            <!--确认重复密码-->
            <el-form-item prop="repassword">
              <el-input
                :type="passwordEyeType.reRegisterPasswordOpen ? 'text' : 'password'"
                size="large"
                placeholder="请再次输入密码"
                v-model="formData.repassword">
                <template #prefix>
                  <span class="iconfont icon-password"></span>
                </template>
                <template #suffix>
                  <span
                    @click="eyeChange('reRegisterPasswordOpen')"
                    :class="[
                      'iconfont',
                      passwordEyeType.reRegisterPasswordOpen ? 'icon-eye' : 'icon-close-eye',
                    ]"></span>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 验证码 -->
          <el-form-item prop="checkCode">
            <div class="check-code-panel">
              <el-input
                size="large"
                placeholder="请输入验证码"
                v-model="formData.checkCode"
                @keyup.enter="doSubmit">
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <img :src="checkCodeUrl" class="check-code" @click="changCheckCode(0)" />
            </div>
          </el-form-item>
          <!--登录-->
          <el-form-item v-if="opType == 1">
            <div class="rememberme-panel">
              <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
            </div>
            <div class="no-account">
              <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码?</a>
              <!-- <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">没有账号?</a> -->
            </div>
          </el-form-item>
          <!--找回密码-->
          <el-form-item v-if="opType == 2">
            <div class="no-account">
              <!-- <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登录?</a> -->
            </div>
          </el-form-item>
          <!--注册-->
          <el-form-item v-if="opType == 0">
            <div class="no-account">
              <!-- <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号?</a> -->
            </div>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button type="primary" class="op-btn" size="large" @click="doSubmit">
              <span v-if="opType == 0">注册</span>
              <span v-if="opType == 1">登录</span>
              <span v-if="opType == 2">重置密码</span>
            </el-button>
          </el-form-item>
          <div class="login-btn-qq" v-if="opType == 1">快捷登录<img src="" @click="qqLogin" /></div>
        </el-form>
      </div>
      <!-- 登进页文字排版 -->
      <div class="switch">
        <div class="switch-circle"></div>
        <div class="switch-circle switch-circle-t"></div>
        <div :class="['switch-container', opType == 1 ? '' : 'is-hidden']">
          <h2 class="switch-title title">Hello Friend!!</h2>
          <p class="switch-description description">去注册一个账号，来进入论坛世界吧！！！</p>
          <el-button class="switch-button button switch-btn" @click="showPanel(0)">注册</el-button>
        </div>

        <div :class="['switch-container', opType == 0 ? '' : 'is-hidden']">
          <h2 class="switch-title title">Register Now</h2>
          <p class="switch-description description">已有账号了？去登录账号来进入论坛世界吧！！！</p>
          <el-button class="switch-button button switch-btn" @click="showPanel(1)">登录</el-button>
        </div>

        <div :class="['switch-container ', opType == 2 ? '' : 'is-hidden']">
          <h2 class="switch-title title">Reset Password!!</h2>
          <p class="switch-description description">
            账号重置好了？去登录账号来进入论坛世界吧！！！
          </p>
          <el-button class="switch-button button switch-btn" @click="showPanel(1)">登录</el-button>
        </div>
      </div>
    </div>

    <!-- 发送邮箱验证码弹窗 -->
    <Dialog
      :show="dialogConfig4SendMailCode.show"
      :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfig4SendMailCode.show = false">
      <el-form
        :model="formData4SendMailCode"
        :rules="rules"
        ref="formData4SendMailCodeRef"
        label-width="80px"
        class="login-register"
        @submit.prevent>
        <el-form-item label="邮箱" prop="email">&nbsp;&nbsp;{{ formData.email }}</el-form-item>
        <!-- input输入 -->
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              placeholder="请输入验证码"
              v-model="formData4SendMailCode.checkCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl4SendMailCode" class="check-code" @click="changCheckCode(1)" />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import md5 from 'js-md5'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const store = useStore()

const api = {
  checkCode: '/api/checkCode',
  sendEmailCode: '/sendEmailCode',
  register: '/register',
  login: '/login',
  resetPwd: '/resetPwd',
}

//验证两次密码是否一致
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.RegisterPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

const formData = ref({})
const formDataRef = ref()
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { max: 150, message: '邮箱过长' },
    { validator: proxy.Verify.email, message: '请输入正确的邮箱' },
  ],
  password: [{ required: true, message: '请输入密码' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码' }],
  nickName: [{ required: true, message: '请输入昵称' }],
  RegisterPassword: [
    { required: true, message: '请输入密码' },
    { validator: proxy.Verify.password, message: '密码只能是8-18位数字，字母，特殊字符' },
  ],
  repassword: [
    { required: true, message: '请再次输入密码' },
    { validator: checkRePassword, message: '两次输入的密码不一致' },
  ],
  checkCode: [{ required: true, message: '请输入图片验证码' }],
}

//验证码
const checkCodeUrl = ref(api.checkCode)
const checkCodeUrl4SendMailCode = ref(api.checkCode)
const changCheckCode = (type) => {
  //登录时要使用，发送邮箱时也要使用，判断后不会同时改变验证码
  if (type == 0) {
    checkCodeUrl.value = api.checkCode + '?type=' + type + '&time' + new Date().getTime()
  } else {
    checkCodeUrl4SendMailCode.value =
      api.checkCode + '?type=' + type + '&time' + new Date().getTime()
  }
}

//0:注册  1:登录  2:找回密码
const opType = ref(1)
const showPanel = (type) => {
  opType.value = type
  resetForm()
}
defineExpose({ showPanel })

onMounted(() => {
  showPanel(1)
})

//发送验证码弹窗
const formData4SendMailCode = ref({})
const formData4SendMailCodeRef = ref()
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: '发送邮箱验证码',
  buttons: [
    {
      type: 'primary',
      text: '发送验证码',
      click: () => {
        sendEmailCode()
      },
    },
  ],
})
// //发送邮箱验证码弹窗
const getEmailCode = () => {
  //检测注册时是否输入邮箱
  formDataRef.value.validateField('email', (valid) => {
    if (!valid) {
      return
    }
    dialogConfig4SendMailCode.show = true
  })
  nextTick(() => {
    changCheckCode(1)
    formData4SendMailCodeRef.value?.resetFields()
    formData4SendMailCode.value = {
      email: formData.value.email,
    }
  })
}
//发送邮件验证码
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    const params = Object.assign({}, formData4SendMailCode.value)
    params.type = opType.value == 0 ? 0 : 1
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      errorCallback: () => {
        changCheckCode(1)
      },
    })
    if (!result) {
      return
    }
    //验证码发送成功
    proxy.Message.success('验证码已发送，请注意查收')
    dialogConfig4SendMailCode.show = false
  })
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

//重置表单
const resetForm = () => {
  nextTick(() => {
    changCheckCode(0)
    formDataRef.value.resetFields()
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
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    //注册  找回密码
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.RegisterPassword
      delete params.RegisterPassword
      delete params.repassword
    }
    //登录
    if (opType.value == 1) {
      let cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password

      if (params.password !== cookiePassword) {
        params.password = md5(params.password)
      }
    }
    let url = null
    if (opType.value == 0) {
      url = api.register
    } else if (opType.value == 1) {
      url = api.login
    } else if (opType.value == 2) {
      url = api.resetPwd
    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changCheckCode(0)
      },
    })
    if (!result) {
      return
    }
    //注册完成返回
    if (opType.value == 0) {
      proxy.Message.success('注册账户成功, 请登录')
      showPanel(1)
    } else if (opType.value == 1) {
      //登录
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        }
        proxy.VueCookies.set('loginInfo', loginInfo, '7days')
      } else {
        proxy.VueCookies.remove('loginInfo')
      }
      proxy.Message.success('登录成功')
      //存储cookie
      // proxy.VueCookies.set("userInfo", result.data, 0)
      store.commit('updateLoginUserInfo', result.data)
      router.push('/')
    } else if (opType.value == 2) {
      //重置密码后转到登录页
      proxy.Message.success('重置密码成功,请登录')
      showPanel(1)
    }
  })
}

//QQ登录方法
const qqLogin = async () => {
  let result = await proxy.Request({
    url: api,
    params: {
      callbackUrl: route.query.redirectUrl || '',
    },
  })
  if (!result) {
    return
  }
  proxy.VueCookies.remove('userInfo')
  document.location.href = result.data
}

//登录页动画效果方法

//登录页返回首页按钮方法
const backToIndex = () => {
  router.push('/')
}
</script>

<style lang="scss">
.login-body {
  position: absolute;
  width: 100%;
  height: calc(100vh);
  background-color: #fff;
  // background-color: #ecf0f3;
  display: flex;
  justify-content: center;
  align-items: center;
  .back-index {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .login-form {
    display: flex;
    height: 600px;
    background-color: #ecf0f3;
    box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
    border-radius: 12px;

    .login-panel {
      position: relative;
      right: 0;
      width: 430px;

      // margin-top: calc((100vh - 500px) / 2);
      .el-input__wrapper {
        width: 350px;
        height: 40px;
        margin: 4px 0;
        padding-left: 25px;
        font-size: 13px;
        letter-spacing: 0.15px;
        border: none;
        outline: none;
        background-color: #ecf0f3;
        transition: 0.25s ease;
        border-radius: 8px;
        box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
      }

      .el-input__wrapper:focus {
        box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
      }

      .login-register {
        right: 50px;
        padding: 25px;

        .login-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .send-email-panel {
          display: flex;
          width: 100%;
          justify-content: space-between;

          .el-input__wrapper {
            width: 100%;
          }

          .send-mail-btn {
            margin-left: 5px;
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
    }

    .check-code-panel {
      // width: 100%;
      display: flex;

      .el-input__wrapper {
        width: 100%;
      }

      .check-code {
        margin-left: 5px;
        cursor: pointer;
      }
    }

    .login-btn-qq {
      margin-top: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        cursor: pointer;
      }
    }

    .switch {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      top: 0px;
      left: 0px;
      z-index: 200;
      width: 400px;
      // height: calc(100vh);
      padding: 50px;
      transition: 1.25s;
      background-color: #ecf0f3;
      box-shadow: -4px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
      overflow: hidden;
      border-radius: 12px;

      .switch-circle {
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background-color: #ecf0f3;
        box-shadow: inset 8px 8px 12px #b8bec7, -8px -8px 12px #fff;
        bottom: -60%;
        left: -60%;
        transition: 1.25s;
      }

      .switch-circle-t {
        top: -30%;
        left: 60%;
        width: 300px;
        height: 300px;
      }

      .switch-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        width: 400px;
        padding: 50px 55px;
        transition: 1.25s;

        .switch-button {
          width: 180px;
          height: 50px;
          border-radius: 25px;
          margin-top: 50px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1.15px;
          background-color: #409eff;
          color: #f9f9f9;
          box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
          border: none;
          outline: none;
          cursor: pointer;
        }

        .switch-button:active,
        .switch-button:focus {
          box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
          transform: scale(0.97);
          transition: 0.25s;
        }
      }
      .is-hidden {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        transition: 1.25s;
      }
      //向右移动动画
      .is-txr {
        left: calc(100% - 430px);
        transition: 1.25s;
        transform-origin: left;
        animation: changeform 1.25s;
      }
      //向左移动动画
      .is-txl {
        left: 0;
        transition: 1.25s;
        transform-origin: right;
        animation: changeform 1.25s;
      }
      .is-z {
        z-index: 200;
        transition: 1.25s;
      }
    }
    @keyframes changeform {
      0%,
      10%,
      100% {
        width: 400px;
      }
      30%,
      50% {
        width: 500px;
      }
    }
  }

  .check-code-panel {
    // width: 100%;
    display: flex;
    .el-input__wrapper {
      width: 100%;
      height: 40px;
      margin: 4px 0;
      padding-left: 15px;
      font-size: 13px;
      letter-spacing: 0.15px;
      border: none;
      outline: none;
      background-color: #ecf0f3;
      transition: 0.25s ease;
      border-radius: 8px;
      box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
    }
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
</style>
