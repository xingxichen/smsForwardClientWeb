<template>
  <div>
    <page-view :breadcrumb="false">
      <h2>CRUD示例</h2>
      <div style="color: rgba(0, 0, 0, 0.65);margin-bottom:15px">表格增删改查示例</div>
    </page-view>
    <div class="crud">
      <a-card :bodyStyle="{padding: 0}">
        <div class="toolbar">
          <div class="btns">
            <a-button type="primary" @click="onAddItem">新增</a-button>
            <a-button @click="onDeleteItem">删除</a-button>
          </div>
          <div><!-- <a-input-search placeholder="input search text" enter-button @search="onSearch" /> --></div>
        </div>
        <a-table
            rowKey="id"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="list"
            :pagination="pagination"
            :loading="tableLoading"
        >
          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" @click="onEditItem(record)">编辑</a>
          </template>
        </a-table>
      </a-card>
    </div>
    <edit-dialog ref="EditDialog" @done="getCrudData"></edit-dialog>
  </div>
</template>
<script>
import demo from './demo.js'
import PageView from './PageView'
import EditDialog from './CrudDialog'

const columns = [
  {
    title: '分类',
    dataIndex: 'name'
  },
  {
    title: '日期',
    dataIndex: 'recordDate'
  },
  {
    title: '序号',
    dataIndex: 'orderNo'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  components: {
    PageView,
    EditDialog
  },
  data() {
    return {
      columns,
      tableLoading: false,
      selectedRowKeys: [],
      loading: false,
      keyword: '',
      list: [],
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        // pageSizeOptions: ['5', '10', '15', '20'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    onOkCallback() {
      // console.log(1)
    },
    onAddItem() {
      this.$refs.EditDialog.show()
    },
    onEditItem(record) {
      this.$refs.EditDialog.show(record)
    },
    onDeleteItem() {
      let self = this
      let selectedRowKeys = this.selectedRowKeys
      if (selectedRowKeys.length) {
        this.$confirm({
          title: '你真的想删除选择项?',
          content: '删除后不能恢复！想清楚了再按确定',
          onOk() {
            demo.delCrudData({id: selectedRowKeys.join(',')})
                .then((res) => {
                  if (res.header.status === 'SUCCESS') {
                    self.getCrudData(true)
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
          },
          onCancel() {
          }
        })
      } else {
        this.$message.warning('没有选择项！')
      }
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
      this.getCrudData()
    },
    onPageShowSizeChange(pageSize) {
      this.pagination.defaultPageSize = pageSize
      this.getCrudData()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getCrudData(refesh) {
      this.tableLoading = true
      if (refesh) {
        this.pagination.current = 0
      }
      let params = {
        keyword: this.keyword,
        rows: this.pagination.defaultPageSize,
        page: this.pagination.current
      }
      demo.getCrudData(params)
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              this.list = res.body.rows
              this.pagination.total = res.body.totalrecords
            }
            this.tableLoading = false
          })
          .catch((err) => {
            console.log(err)
          })
    }
  },
  mounted: function () {
    this.getCrudData()
  }
}
</script>
<style lang="stylus" scoped>
.crud
  padding 20px

  .toolbar
    margin 10px
    display flex
    justify-content space-between
    align-items center

    .btns
      flex 1

      .ant-btn
        margin-right 5px
</style>
