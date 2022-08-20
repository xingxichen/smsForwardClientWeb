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
          {{ data.timestamp|dateFormat }}
        </a-descriptions-item>
        <a-descriptions-item label="剩余电量">
          {{ data.level|defaultEmpty }}
        </a-descriptions-item>
        <a-descriptions-item label="充满电量">
          {{ data.scale|defaultEmpty }}
        </a-descriptions-item>
        <a-descriptions-item label="当前电压">
          {{ data.voltage|defaultEmpty }}
        </a-descriptions-item>
        <a-descriptions-item label="当前温度">
          {{ data.temperature|defaultEmpty }}
        </a-descriptions-item>
        <a-descriptions-item label="电池状态">
          {{ data.status|defaultEmpty }}
        </a-descriptions-item>
        <a-descriptions-item label="健康度">
          {{ data.health|defaultEmpty }}
        </a-descriptions-item>
        <a-descriptions-item label="充电器">
          {{ data.plugged|defaultEmpty }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>


<script>
import * as tools from "@/util/tools";
import dateFormat from "@/util/dateFormat";
import {SECRET, SERVER_URL} from "@/store/storeKeys";


export default {
  data() {
    return {
      secret: this.$store.getters[SECRET],
      serverUrl: this.$store.getters[SERVER_URL],
      data: {}
    }
  },
  compute: {
    // ...mapGetters({secret: SECRET}),
    // ...mapGetters({serverUrl: SERVER_URL}),
  },
  created() {
    this.batteryQuery()
  },
  methods: {
    batteryQuery() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: 'post',
        url: this.serverUrl + `/battery/query`,
        data: {
          "data": {},
          "timestamp": timestamp,
          "sign": tools.sign(timestamp, this.secret)
        }
      }).then(res => {
        this.data = res.data.data;
        this.data.timestamp = new Date(res.data.timestamp)
      }).catch(err => {
      })
    }
  },
  filters: {
    dateFormat(date) {
      return date ? dateFormat.format(date) : ""
    },
    defaultEmpty(val) {
      return tools.getOrDefault({val}, 'val', "")
    }
  },
  watch: {}
}
</script>
<style type="less">
.descriptions {
  margin: 20px;
}

</style>
