<template>
  <div class="content" @keyup.enter="onLoadMore">
    <a-space direction="vertical">
      <a-row>
        <a-space>
          <div>
            短信类型:
          </div>
          <a-col :span="4">
            <a-select ref="select" v-model="query.type" style="width: 70px">
              <a-select-option v-for="item in options" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col>
            关键字:
          </a-col>
          <a-col>
            <a-input v-model="query.keyword" label="关键字" placeholder="请输入关键字" style="width: 100px"></a-input>
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-col>
          <a-button type="primary" @click="onLoadMore">刷新</a-button>
        </a-col>
      </a-row>
    </a-space>
    <a-divider style="color: #1989fa;border-color:#1989fa; padding: 0 ;">双击回复</a-divider>

    <a-list :dataSource="data" :loading="loading" :rowKey="o=>o.date+o.number"
            item-layout="horizontal">
      <div v-if="showLoadingMore" slot="loadMore" style="text-align: center">
        <a-spin v-if="loadingMore"/>
        <div
            v-else
            style="width: 100%;height: 80px;padding: 0 0;"
            @click="onLoadMore">
          <div style="font-size: 20px;line-height: 80px;color: #2f54eb;">
            更多&gt;&gt;
          </div>
        </div>
      </div>
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div :title="item.name" @dblclick="sendSmsLocal(item.number, item.content)">
          <a-list-item-meta>
            <div slot="title" style="color: #38a624;">{{
                (item.name === '未知号码' ? '' : (item.name + " ")) + item.number
              }}
            </div>
            <a-avatar slot="avatar" :src="require('@/assets/sms.png')"/>
          </a-list-item-meta>
          <div style="text-align: left;margin: 0">{{
              '(' + (index + 1) + ')&nbsp;&nbsp;' + item.content
            }}
          </div>
          <div slot="footer" style="text-align: left;color: #2f54eb;">
            <div style="font-size: 10px">
              <a-tag v-if="item.sim_id === 0" :color="'#38a624'" title="卡槽一">
                SIM1
              </a-tag>
              <a-tag v-else-if="item.sim_id === 1" :color="'#601bd7'" title="卡槽二">
                SIM2
              </a-tag>
              <a-tag v-else>
                {{ '未知:' + item.sim_id }}
              </a-tag>
              {{ format(item.date, "yyyy-MM-dd HH:mm:ss") }}
            </div>
          </div>
        </div>
      </a-list-item>
    </a-list>

  </div>
</template>


<script>
import DateFormat from '@/util/dateFormat';
import * as tools from "@/util/tools";
import {mapGetters} from "vuex";
import {SECRET, SERVER_URL} from "@/store/storeKeys";

export default {
  components: {},
  data() {
    return {
      query: {
        type: "1",
        keyword: ""
      },
      options: [
        {value: '1', label: '接收'},
        {value: '2', label: '发送'}
      ],
      solts: [
        {text: "卡槽一", value: "0"},
        {text: "卡槽二", value: "1"},
        {text: "-", value: "-1"}
      ],
      loading: false,
      loadingMore: false,
      showLoadingMore: true,
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      },
      data: [],
    }
  },
  computed: {
    ...mapGetters({serverUrl: SERVER_URL}),
    ...mapGetters({secret: SECRET})
  },
  created() {
    this.onLoadMore()
  },
  mounted() {
  },
  methods: {
    onLoadMore() {
      this.loadingMore = true;
      this.loading = true
      let timestamp = new Date().getTime();
      this.$axios({
        method: 'post',
        url: this.serverUrl + `/sms/query`,
        data: {
          "data": {
            "type": this.query.type,
            "page_num": this.pagination.current++,
            "page_size": this.pagination.defaultPageSize,
            "keyword": this.query.keyword,
          },
          "timestamp": timestamp,
          "sign": tools.sign(timestamp, this.secret)
        }
      }).then(res => {
        if (res.data.data.length < 1) {
          this.showLoadingMore = false
        }
        this.pagination.current++
        this.data = this.data.concat(res.data.data)
        this.loadingMore = false;
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
        });
        this.loading = false
      }).catch(err => {
        this.loadingMore = false;
        this.loading = false
      })
    },
    format(date, fmt) {
      return DateFormat.format(new Date(date), fmt)
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
      // this.doQuery()
    },
    onPageShowSizeChange(pageSize) {
      this.pagination.defaultPageSize = pageSize
      // this.doQuery()
    },
    sendSmsLocal(tel, content) {
      tools.sendSmsLocal(tel, content)
    }
  },
  watch: {}
}
</script>

<style>
.content {
  padding-bottom: 0;
}
</style>
