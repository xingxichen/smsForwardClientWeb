<template>
  <div class="content">
    <!--      密钥-->
    <a-row>
      <a-space>
        <div>
          版本码:
        </div>
        <a-col :span="5">
          <a-input-number v-model="version_code" placeholder="请输入版本码"
                          style="width: 150px">

          </a-input-number>
        </a-col>
        <a-col>
          <a-button @click="send" type="primary">获取</a-button>
        </a-col>
      </a-space>
    </a-row>
    <a-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0' }"
    >
      分割线
    </a-divider>
    <json-pre :json="json"></json-pre>
  </div>
</template>


<script>
import util from "@/util/SmsForwardUtil";
import Vue from "vue";
import JsonPre from "@/components/JsonPre";

export default {
  components: {
    JsonPre
  },
  data() {
    return {
      json: '',
      version_code: 300042
    }
  },
  created: function () {
    this.send()
  },
  methods: {
    send() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: 'post',
        url: util.serverUrl() + `/clone/pull`,
        data: {
          "data": {
            "version_code": this.version_code
          },
          "timestamp": timestamp,
          "sign": util.sisgn(timestamp, util.secret())
        }
      }).then(res => {
        if (res.data.code === 200) {
          Vue.prototype.$message.success(res.data.msg)
          this.json = res.data.data
        } else {
          this.json = ''
          Vue.prototype.$message.error('请求异常:' + res.data.msg)
        }
      }).catch(err => {
        Vue.prototype.$message.error('请求异常:' + err.message)
        this.json = ''
      })
    }
  }
  ,
  watch: {
    scret: function (newVal) {
      util.secret(newVal)
    }
  }


}
</script>

<style>
</style>
