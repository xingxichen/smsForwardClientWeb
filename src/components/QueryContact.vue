<template>
  <div class="content" style="width: 100%;" @keyup.enter="doQuery">
    <a-space direction="vertical">
      <a-row>
        <a-space>
          <a-col style="width: 60px;">
            姓名:
          </a-col>
          <a-col>
            <a-input v-model="query.name" allow-clear
                     placeholder="请输入姓名"
                     style="width: 150px"
                     type="text"
            ></a-input>
          </a-col>
        </a-space>
      </a-row>
      <a-row>
        <a-space>
          <a-col style="width: 60px;">
            手机号:
          </a-col>
          <a-col>
            <a-input v-model="query.phone_number" allow-clear
                     placeholder="请输入手机号"
                     style="width: 150px"
                     type="text"
            ></a-input>
          </a-col>
        </a-space>
      </a-row>
      <a-col>
        <a-button type="primary" @click="doQuery">刷新</a-button>
      </a-col>
    </a-space>
    <a-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0' }">
      分割线
    </a-divider>

    <a-table :columns="columns" :data-source="tableData" :pagination="pagination"
             :loading="tableLoading"
             :rowKey='record=>record.name+record.phone_number'
             :size="'small'" bordered>
      <template v-slot:name="text, record">
        <div :title="record.name" rel="external nofollow" style="font-size: 15px;color: #2f54eb"
             @dblclick="callLocal(record.phone_number)">
          <a-icon type="read"></a-icon>
          {{ record.name }}
        </div>
      </template>
      <template v-slot:phone_number="text, record">
        <div :title="record.name" @dblclick="callLocal(record.phone_number)">
          <a-tag style="color:#38a624;font-size: 20px">
            {{ handlePhoneNumber(record.phone_number) }}
          </a-tag>
        </div>
      </template>
    </a-table>

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
        name: "",
        phone_number: ""
      },
      tableLoading: true,
      tableData: [],
      columns: [
        {
          title: "姓名",
          align: 'left',
          dataIndex: "name",
          width: 90,
          scopedSlots: {customRender: 'name'}
        }, {
          title: "号码",
          align: 'left',
          dataIndex: "phone_number",
          // width: 200,
          scopedSlots: {customRender: 'phone_number'}
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 20,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['20', '50', '80', '100'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      }
    }
  },
  computed: {
    ...mapGetters({serverUrl: SERVER_URL}),
    ...mapGetters({secret: SECRET})
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
        url: this.serverUrl + `/contact/query`,
        data: {
          "data": {
            "name": this.query.name,
            "phone_number": this.query.phone_number,
          },
          "timestamp": timestamp,
          "sign": tools.sign(timestamp, this.secret)
        }
      }).then(res => {
        this.tableData = res.data.data
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    format(date, fmt) {
      return DateFormat.format(new Date(date), fmt)
    },
    handlePhoneNumber(phone_number) {
      phone_number = phone_number.startsWith('+86') ? phone_number.substring(3) : phone_number
      return phone_number.replaceAll('-', '').replaceAll(' ', '')
    },
    callLocal(tel) {
      tools.callLocal(tel)
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
    },
    onPageShowSizeChange(pageSize) {
      this.pagination.defaultPageSize = pageSize
    }
  },
  watch: {}
}
</script>

<style>
</style>
