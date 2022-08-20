<template>
  <div class="content">
    <!--      密钥-->
    <div v-show="showLoginInput" @keyup.enter="doConfigQuery">
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
          <a-space>
            <a-col>
              <a-dropdown-button type="primary"
                                 @click="doConfigQuery"
              >
                连接
                <template #overlay>
                  <a-menu>
                    <a-popconfirm v-for="(it,index) in historyServer" :key="index" cancel-text="删除" ok-text="切换"
                                  placement="top" @cancel="delServer(it.serverUrl)"
                                  @confirm="chanageServer(it)">
                      <template #title>
                        <p>{{ it.serverUrl }}</p>
                      </template>
                      <a-menu-item>
                        <a-icon type="user"/>
                        {{ it.serverUrl }}
                      </a-menu-item>
                    </a-popconfirm>
                  </a-menu>
                </template>
                <template v-show="historyServer && historyServer.length > 0" #icon>
                  <a-icon :spin="true" theme="twoTone" type="smile"/>
                </template>
              </a-dropdown-button>
            </a-col>
          </a-space>
        </a-row>
      </a-space>
    </div>
    <div v-show="!showLoginInput">
      <!--      <a-space>-->
        <a-button @click="showLoginInput=true">编辑连接</a-button>
      <!--      </a-space>-->
    </div>
    <div v-show="success&&!showLoginInput" class="descriptions">
      <a-result status="success" style="height: 30vh" sub-title="服务端连接成功,可以开始远程控制了!" title="连接成功">
      </a-result>
      <a-button type="primary" @click="showSimInfo=!showSimInfo">
        {{ (showSimInfo ? '隐藏' : '显示') + '卡槽' }}
      </a-button>
      <div v-show="showSimInfo">
        <a-descriptions bordered>
          <a-descriptions-item label="设备标签">
            {{ configQuery.extra_device_mark|defaultEmpty }}
          </a-descriptions-item>
          <a-descriptions-item v-if="configQuery.extra_sim1" label="SIM1">
            {{ configQuery.extra_sim1|defaultEmpty }}
          </a-descriptions-item>
          <a-descriptions-item v-if="configQuery.extra_sim2" label="SIM2">
            {{ configQuery.extra_sim2|defaultEmpty }}
          </a-descriptions-item>
          <a-descriptions-item label="版本号">
            {{ configQuery.version_name|defaultEmpty }}
          </a-descriptions-item>
          <a-descriptions-item label="版本码">
            {{ configQuery.version_code|defaultEmpty }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>


<script>
import * as tools from "@/util/tools";
import {CONFIG_QUERY, DEL_SERVER, HISTORY_SERVER, SECRET, SERVER_URL} from "@/store/storeKeys";
import {mapGetters} from "vuex";


export default {
  data() {
    return {
      showLoginInput: true,
      showSimInfo: false,
      audio: new Audio(require("@/assets/download-complete.wav")),
      // audio: new Audio(require("@/assets/0.mp3")),
      success: !!this.$store.getters[SERVER_URL],
      secret: this.$store.getters[SECRET],
      serverUrl: this.$store.getters[SERVER_URL],
      configQuery: {}
    }
  },
  filters: {
    defaultEmpty(val) {
      return val ? val : "";
    }
  },
  computed: {
    // 只要数据发生变化，就会触发该函数
    ...mapGetters({historyServer: HISTORY_SERVER})
  },
  created: function () {
    console.log("successVal", this.success)
    if (this.success) {
      this.doConfigQuery()
    }
  },
  methods: {
    doConfigQuery() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: "post",
        url: this.serverUrl + `/config/query`,
        data: {
          data: {},
          timestamp,
          sign: tools.sign(timestamp, this.secret),
        },
      }).then((res) => {
        this.emitInited(true)
        this.showLoginInput = false
        setTimeout(() => this.audio && this.audio.play(), 1)
        this.configQuery = res.data.data
        this.$store.dispatch(CONFIG_QUERY, res.data.data)
        this.$store.dispatch(HISTORY_SERVER, {[SERVER_URL]: this.serverUrl, [SECRET]: this.secret})
      }).catch((err) => {
        this.emitInited(false)
      });
    },
    emitInited(newVal) {
      this.success = newVal;
      this.$emit("inited", newVal)
    },
    chanageServer(serveConf) {
      console.log('chanageServer', serveConf)
      this.$store.dispatch(HISTORY_SERVER, serveConf)
      this.serverUrl = serveConf[SERVER_URL]
      this.secret = serveConf[SECRET]
    },
    delServer(url) {
      console.log('delServer', url)
      this.$store.dispatch(DEL_SERVER, url).then(() => {
        this.serverUrl = this.$store.getters[SERVER_URL]
        this.secret = this.$store.getters[SECRET]
      })
    }
  },
  watch: {
    secret: function (newVal) {
      this.emitInited(false)
    },
    serverUrl: function (newVal) {
      this.emitInited(false)
    },
    success: function (newVal) {
      console.log("success", newVal)
    }
  }
}
</script>
<style scoped type="less">

</style>
