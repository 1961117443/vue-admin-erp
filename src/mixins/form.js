
import { RecordLock } from '@/mixins/record-lock'
import request from '@/utils/request'
import states from '@/utils/data-status'
/**
 * 表单属性 事件
 */
export const form = {
  mixins: [RecordLock],
  data() {
    return {
      id: '', // 单据主键
      tableName: '',
      tempRoute: {},
      moduleConfigs: {
        masterTableConfigs: {
          TableName: '',
          Url: ''
        },
        detailTableConfigs: {
          TableName: '',
          Url: '',
          Columns: []
        },
        toolbars: []
      }
    }
  },
  created() {
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    if (this.$route.params) {
      this.id = this.$route.params.id
      this.tableName = this.$route.meta.tableName
    }
    this.tempRoute.matched.some(item => {
      if (item.meta.hasOwnProperty('tableName')) {
        this.tableName = item.meta['tableName']
        return true
      }
    })
    if (this.tableName) {
      this.fetchModuleConfigs()
    }
    // this.lockRecord()
    // console.log(this)
  },
  computed: {
    DataState() {
      if (this.IsBrowse) {
        return states.Browse
      } else if (this.IsAdd) {
        return states.New
      } else if (this.IsEdit) {
        return states.Edit
      }
      return states.Empty
    },
    IsAdd: function() {
      if (this.tempRoute.meta.moduleState && this.tempRoute.meta.moduleState === 'add') {
        return true
      }
      return false
    },
    IsEdit: function() {
      if (this.tempRoute.meta.moduleState && this.tempRoute.meta.moduleState === 'edit') {
        return true
      }
      return false
    },
    IsBrowse: function() {
      if (this.IsEdit || this.IsAdd) {
        return false
      }
      return true
    }
  },
  destroyed() {
    // console.log('destroyed')
    this.unLockRecord()
  },
  methods: {
    // 获取单据数据
    fetchData(id) {
      console.log('base-fetchData')
    },
    // 数据提交前的处理
    handleObject(data) {
      if (data instanceof Array) {
        data.forEach(item => {
          this.handleObject(item)
        })
      } else {
        for (const key in data) {
          if (key.startsWith('___')) {
            delete data[key]
          }
          // 主从表结构，遍历从表数据
          if (data[key] instanceof Array) {
            this.handleObject(data[key])
          }
        }
      }
    },
    // 获取模块配置信息
    fetchModuleConfigs() {
      this.$store.dispatch('meta/getModuleConfigs', this.tableName)
        .then(data => {
          this.moduleConfigs = Object.assign({}, data)
        })
    },
    // 工具栏点击处理事件
    handleToolbarClick(command) {
      // console.log(command)
      const call = this[command]
      if (call) {
        call()
      } else {
        console.error('no handle command...' + command)
      }
    }
  },
  beforeDestroy() {
    // this.unLockRecord()
  }
}
