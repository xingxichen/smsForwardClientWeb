<template>
  <div class="content0">
    <a-space direction="vertical">
      <a-row>
        <a-col>
          <a-button type="primary" @click="batteryQuery" @keyup.enter="batteryQuery">刷新</a-button>
        </a-col>
      </a-row>
    </a-space>
    <div class="descriptions">
      <a-descriptions bordered title="设备电量">
        <a-descriptions-item label="刷新时间">
          {{ dateFormat(date) }}
        </a-descriptions-item>
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
  </div>
</template>


<script>
import * as tools from "@/util/tools";
import dateFormat from "@/util/dateFormat";


export default {
  data() {
    return {
      "date": "",
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
    this.batteryQuery()
  },
  methods: {
    batteryQuery() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: 'post',
        url: tools.serverUrl() + `/battery/query`,
        data: {
          "data": {},
          "timestamp": timestamp,
          "sign": tools.sign(timestamp, tools.secret())
        }
      }).then(res => {
        this.data = res.data.data;
        this.date = new Date()
        this.success = true;
      }).catch(err => {
        this.success = '';
      })
    },
    dateFormat(date) {
      return date ? dateFormat.format(date) : "-"
    }
  },
  computed: {
    // 只要data中的数据发生变化，就会触发该函数
    // ...mapGetters(['serverUrl', 'secret'])

  }
  ,
  watch: {}


}
</script>
<style type="less">
.descriptions {
  margin: 20px;
}

</style>
