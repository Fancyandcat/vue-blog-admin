<template>
  <el-card class="goods-list">
    <div slot="header">
      <el-row :gutter="20">
        <el-col :span="2"><div>商品列表</div></el-col>
        <el-col :span="2"><el-input
          placeholder="请输入内容"
          v-model="input10"
          @change="ceshi"
          clearable>
        </el-input></el-col>
        <el-col :span="2" :offset="18"><div><el-button type="success" round size="medium" @click="goGoodsEdit">添加商品</el-button></div></el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="tableData" :border=true
        :highlight-current-row=true v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column :resizable=false align="center" label="缩略图">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" width="100px">
          </template>
        </el-table-column>
        <el-table-column :resizable=false prop="title" align="center" label="名称" />
        <el-table-column :resizable=false prop="price" align="center" sortable label="价格" />
        <el-table-column :resizable=false prop="category.attributes.title" align="center" label="分类" />
        <el-table-column :resizable=false align="center" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isNew">新品</el-tag>
            <el-tag type="danger" v-if="scope.row.isHot">热卖</el-tag>
          </template>
        </el-table-column>
        <el-table-column :resizable=false prop="createdAt" align="center" label="创建时间" :formatter="getMatterCreatedDate"/>
        <el-table-column :resizable=false prop="updatedAt" align="center" label="更新时间" :formatter="getMatterUpdatedAtDate"/>
        <el-table-column :resizable=false prop="roleconst" align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row.id)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageMsg.pageSize" :current-page="pageMsg.pageNum" :total="pageMsg.total" @current-change="handlePageChange" layout="total,prev,pager,next,jumper"></el-pagination>
    </div>
  </el-card>
</template>
<script>
import { ApiGoodsCountPage, ApiGoodsList, ApiGoodsDelete } from 'api/goods'
import { stamp2time } from 'common/js/common'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      tableData: [],
      loading: true,
      pageMsg: {
        total: 1,
        pageNum: 1,
        pageSize: 10
      },
      input10: ''
    }
  },
  created () {
    this.resetGoodsId()
    this.getPage()
    this.getList()
  },
  methods: {
    getPage () {
      ApiGoodsCountPage().then(res => {
        this.pageMsg.total = res.length
      })
    },
    getList () {
      this.loading = true
      ApiGoodsList(this.pageMsg).then(res => {
        if (Array.isArray(res)) {
          this.tableData = res.map(item => {
            return {
              ...item.attributes,
              id: item.id,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            }
          })
          this.loading = false
        } else {
          console.error('goodslist', res)
        }
      })
    },
    handlePageChange (i) {
      this.pageMsg.pageNum = i
      this.getList()
    },
    goGoodsEdit () {
      this.$router.push({name: 'goods-edit'})
    },
    getMatterCreatedDate (row, column) {
      let date = new Date(row.createdAt)
      return stamp2time(date.getTime())
    },
    getMatterUpdatedAtDate (row, column) {
      let date = new Date(row.updatedAt)
      return stamp2time(date.getTime())
    },
    handleDelete (id) {
      window.Message.confirmDeleteMessage().then(() => {
        ApiGoodsDelete(id).then(res => {
          window.Message.successMessage('删除成功')
          this.getList()
        }).catch(() => {
          window.Message.errorMessage('删除失败')
        })
      })
    },
    handleEdit (id) {
      this.setGoodsId(id)
      this.goGoodsEdit()
    },
    resetGoodsId () {
      this.setGoodsId('')
    },
    querySearchAsync (queryString, cb) {
    },
    ceshi (str) {
      console.log(str)
    },
    ...mapMutations('Goods', {
      'setGoodsId': 'SET_GOODS_ID'
    })
  }
}
</script>
<style lang="stylus" scoped>
.goods-list
  .title
    margin 20px 0
</style>
