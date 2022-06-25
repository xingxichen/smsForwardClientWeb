<template>
  <div class="content">
    <div v-show="inited">
      <a-row>
        <a-space>
          <a-col v-if="it.path" :span="span" v-for="it in this.$router.getRoutes()">
            <a-button type="primary" @click="toPage(it.path)">{{ it.meta.title }}</a-button>
          </a-col>
        </a-space>
      </a-row>
      <a-divider
          :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0' }"
      >
        分割线
      </a-divider>
    </div>
    <battery-query @inited="initedFunc"/>

  </div>
</template>

<script>
import batteryQuery from "@/components/BatteryQuery.vue";
import util from "@/util/SmsForwardUtil";

export default {
  data() {
    return {
      inited: util.store("inited"),
      span: 5
    }
  },
  components: {
    batteryQuery
  },
  methods: {
    initedFunc(inited) {
      this.inited = inited;
    },
    toPage(route) {
      this.$router.push(route)
    }
  },
  watch: {
    inited: function (newVal) {
      util.store("inited", newVal)
    }
  }
}
</script>
<style>
</style>
