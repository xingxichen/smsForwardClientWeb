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
import {CONFIG_QUERY, SECRET, SERVER_URL} from "@/store/storeKeys";
import {mapGetters} from "vuex";
import Vue from "vue";

export default {
  data() {
    return {
      countdown: 0,
      phone: '',
      content: '',
      solt: '1'
    }
  },
  computed: {
    // ...mapGetters({configQuery: CONFIG_QUERY}),
    ...mapGetters({serverUrl: SERVER_URL}),
    ...mapGetters({secret: SECRET}),
    options() {
      let options = [{value: '1'}, {value: '2'}];
      let confiQuery = this.$store.getters[CONFIG_QUERY]
      Vue.set(options[0], 'label', tools.getOrDefault(confiQuery, 'extra_sim1', ""))
      Vue.set(options[1], 'label', tools.getOrDefault(confiQuery, 'extra_sim2', ""))
      return options
    }
  },
  created() {
    this.phone = this.$ls.get("send-phone", "")
    this.content = this.$ls.get("send-content", "")
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
        url: this.serverUrl + '/sms/send',
        data: {
          data: {
            sim_slot: this.solt,
            phone_numbers: this.phone,
            msg_content: this.content,
          },
          timestamp: timestamp,
          sign: tools.sign(timestamp, this.secret)
        }
      }).then(res => {
        this.$ls.set("send-phone", this.phone)
        this.$ls.set("send-content", this.content)
      }).catch(err => {
      })
    }
  },
  watch: {
    phone(newVal) {

    },
    content(newVal) {

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
