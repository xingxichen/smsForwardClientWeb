<template>
  <div class="content">
    <a-space direction="vertical">
      <a-row>
        <a-button-group>
          <a-button v-for="item in options" v-if="item.label" :key="item.value"
                    :type="item.value===solt?'primary':''" @click="solt=item.value">
            {{ item.label }}
          </a-button>
        </a-button-group>
      </a-row>
      <a-row>
        <a-space>
          <a-col>
            接收者手机号：
          </a-col>
          <a-col>
            <a-input
                placeholder="接收手机号码，多个手机号用半角分号分隔"
                v-model="phone"
                type="tel"
                allow-clear>
            </a-input>
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-col>
          <a-input
              v-model="content"
              :auto-size="{ minRows: 6 }"
              :maxLength='70'
              allow-clear
              placeholder="短信内容，70个字符内算一条，超过70个字符，每增加64字符累加1条，最多390字符（6条短信）"
              type="textarea">
          </a-input>
        </a-col>
      </a-row>
      <a-row>
        <a-button :loading="!!countdown" type="primary" @click="send">
          {{ countdown ? countdown + '秒' : '发送' }}
        </a-button>
      </a-row>
    </a-space>
  </div>
</template>


<script>
import * as tools from "@/util/tools";
import {CONFI_GQUERY} from "@/store/storeKeys";

export default {
  data() {
    return {
      countdown: 0,
      options: [
        {
          value: '1',
          label: ''
        },
        {
          value: '2',
          label: ''
        }
      ],
      phone: '',
      content: '',
      solt: '1'
    }
  },
  created() {
    this.phone = tools.store("send-phone")
    this.content = tools.store("send-content")

    const store = tools.store(CONFI_GQUERY);

    const confiQquery = store ? JSON.parse(store) : {};
    if (confiQquery['extra_sim1']) {
      this.options[0].label = confiQquery['extra_sim1']
    }
    if (confiQquery['extra_sim2']) {
      this.options[1].label = confiQquery['extra_sim1']
    }
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
        url: tools.serverUrl() + `/sms/send`,
        data: {
          "data": {
            "sim_slot": this.solt,
            "phone_numbers": this.phone,
            "msg_content": this.content,
          },
          "timestamp": timestamp,
          "sign": tools.sign(timestamp, tools.secret())
        }
      }).then(res => {
        tools.store("send-phone", this.phone)
        tools.store("send-content", this.content)
      }).catch(err => {
      })
    }
  },
  watch: {
    phone: function (newVal) {

    },
    content: function (newVal) {

    },
  }
}
</script>

<style scoped>
.content {
  /*position: absolute;*/
  padding: 100px 0;
}
</style>
