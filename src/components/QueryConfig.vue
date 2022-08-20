<template>
  <div class="content">
    <a-space direction="vertical">
      <a-row>
        <a-space>
          <a-col> 版本码：</a-col>
          <a-col>
            <a-input-number
                v-model="configQuery.version_code"
                placeholder="请输入版本码"
                style="width: 150px"
            />
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-space>
          <a-col>
            <a-button v-auth="{auth:()=> enableCloneConfig}" :style="buttonStyle" type="primary" @click="pull">
              获取配置
            </a-button
            >
          </a-col>
          <a-col>
            <a-popconfirm cancel-text="取消" ok-text="确认" @confirm="push">
              <template #title>
                <p style="color: red">用页面显示的配置覆盖服务端的配置？</p>
              </template>
              <a-icon slot="icon" style="color: red" type="question-circle-o"/>
              <a-button v-auth="{auth:()=> enableCloneConfig}" :style="buttonStyle" type="primary">
                推送配置
              </a-button
              >
            </a-popconfirm>
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-space>
          <a-col>
            <a-popconfirm
                cancel-text="取消"
                ok-text="确认"
                @confirm="downloadFile"
            >
              <template #title>
                <p style="color: red">保存此页面显示的配置到本地？</p>
              </template>
              <a-icon slot="icon" style="color: red" type="question-circle-o"/>
              <a-button :style="buttonStyle" type="primary">保存本地</a-button>
            </a-popconfirm>
          </a-col>
          <a-col>
            <a-button :disabled="fileList&&fileList.length>0?null:true" :style="buttonStyle" type="primary"
                      @click="readFile">
              预览文件
            </a-button
            >
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-space>
          <a-col>
            <a-upload
                :before-upload="beforeUpload"
                :file-list="fileList"
                :remove="handleRemove"
                :style="buttonStyle"
                accept=".json"
            >
              <a-button>
                <a-icon type="upload"/>
                选择文件
              </a-button>
            </a-upload>
          </a-col>
        </a-space>
      </a-row>
    </a-space>
    <a-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0' }"
    >
      分割线
    </a-divider>
    <json-pre :json="json"></json-pre>
  </div>
</template>


<script>
import * as tools from "@/util/tools";
import JsonPre from "@/components/JsonPre";
import {downLoad} from "@/util/fileUtil";
import {CONFIG_QUERY, ENABLE_API_CLONE, SECRET, SERVER_URL} from '@/store/storeKeys'
import Vue from 'vue'
import {mapGetters} from "vuex";

export default {
  components: {
    JsonPre,
  },
  data() {
    return {
      fileList: [],
      json: "",
      buttonStyle: {
        width: "110px",
      },
    };
  },
  computed: {
    ...mapGetters({configQuery: CONFIG_QUERY}),
    ...mapGetters({secret: SECRET}),
    ...mapGetters({serverUrl: SERVER_URL}),
    enableCloneConfig() {
      return tools.getOrDefault(this.configQuery, ENABLE_API_CLONE, false)
    }
  },
  created: function () {
    this.pull()
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file, ...this.fileList];
      return false;
    },
    readFile() {
      if (!this.fileList || this.fileList.length < 1) {
        this.$message.error("请选择文件")
        return
      }
      var fileReader = new FileReader();
      fileReader.onload = () => (this.json = fileReader.result);
      fileReader.readAsText(this.fileList[0]);
    },
    downloadFile() {
      console.log(this.json);
      downLoad(this.json, "config.json");
    },
    pull() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: "post",
        url: this.serverUrl + `/clone/pull`,
        data: {
          data: {
            version_code: tools.getOrDefault(this.configQuery, 'version_code', -1),
          },
          timestamp: timestamp,
          sign: tools.sign(timestamp, this.secret),
        },
      }).then((res) => {
        // Vue.prototype.$message.destroy
        // Vue.prototype.$message.success(res.data.msg);
        this.json = res.data.data;
      }).catch((err) => {
        this.json = "";
      });
    },
    push() {
      let timestamp = new Date().getTime();
      this.$axios({
        method: "post",
        url: this.serverUrl + `/clone/push`,
        data: {
          data: this.json,
          timestamp: timestamp,
          sign: tools.sign(timestamp, this.secret),
        },
      }).then((res) => {
        // Vue.prototype.$message.destroy
        Vue.prototype.$message.success("推送成功!");
      });
    }
  },
  watch: {}
};
</script>

<style type="less">
</style>
