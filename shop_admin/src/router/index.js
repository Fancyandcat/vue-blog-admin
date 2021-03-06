import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/view/Login'
import Cloud from '@/components/view/Cloud'
import Bus from '@/components/view/Bus'
import Home from '@/components/content/index/Home'
// goodsList
const GoodsList = () => import('@/components/content/goods/GoodsList')
const GoodsEdit = () => import('@/components/content/goods/GoodsEdit')
// categoryList
const CategoryList = () => import('@/components/content/category/CategoryList')
const CategoryEdit = () => import('@/components/content/category/CategoryEdit')
Vue.use(Router)

let goods = [
  {
    path: 'goods',
    name: 'goods-list',
    component: GoodsList
  },
  {
    path: 'goods/edit',
    name: 'goods-edit',
    component: GoodsEdit
  }
]
let category = [
  {
    path: 'category',
    name: 'category-list',
    component: CategoryList
  },
  {
    path: 'category/edit',
    name: 'category-edit',
    component: CategoryEdit
  }
]

let routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/cloud',
    redirect: '/cloud/index'
  },
  {
    path: '/cloud',
    name: 'cloud',
    component: Cloud,
    children: [
      {
        path: 'index',
        name: 'index',
        component: Home
      },
      {
        path: 'bus',
        name: 'bus',
        component: Bus
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
routes[2].children = routes[2].children.concat(
  goods,
  category
)

export default new Router({
  routes: routes
})
