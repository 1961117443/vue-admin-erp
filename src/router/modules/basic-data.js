
import Layout from '@/layout'

const basicDataRouters = {
  path: '/basic-data',
  component: Layout,
  name: 'BasicData',
  meta: { title: '基础资料', icon: 'example' },
  children: [
    // {
    //   path: 'section-bar',
    //   name: 'SectionBar',
    //   component: () => import('@/views/table/index'),
    //   meta: { title: '型材型号', icon: 'table' }
    // },
    {
      path: 'Goods/Cateory',
      name: 'GoodsCateory',
      component: () => import('@/views/basic-data/goods/cateory.vue'),
      meta: { title: '货品类别', icon: 'table' }
    },
    {
      path: 'goods',
      name: 'Goods',
      component: () => import('@/views/basic-data/goods/index'),
      meta: { title: '货品档案', icon: 'table' }
    }
  ]
}

export default basicDataRouters
