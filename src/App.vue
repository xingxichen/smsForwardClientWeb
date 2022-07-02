<template>
  <div id="app" @click="destroyMsg">
    <div v-show="showBackBtn" @click="clickBack">
      <a-icon class="backId" theme="twoTone" type="home"/>
    </div>
    <div v-show="!showBackBtn" @click="update">
      <a-icon class="backId" type="home"/>
    </div>
    <!--    <canvas id="canvasId"></canvas>-->
    <!--    <router-view v-show="showRouter"></router-view>-->
    <index-page v-show="showRouter" :showMenu="showMenu"></index-page>
  </div>
</template>
<script>
import DateFormat from "@/util/dateFormat";
import {INDEX_PATH} from "@/router";
import IndexPage from "@/components/IndexPage";
import Vue from "vue";


export default {
  components: {
    IndexPage
  },
  data() {
    return {
      showMenu: true,
      startTime: new Date(),
      showBackBtn: true,
      showRouter: true,
      dblTimeout: undefined
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  created() {
    setInterval(() => {
      document.title = (DateFormat.format(this.startTime, "HH:mm:ss") + "-" + DateFormat.format(new Date(), "HH:mm:ss"))
    }, 1000)
    //
    // var x = document.createElement("CANVAS");
    // var ctx=x.getContext("2d");
    // ctx.fillStyle="#00ff40";
    // ctx.fillRect(0,0,10000,10000);
    //
    // console.log(ctx)
    // document.body.appendChild(x);
  },
  computed: {},
  methods: {
    clickBack() {
      let timeout = 300;
      if (!this.dblTimeout) {
        this.dblTimeout = setTimeout(() => {
          this.back()
          this.dblTimeout = undefined
        }, timeout)
      } else {
        clearTimeout(this.dblTimeout);
        this.dblTimeout = undefined
        // this.update()
        this.showMenu = !this.showMenu
        this.showBackBtn = false
        setTimeout(() => this.showBackBtn = true, timeout)
      }
    },
    back() {
      if (this.$router.currentRoute.path !== INDEX_PATH) {
        this.$router.replace(INDEX_PATH)
      } else {
        this.showBackBtn = false
        setTimeout(() => this.showBackBtn = true, 1000)
        Vue.prototype.$message.warn("当前已在首页了!")
      }
    },
    destroyMsg() {
      Vue.prototype.$message.destroy()
    },
    reload() {
      this.showRouter = false;
      location.reload()
      this.$nextTick(() => {
        this.showRouter = true
      })
    },
    update() {
      console.log('刷新页面')
      this.reload()
    }
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 0;
  /*color: #2c3e50;*/
  color: #000;
  overflow-x: hidden;
  overflow-y: scroll;
  position: absolute;
  height: 200vw;
  width: 100vw;

  background: rgba(87, 87, 94, 0) fixed 0 0 /*url('assets/logo.png')*/;
  margin: 0;
  border: 1px solid greenyellow;
}

/** {*/
/*  margin: 0;*/
/*  padding: 0;*/
/*}*/

.backId {
  position: fixed;
  top: 10px;
  left: 10px;
  font-size: 2em;
  z-index: 999;
  border: 1px solid greenyellow;
}

#canvasId {
  height: 100vw;
  width: 100vw;
  position: absolute;
  z-index: 999;
}
</style>
