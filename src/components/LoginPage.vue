<template>
  <div class="content">
    <!--      密钥-->
    <div v-show="showLoginInput">
      <img alt="logo" src="@/assets/logo.png">
      <a-space direction="vertical">
        <a-row>
          <a-col>
            服务端地址：
          </a-col>
          <a-col>
            <a-input v-model="serverUrl" allow-clear placeholder="请输入服务端地址" style="width: 250px;" type="text">
            </a-input>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            密钥:
          </a-col>
          <a-col>
            <a-input-password v-model="secret" allow-clear placeholder="请输入密钥" style="width: 250px;">
            </a-input-password>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-button type="primary" @click="configQuery" @keyup.enter="configQuery">连接</a-button>
          </a-col>
        </a-row>
      </a-space>
    </div>
    <div v-show="!showLoginInput">
      <a-space>
        <a-button @click="showLoginInput=true">编辑连接</a-button>
      </a-space>
    </div>
    <div v-show="success&&!showLoginInput" class="descriptions">
      <a-result status="success" sub-title="服务端连接成功,可以开始远程控制了!" title="连接成功">
      </a-result>
      <a-button @click="showSimInfo=!showSimInfo">{{ (showSimInfo ? '隐藏' : '显示') + '卡槽' }}</a-button>
      <div v-show="showSimInfo">
        <a-descriptions v-show="data.extra_sim1||data.extra_sim2" bordered title="">
          <a-descriptions-item label="设备标签">
            {{ data.extra_device_mark }}
          </a-descriptions-item>
          <a-descriptions-item v-if="data.extra_sim1" label="SIM1">
            {{ data.extra_sim1 }}
          </a-descriptions-item>
          <a-descriptions-item v-if="data.extra_sim1" label="SIM2">
            {{ data.extra_sim2 }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>


<script>
import * as tools from "@/util/tools";
import {CONFI_GQUERY, INITED} from "@/store/storeKeys";


export default {
  data() {
    return {
      showLoginInput: true,
      showSimInfo: false,
      // audio: new Audio(require("@/assets/download-complete.wav")),
      // audio: new Audio(require("@/assets/0.mp3")),
      secret: tools.secret(),
      serverUrl: tools.serverUrl(),
      success: tools.store(INITED),
      data: {}
    }
  },
  created: function () {
    if (this.success) {
      this.configQuery()
    }
  },
  methods: {
    configQuery() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: "post",
        url: this.serverUrl + `/config/query`,
        data: {
          data: {},
          timestamp: timestamp,
          sign: tools.sign(timestamp, this.secret),
        },
      }).then((res) => {
        this.success = true;
        this.showLoginInput = false
        setTimeout(() => this.audio && this.audio.play(), 1)
        this.data = res.data.data
        tools.store(CONFI_GQUERY, JSON.stringify(res.data.data))
        tools.serverUrl(this.serverUrl)
        tools.secret(this.secret)
      }).catch((err) => {
        this.success = '';
      });
    },
    storeInited(newVal) {
      this.success = newVal;
      this.$emit("inited", newVal)
      tools.store(INITED, newVal)
    }
  },
  computed: {
    // 只要data中的数据发生变化，就会触发该函数
    // ...mapGetters(['serverUrl', 'secret'])

  }
  ,
  watch: {
    secret: function (newVal) {
      this.storeInited('')
    }
    ,
    serverUrl: function (newVal) {
      this.storeInited('')
    }
    ,
    success: function (newVal) {
      this.storeInited(newVal)
    }
  }


}
</script>
<style scoped type="less">


</style>
