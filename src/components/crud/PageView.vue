<!--
 * @Description: 页面内容头部容器组件，去除间隙
 * @Author: 泡泡棠
 * @Date: 2019-06-26 15:43:03
 * @LastEditTime: 2019-07-08 16:58:00
 * @params: title 页面标题，默认留空隐藏
 * @params: breadcrumb 页面路径，默认显示
 * @params: descText 页面副标题，默认留空隐藏
 -->

<template>
  <div>
    <div class="page-view-top">
      <page-breadcrumb v-if="breadcrumb"/>
      <h1 v-if="title" class="title">{{ title }}</h1>
      <p v-if="descText" class="descText">{{descText}}</p>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Breadcrumb from './Breadcrumb'

export default {
  components: {
    'page-breadcrumb': Breadcrumb
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    breadcrumb: {
      type: Boolean,
      default: true,
      required: false
    },
    descText: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="stylus" scoped>
  .page-view-top
    margin 0 -16px 0px
    background-color #fff
    min-height 80px
    padding 16px 32px 0
    border-bottom: 1px solid #e8e8e8
    .breadcrumb
      margin-bottom 16px
    .title
      font-size 20px
      line-height 28px
      font-weight 500;
      color rgba(0,0,0,.85)
      margin-bottom 16px
      -webkit-box-flex 1
      -ms-flex auto
      flex auto
    .descText
      font-size 14px
      margin-bottom 16px
</style>
