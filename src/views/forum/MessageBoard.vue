<template>
  <div>
    <el-card class="el-card-d" shadow="always">
      <div class="infinite-list-wrapper" style="overflow: auto">
        <el-timeline infinite-scroll-disabled="disabled">
          <div v-if="messageList.length > 0">
            <el-timeline-item
              v-for="(item, index) in messageList"
              :key="index"
              :timestamp="item.sendTime"
              placement="top"
            >
              <el-card class="el-card-m" style="height: 120px">
                <h4>{{ item.nickName }}：</h4>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.message }}</p>
              </el-card>
            </el-timeline-item>
          </div>
          <div v-else>
            <el-timeline-item placement="top">
              <el-card class="el-card-m" style="height: 120px">
                <h4>游客：</h4>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 说点什么吧😁</p>
              </el-card>
            </el-timeline-item>
          </div>
        </el-timeline>
      </div>
      <div class="el-card-messages">
        <div class="el-card-userinfo">
          <el-input v-model="nickName" placeholder="请输入昵称" />
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入留言"
            maxlength="200"
            v-model="message"
          ></el-input>
        </div>
          <el-button type="primary" round class="submit-message"  @click="sendMsg"
          >留言</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const messageList = ref([]);

const nickName = ref('');
const message = ref('');

const sendMsg = () => {
  const nickNameDomValue = nickName.value.trim();
  const messageDomValue = message.value.trim();
  if (nickNameDomValue === "") {
    proxy.Message.warning('请输入昵称')
    return;
  }
  if (messageDomValue === "") {
    proxy.Message.warning('请输入留言')
    return;
  }
  messageList.value.push({
    nickName: nickNameDomValue,
    message: messageDomValue,
    sendTime: new Date().toLocaleString(),
  });
  nickName.value = "";
  message.value = "";
};

const delMessage = (index) => {
  messageList.value.splice(index, 1);
};
</script>

<style lang="scss" >
.infinite-list-wrapper {
  width: 100%;
  height: 500px;
}
.el-card-messages{
  display: flex;
  .el-card-userinfo{
    width: 100%;
    height: 80px;
  }
  .submit-message {
    height: 100px;
    width: 30%;
    margin-top: 20px;
    background: rgb(235, 245, 247);
    color: cadetblue;
    letter-spacing: 20px;
    cursor: pointer;
  }
}

@media screen and (max-width: 3000px) and (min-width: 767px) {
  .el-card-d {
    float: left;
    margin-top: 20px;
    margin-left: 10%;
    width: 80%;
    height: 90%;
  }
}
/*
  屏幕小于768px的
  */
@media screen and (max-width: 768px) and (min-width: 100px) {
  .el-card-d {
    width: 100%;
    height: 100%;
  }
}
</style>
