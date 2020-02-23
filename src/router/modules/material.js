
import Layout from '@/layout'

const materialRouters = {
  path: '/material',
  component: Layout,
  name: 'Material',
  meta: { title: '材料管理', icon: 'example' },
  children: [
    {
      path: 'in',
      name: 'MaterialIn',
      // component: Layout,
      redirect: '/material/in/list',
      component: () => import('@/views/material/in/index'),
      meta: { icon: 'table', tableName: 'MaterialPurchase' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/material/in/list'),
          name: 'ListMaterialPurchase',
          meta: {
            title: '采购入库',
            keepAlive: true, // 需要被缓存
            tableName: 'MaterialPurchase'
          }
        },
        {
          path: 'create',
          component: () => import('@/views/material/in/components/CreatePostForm'),
          name: 'CreateMaterialPurchase',
          meta: { title: '新增采购入库', icon: 'edit', activeMenu: '/material/in/list', moduleState: 'add' },
          hidden: true
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/material/in/components/CreatePostForm'),
          name: 'EditMaterialPurchase',
          meta: { title: '编辑采购入库', noCache: true, activeMenu: '/material/in/list', moduleState: 'edit' },
          hidden: true
        },
        {
          path: 'browse/:id',
          component: () => import('@/views/material/in/components/CreatePostForm'),
          name: 'BrowseMaterialPurchase',
          meta: { title: '浏览采购入库', noCache: true, activeMenu: '/material/in/list', moduleState: 'browse' },
          hidden: true
        }
      ]
    },
    {
      path: 'out',
      name: 'MaterialOut',
      redirect: '/material/out/list',
      component: () => import('@/views/material/out/index'),
      meta: { icon: 'table', tableName: 'MaterialSalesOut' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/material/out/list'),
          name: 'ListMaterialSalesOut',
          meta: {
            title: '销售出库',
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'create',
          component: () => import('@/views/material/out/components/CreatePostForm'),
          name: 'CreateMaterialSalesOut',
          meta: { title: '新增销售出库', icon: 'edit', activeMenu: '/material/out/list', moduleState: 'add' },
          hidden: true
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/material/out/components/CreatePostForm'),
          name: 'EditMaterialSalesOut',
          meta: { title: '编辑销售出库', noCache: true, activeMenu: '/material/out/list', moduleState: 'edit' },
          hidden: true
        },
        {
          path: 'browse/:id',
          component: () => import('@/views/material/out/components/CreatePostForm'),
          name: 'BrowseMaterialSalesOut',
          meta: { title: '浏览销售出库', noCache: true, activeMenu: '/material/out/list', moduleState: 'browse' },
          hidden: true
        }
      ]
    },
    {
      path: 'useout',
      name: 'MaterialOut',
      component: () => import('@/views/material/useout/index'),
      meta: { icon: 'table', tableName: 'MaterialSalesOut', title: '领用出库' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/material/useout/list'),
          name: 'ListMaterialSalesOut',
          meta: {
            title: '销售出库',
            keepAlive: true // 需要被缓存
          },
          hidden: true
        },
        {
          path: 'create',
          component: () => import('@/views/material/useout/components/CreatePostForm'),
          name: 'CreateMaterialSalesOut',
          meta: { title: '新增销售出库', icon: 'edit', activeMenu: '/material/useout', moduleState: 'add' },
          hidden: true
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/material/useout/components/CreatePostForm'),
          name: 'EditMaterialSalesOut',
          meta: { title: '编辑销售出库', noCache: true, activeMenu: '/material/useout', moduleState: 'edit' },
          hidden: true
        },
        {
          path: 'browse/:id',
          component: () => import('@/views/material/useout/components/CreatePostForm'),
          name: 'BrowseMaterialSalesOut',
          meta: { title: '浏览销售出库', noCache: true, activeMenu: '/material/useout', moduleState: 'browse' },
          hidden: true
        }
      ]
    },
    {
      path: 'store',
      name: 'MaterialStore',
      component: () => import('@/views/material/store/list'),
      meta: { title: '材料库存', icon: 'table' }
    }
  ]
}

export default materialRouters
