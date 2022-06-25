<template>
  <div class="content" @keyup.enter="doQuery">
    <a-row>
      <a-space>
        <div>
          通话类型:
        </div>
        <a-col :span="4">
          <a-select
              ref="select"
              v-model:value="query.type"
              style="width: 70px"
          >
            <a-select-option
                v-for="item in options"
                :key="item.value"
                :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-col>
        <div>
          页码:
        </div>
        <a-col :span="2">
          <a-input-number v-model="pagination.current" label="页码" :onchange="doQuery" placeholder="请输入页码"
                          style="width: 60px"></a-input-number>
        </a-col>
        <div>
          分页大小:
        </div>
        <a-col :span="8">
          <a-input-number v-model="pagination.defaultPageSize" label="分页大小" placeholder="请输入分页大小"
                          style="width: 60px"></a-input-number>
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

    <a-table :columns="columns" :data-source="tableData" :rowKey='o=>o.date+o.number' :pagination="pagination"
             :loading="tableLoading"
             :size="'small'" bordered>
      <template v-slot:number="text, record">
        <div :title="record.name">
          <a-tag v-if="record.name&&record.name!='未知号码'">
            <a-icon type="read"></a-icon>
            {{ record.name }}
          </a-tag>
          <a-tag style="color:#38a624;">
            {{ record.number }}
          </a-tag>
          <a-tag v-if="record.type=='1'">呼入</a-tag>
          <a-tag v-else-if="record.type=='2'">呼出</a-tag>
          <a-tag v-else-if="record.type=='3'">未接</a-tag>
          <a-tag v-else>未知</a-tag>

          <a-tag>
            {{ '通话时长：' + record.duration + '秒' }}
          </a-tag>
        </div>
      </template>
      <template #date="text, record">
        <div :style="{color:'#000'}">
          {{ format(text, "yyyy-MM-dd HH:mm:ss") }}
        </div>
      </template>
      <template #sim="text, record">
        <a-tag v-if="text=='0'" :color="'#38a624'" title="卡槽一">
          SIM1
        </a-tag>
        <a-tag v-else-if="text=='1'" :color="'#756616'" title="卡槽二">
          SIM2
        </a-tag>
        <a-tag v-else>
          {{ '未知:' + text }}
        </a-tag>
      </template>
    </a-table>

  </div>
</template>


<script>
import Util from "@/util/SmsForwardUtil";
import DateFormat from '@/util/dateFormat';
import Vue from "vue";
import {SmileOutlined, DownOutlined} from '@ant-design/icons-vue';

export default {
  components: {
    SmileOutlined,
    DownOutlined
  },
  data() {
    return {
      query: {
        type: "0",
        phone_number: ""
      },
      options: [
        {value: '0', label: '全部'},
        {value: '1', label: '呼入'},
        {value: '2', label: '呼出'},
        {value: '3', label: '未接'},
      ],
      solts: [
        {text: "卡槽一", value: "0"},
        {text: "卡槽二", value: "1"},
        {text: "-", value: "-1"}
      ],
      tableLoading: true,
      pagination: {
        // size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条`,
        // showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      },
      tableData: [],
      columns: [
        {
          title: "时间",
          dataIndex: "dateLong",
          width: 150,
          scopedSlots: {customRender: 'date'}
        },
        {
          title: "卡槽",
          dataIndex: "sim_id",
          width: 50,
          filters: this.solts,
          scopedSlots: {customRender: 'sim'},
        },
        {
          title: "详细",
          dataIndex: "number",
          scopedSlots: {customRender: 'number'}
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
        url: Util.serverUrl() + `/call/query`,
        data: {
          "data": {
            "type": this.query.type,
            "page_num": this.pagination.current,
            "page_size": this.pagination.defaultPageSize,
            "phone_number": this.query.phone_number,
          },
          "timestamp": timestamp,
          "sign": Util.sisgn(timestamp, Util.secret())
        }
      }).then(res => {
        if (res.data.code === 200) {
          Vue.prototype.$message.success(res.data.msg)
          this.tableData = res.data.data
          this.pagination.total = res.data.data.length
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
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
      // this.doQuery()
    },
    onPageShowSizeChange(pageSize) {
      this.pagination.defaultPageSize = pageSize
      // this.doQuery()
    }
  },
  watch: {}
}
</script>

<style>
</style>
