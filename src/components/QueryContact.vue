<template>
  <div class="content" @keyup.enter="doQuery">
    <a-row>
      <a-space>
        <div>
          姓名模糊匹配:
        </div>
        <a-col :span="8">
          <a-input v-model="query.name" label="分页大小" placeholder="请输入姓名"
                   style="width: 150px"></a-input>
        </a-col>
        <div>
          手机号模糊匹配:
        </div>
        <a-col :span="4">
          <a-input v-model="query.phone_number" placeholder="请输入关键字" style="width: 150px"></a-input>
        </a-col>
        <a-col :span="2">
          <a-button @click="doQuery" type="primary">刷新</a-button>
        </a-col>
      </a-space>
    </a-row>
    <a-divider>分割线</a-divider>

    <a-table :columns="columns" :data-source="tableData" rowKey='phone_number'
             :loading="tableLoading"
             :size="'small'" bordered>
      <template v-slot:phone_number="text, record">
        <div :title="record.name">
          <a-tag v-if="record.name&&record.name!='未知号码'">
            <a-icon type="read"></a-icon>
            {{ record.name }}
          </a-tag>
          <a-tag style="color:#38a624;">
            {{ record.phone_number }}
          </a-tag>
        </div>
      </template>
    </a-table>

  </div>
</template>


<script>
import Util from "@/util/SmsForwardUtil";
import DateFormat from '@/util/dateFormat';
import Vue from "vue";

export default {
  components: {},
  data() {
    return {
      query: {
        name: "",
        phone_number: ""
      },
      tableLoading: true,
      tableData: [],
      columns: [
        {
          title: "详细",
          dataIndex: "phone_number",
          scopedSlots: {customRender: 'phone_number'}
        }
      ]
    }
  },
  created() {
    this.doQuery()
  }
  ,
  methods: {
    doQuery() {
      this.tableLoading = true
      let timestamp = new Date().getTime();
      this.$axios({
        method: 'post',
        url: Util.serverUrl() + `/contact/query`,
        data: {
          "data": {
            "name": this.query.name,
            "phone_number": this.query.phone_number,
          },
          "timestamp": timestamp,
          "sign": Util.sisgn(timestamp, Util.secret())
        }
      }).then(res => {
        if (res.data.code === 200) {
          Vue.prototype.$message.success(res.data.msg)
          this.tableData = res.data.data
        } else {
          Vue.prototype.$message.error('请求异常:' + res.data.msg)
        }
        this.tableLoading = false
      }).catch(err => {
        Vue.prototype.$message.error('请求异常:' + err.message)
        this.tableLoading = false
      })
    },
    format(date, fmt) {
      return DateFormat.format(new Date(date), fmt)
    }
  },
  watch: {}
}
</script>

<style>
</style>
