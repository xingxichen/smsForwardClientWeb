<template>
  <div class="content">
    <a-space direction="vertical" size="small">
      <a-row>
        <a-space>
          <a-col :span="5">
            <a-select ref="select" v-model="solt" placeholder="请选择卡槽" style="width: 80px">
              <a-select-option
                  v-for="item in options"
                  :key="item.value"
                  :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col>
            <div>
              接收者手机号:
            </div>
          </a-col>
          <a-col :span="10">
            <a-input
                style="width: 200px"
                placeholder="请输入接收者手机号"
                v-model="phone"
                type="tel"
                allow-clear>
            </a-input>
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-input
            placeholder="请输入短信内容(每条最多70个字符)"
            v-model="content"
            type="textarea"
            :auto-size="{ minRows: 6 }"
            style="font-size: 20px;"
            :maxLength='70'
            allow-clear>
        </a-input>
      </a-row>
      <a-row>
        <a-button @click="send" :type="'primary'"
                  :loading="countdown?true:undefined"
        >
          {{ countdown ? countdown + 's' : '发送' }}
        </a-button>
      </a-row>

    </a-space>
  </div>
</template>


<script>
import util from "@/util/SmsForwardUtil";
import Vue from "vue";

export default {
  data() {
    return {
      countdown: 0,
      options: [
        {
          value: '1',
          label: '卡槽一'
        },
        {
          value: '2',
          label: '卡槽二'
        }
      ],
      secret: '',
      phone: '',
      content: '',
      solt: '1'
    }
  },
  created() {
    this.secret = util.secret()
    this.phone = util.store("send-phone")
    this.content = util.store("send-content")
    setInterval(() => {
      return this.countdown > 0 ? this.countdown-- : '';
    }, 1000)
  },
  methods: {
    send() {
      let timestamp = new Date().getTime();
      this.countdown = 5;
      this.$axios({
        method: 'post',
        url: util.serverUrl() + `/sms/send`,
        data: {
          "data": {
            "sim_slot": this.solt,
            "phone_numbers": this.phone,
            "msg_content": this.content,
          },
          "timestamp": timestamp,
          "sign": util.sisgn(timestamp, this.secret)
        }
      }).then(res => {
        if (res.data.code === 200) {
          Vue.prototype.$message.success(res.data.msg)
        } else {
          Vue.prototype.$message.error('请求异常:' + res.data.msg)
        }
      }).catch(err => {
        Vue.prototype.$message.error("请求异常:" + err.message)
      })
    }
  },
  watch: {
    secret: function (newVal) {
      util.secret(newVal)
    },
    phone: function (newVal) {
      util.store("send-phone", newVal)
    },
    content: function (newVal) {
      util.store("send-content", newVal)
    },
  }


}
</script>

<style>
</style>
