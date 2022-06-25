<template>
  <a-modal :visible="visible" title="新增" @cancel="handleCancel" @ok="handleOk" :maskClosable="false">
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        保存
      </a-button>
    </template>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="form" :rules="rules">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="分类" prop="name">
            <a-input v-model="form.name"/>
          </a-form-model-item>
          <a-form-model-item label="序号" prop="orderNo">
            <a-input v-model="form.orderNo"/>
          </a-form-model-item>
          <a-form-model-item label="日期" prop="recordDate">
            <a-date-picker
                v-model="form.recordDate"
                show-time
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="分类" prop="name">
            <a-input v-model="form.name"/>
          </a-form-model-item>
          <a-form-model-item label="序号" prop="orderNo">
            <a-input v-model="form.orderNo"/>
          </a-form-model-item>
          <a-form-model-item label="日期" prop="recordDate">
            <a-date-picker
                v-model="form.recordDate"
                show-time
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>
<script>
import demo from './demo'
import moment from 'moment'

export default {
  name: 'CrudDialog',
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      editMode: false, // false为新增，true为编辑
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {
        name: '',
        recordDate: undefined,
        orderNo: ''
      },
      rules: {
        name: [{required: true, message: '请填写类型名称', trigger: 'blur'}],
        orderNo: [{required: true, message: '请填写序号', trigger: 'blur'}]
      }
    }
  },
  created() {
  },
  computed: {},
  methods: {
    show(item) {
      if (item) {
        console.log(item)
        this.editMode = true
        this.form.name = item.name
        this.form.recordDate = moment(item.recordDate)
        this.form.orderNo = item.orderNo
        this.form.id = item.id
      } else {
        this.editMode = false
        this.form.name = ''
        this.form.recordDate = ''
        this.form.orderNo = ''
      }
      this.visible = true
      this.loading = false
    },
    hide() {
      this.visible = false
      this.loading = false
    },
    handleCancel() {
      this.$refs.form.resetFields()
      this.visible = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.form.recordDate = this.form.recordDate ? this.form.recordDate.format('YYYY-MM-DD HH:ss:mm') : ''
          console.log('submit!', this.form)
          if (this.editMode) {
            demo.editCrudData(this.form)
                .then((res) => {
                  if (res.header.status === 'SUCCESS') {
                    this.$message.success('成功保存')
                    this.$emit('done', true)
                    this.hide()
                  }
                  this.loading = false
                })
                .catch((err) => {
                  console.log(err)
                })
          } else {
            demo.addCrudData(this.form)
                .then((res) => {
                  if (res.header.status === 'SUCCESS') {
                    this.$message.success('成功保存')
                    this.$emit('done', true)
                    this.hide()
                  }
                  this.loading = false
                })
                .catch((err) => {
                  console.log(err)
                })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
