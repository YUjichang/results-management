import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
    }]
  },

  {
    path: '/classes',
    component: Layout,
    redirect: '/classes/table',
    name: 'Classes',
    meta: { title: '班级管理', icon: 'peoples' },
    children: [
      {
        path: 'table',
        name: 'ClassesTable',
        component: () => import('@/views/classes/table/index'),
        meta: { title: '班级查询', icon: 'search' }
      },
      {
        path: 'import',
        name: 'ClassesImport',
        component: () => import('@/views/classes/import/index'),
        meta: { title: '批量导入', icon: 'excel' }
      }
    ]
  },

  {
    path: '/students',
    component: Layout,
    redirect: '/students/table',
    name: 'Students',
    meta: { title: '学生管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'table',
        name: 'StudentsTable',
        component: () => import('@/views/students/table/index'),
        meta: { title: '学生查询', icon: 'search' }
      },
      {
        path: 'import',
        name: 'StudentsImport',
        component: () => import('@/views/students/import/index'),
        meta: { title: '批量导入', icon: 'excel' }
      }
    ]
  },

  {
    path: '/results',
    component: Layout,
    redirect: '/results/table',
    name: 'Results',
    meta: { title: '成绩管理', icon: 'education' },
    children: [
      {
        path: 'table',
        name: 'ResultsTable',
        component: () => import('@/views/results/table/index'),
        meta: { title: '成绩查询', icon: 'search' }
      },
      {
        path: 'checkin',
        name: 'ResultsCheckin',
        component: () => import('@/views/results/checkin/index'),
        meta: { title: '成绩登记', icon: 'el-icon-edit-outline' }
      },
      {
        path: 'import',
        name: 'ResultsImport',
        component: () => import('@/views/results/import/index'),
        meta: { title: '批量导入', icon: 'excel' }
      }
    ]
  },

  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/table',
    children: [
      {
        path: 'table',
        name: 'StatisticsTable',
        component: () => import('@/views/statistics/index'),
        meta: { title: '统计分析', icon: 'el-icon-s-data' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
