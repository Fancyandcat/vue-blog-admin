<template>
  <div class="cloud">
    <el-row class="tac">
      <nav-bar></nav-bar>
      <menu-bar @changeMenuRight="changeMenuRight"></menu-bar>
      <el-col :span="20" class="content-box">
        <div class="content-crumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(title, index) in titleArr" :key="index"><span @click="changeRouteByCrumb(title, index!==(titleArr.length-1))">{{title}}</span></el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="content-wrapper">
          <transition name="fade" mode="out-in" appear>
            <router-view @changeContent="changeRouteToBus"></router-view>
          </transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import NavBar from '@/components/base/NavBar'
import MenuBar from '@/components/base/MenuBar'
import { throttle } from 'common/js/throttle'
import { ApiLoginStatic } from 'api/login'
import { routeName, routeObj, str2menuIdObj } from 'common/js/config'
import { mapMutations } from 'vuex'
export default {
  components: {
    NavBar,
    MenuBar
  },
  data () {
    return {
      searchThrottleConfig: {
        timeFlag: true,
        throttleTimer: null
      },
      titleArr: []
    }
  },
  created () {
    this.changeCrumbByRoute()
  },
  methods: {
    changeMenuRight (str) {
      let that = this
      return throttle(this.searchThrottleConfig, function () {
        that.changeRouteToBus(str)
      }, 500)
    },
    changeRouteToBus (str) {
      this.$router.push({name: 'bus', params: {name: str}})
    },
    changeRouteToLogin () {
      this.$router.push({name: 'login'})
    },
    // 面包屑相关操作开始
    changeCrumbByRoute () {
      if (this.$route.name === 'bus' || this.$route.name === 'index') {
        return (this.titleArr = [])
      }
      let routeNameArr = this.$route.name.split('-')
      let titleArrTemp = ['主页']
      routeName[routeNameArr[0]].name && titleArrTemp.push(routeName[routeNameArr[0]].name)
      routeName[routeNameArr[0]][routeNameArr[1]] && titleArrTemp.push(routeName[routeNameArr[0]][routeNameArr[1]])
      this.titleArr = titleArrTemp
    },
    changeRouteByCrumb (title, flag) {
      if (!flag) {
        return false
      }
      this.setCurrentMenu(str2menuIdObj[title])
      this.$router.push({name: routeObj[title]})
    },
    // 面包屑相关操作结束
    ...mapMutations('Basic', {
      'setCurrentMenu': 'SET_CURRENT_MENU',
      'clearQueryObj': 'CLEAR_QUERY_OBJ'
    })
  },
  watch: {
    $route (to, from, next) {
      if (!ApiLoginStatic()) {
        this.changeRouteToLogin()
      } else {
        this.changeCrumbByRoute()
      }
      from.name.split('-')[0] !== to.name.split('-')[0] && (this.clearQueryObj())
    }
  }
}
</script>
<style lang="stylus" scoped>
.cloud
  height 100%
  .tac
    height 100%
  .content-box
    height 94%
    padding 10px 10px 50px 10px
    .content-crumb
      margin-bottom 10px
    .content-wrapper
      height 100%
      width 100%
      border 1px solid #eef4f8
      box-shadow 0 0 10px #b8becc
      position relative
      border-radius 5px
      padding-right 5px
      overflow auto
      &::-webkit-scrollbar
        width 10px
        height 5px
        -webkit-border-radius 4px
      &::-webkit-scrollbar-thumb
        background-color #ccc
        -webkit-border-radius 4px
      &::-webkit-scrollbar-thumb:hover
        background-color #ccc
        -webkit-border-radius 4px
      &::-webkit-scrollbar-track-piece
        height 20px
        -webkit-border-radius 4px
.fade-enter-active,
.fade-leave-active
  transition opacity .3s
.fade-enter,
.fade-leave-active
  opacity 0
</style>
