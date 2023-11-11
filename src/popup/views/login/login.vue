<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {DARK_MASK_OPACITY, DARK_MASK_COLOR} from '@/common/js.common.js'

// const account = ref('')
// const password = ref('')

// // router钩子，返回路由器实例
// const router = useRouter()

// // 登陆
// const onLogin = () => {
//     router.push('/home')
// }

const darkMaskopacityValue = ref(DARK_MASK_OPACITY);
const isOpenDarkModel = ref(false);
const colorPickerValue = ref(DARK_MASK_COLOR);

let btn = document.getElementById('submit');

// 点击按钮
// btn.onclick = function (e) {
//   var name = document.getElementById('name').value;
//   var password = document.getElementById('password').value;
//   tabs(name, password);
// }

// 去链接,对应的tab标签页面
async function tabs(...arg) {
  const tabId = await getCurrentTabId();
  const connect = chrome.tabs.connect(tabId, { name: 'popup' }); // 和指定tabID建立链接,并设置信号名字
  // 发送信息
  connect.postMessage(arg);

  // 接受返回信息
  connect.onMessage.addListener(mess => {
    console.log(mess)
  })
};


// 获取当前 tab ID
function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      resolve(tabs.length ? tabs[0].id : null)
    });
  })
};

async function sliderChangeEvent(value) {
  console.log("sliderChangeEvent", value)

  const tabId = await getCurrentTabId();
  const connect = chrome.tabs.connect(tabId, { name: 'popup' }); // 和指定tabID建立链接,并设置信号名字
  // 发送信息
  connect.postMessage(value);
  
}

async function colorPickerChangeEvent (value) {
  console.log("sliderChangeEvent", value)

  const tabId = await getCurrentTabId();
  const connect = chrome.tabs.connect(tabId, { name: 'colorChange' }); // 和指定tabID建立链接,并设置信号名字
  // 发送信息
  connect.postMessage(value);
}

function getLocalStrorgeData () {
  let host_name = document.location.hostname;
  chrome.storage.local.get([host_name]).then((result)=>{
    console.log("result", result)
  }).catch((error)=>{
    console.log("error", error)
  })
}

async function exportDataEvent() {
  const tabId = await getCurrentTabId();
  const connect = chrome.tabs.connect(tabId, { name: 'exportDataEvent' }); // 和指定tabID建立链接,并设置信号名字
  // 发送信息
  connect.postMessage('exportDataEvent');
}


</script>

<template>
  <!-- <div class="P-login">
      <div class="ipt-con">
        <el-input v-model="account" placeholder="账号" />
      </div>
      <div class="ipt-con">
        <el-input
          v-model="password"
          type="password"
          placeholder="密码"
          show-password
        />
      </div>
      <div class="ipt-con">
          <el-button style="width: 100%" @click="onLogin">登录</el-button>
      </div>
    </div> -->
  <div class="P-login">
    <div class="login-container">
      <div class="demonstration-contaniner">
        <!-- <div class="demonstration-main"> -->
          <div class="switch_button general_module">
            <div>是否打开</div>
            <el-switch v-model="isOpenDarkModel" />
          </div>
          <div class="demonstration general_module">
            <div>透明度</div>
            <div class="slider-container">
              <el-slider v-model="darkMaskopacityValue" :min="0" :max="1" :step="0.05" @change="sliderChangeEvent">
              </el-slider>
            </div>
          </div>
          <div class="color_picker general_module">
            <div>颜色</div>
            <el-color-picker v-model="colorPickerValue" @change="colorPickerChangeEvent"/>
          </div>
        <!-- </div> -->
      </div>

      <!-- <div>
        <button @click="exportDataEvent">导出数据</button>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="stylus">
.P-login
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background-color: rgb(19, 19, 22)
    display: flex
    justify-content: center
    align-items:center
    .login-container
      display: flex
      flex-direction: row
      justify-content: space-around
      width: 90%
      margin-top: 1rem
      background-color: rgb(41, 42, 46)
      height: 90%
      margin: 0.2rem
      .demonstration-contaniner
        width: 100%
        margin: 1rem 0
        display:flex
        flex-direction: column
        align-items: center
      .general_module
        width: 80%
        display: flex
        flex-direction: row
        justify-content: space-between
        font-size: 1rem
        color: white
        text-align: center
        align-items:center
    .slider-container
      width : 50%
    .logo
        display: block
        margin: 50px auto 20px
    .ipt-con
        margin: 0 auto 20px
        width: 300px
        text-align: center
</style>