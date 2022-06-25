<template>
  <div class="content0">
    <!--      密钥-->
    <!--    <a-space direction="vertical">-->
    <a-space direction="vertical" >
      <a-row>
        <a-col :span="8">
          服务端地址:
        </a-col>
        <a-col :span="16">
          <a-input
              v-model="serverUrl"
              placeholder="请输入服务端地址"
              style="width: 250px;"
              type="text"
              allow-clear>
          </a-input>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          密钥:
        </a-col>
        <a-col :span="16">
          <a-input-password
              v-model="secret"
              placeholder="请输入密钥"
              allow-clear
              style="width: 250px;"
          >
          </a-input-password>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="24">
          <a-button @click="send" @keyup.enter="send" type="primary">测试连接</a-button>
        </a-col>
      </a-row>
    </a-space>
    <div class="descriptions" v-show="success">
      <a-result
          status="success"
          title="连接成功"
          sub-title="服务端连接成功,可以开始远程控制了!"
      >

      </a-result>
      <a-descriptions title="设备信息" bordered>
        <a-descriptions-item label="剩余电量">
          {{ data.level }}
        </a-descriptions-item>
        <a-descriptions-item label="充满电量">
          {{ data.scale }}
        </a-descriptions-item>
        <a-descriptions-item label="当前电压">
          {{ data.voltage }}
        </a-descriptions-item>
        <a-descriptions-item label="当前温度">
          {{ data.temperature }}
        </a-descriptions-item>
        <a-descriptions-item label="电池状态">
          {{ data.status }}
        </a-descriptions-item>
        <a-descriptions-item label="健康度">
          {{ data.health }}
        </a-descriptions-item>
        <a-descriptions-item label="充电器">
          {{ data.plugged }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <!--    </a-space>-->
  </div>
</template>


<script>
import Util from "@/util/SmsForwardUtil";
import Vue from "vue";

export default {
  data() {
    return {
      secret: Util.secret(), serverUrl: Util.serverUrl(),
      success: '',
      data: {
        "level": "",
        "scale": "",
        "voltage": "",
        "temperature": "",
        "status": "",
        "health": "",
        "plugged": ""
      }
    }
  },
  created: function () {
  },
  methods: {
    send() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: 'post',
        url: this.serverUrl + `/battery/query`,
        data: {
          "data": {},
          "timestamp": timestamp,
          "sign": Util.sisgn(timestamp, this.secret)
        }
      }).then(res => {
        if (res.data.code == 200) {
          Vue.prototype.$message.success(res.data.msg)
          this.data = res.data.data;
          this.success = true;
        } else {
          this.success = false;
          Vue.prototype.$message.error('请求异常:' + res.data.msg)
        }
      }).catch(err => {
        Vue.prototype.$message.error('请求异常:' + err.message)
        this.success = false;
      })
    }
  },
  computed: {
    // 只要data中的数据发生变化，就会触发该函数
    // ...mapGetters(['serverUrl', 'secret'])

  }
  ,
  watch: {
    secret: function (newVal) {
      this.success = false
      Util.secret(newVal)
    },
    serverUrl: function (newVal) {
      this.success = false
      Util.serverUrl(newVal)
    },
    success: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("inited", newVal)
      }
    }
  }


}
</script>
<style>
.descriptions {
  align-content: center;
  /*padding: 40px 200px;*/
}

</style>
