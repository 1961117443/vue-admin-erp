<template>
  <div class="select-table-container">
    <!-- <el-input ref="selectTableInput" v-model="currentValue" @input="showTable" /> -->
    <el-popover
      v-model="popupVisible"
      placement="bottom-start"
      trigger="manual"
      :visible-arrow="false"
      @after-leave="afterLeave"
    >
      <div
        class="main-container"
        @click="$refs.selectTableInput.focus()"
        @mouseenter="focuseOnPopup=true"
        @mouseleave="focuseOnPopup=false"
      >
        <el-table
          v-loading="remoteLoading"
          :data="tableData"
          max-height="300"
          size="mini"
          @row-dblclick="selectedRow"
        >
          <af-table-column v-for="(item) in tableConfig.Columns" :key="item.field" :prop="item.field" :label="item.title" />
        </el-table>
        <!-- <el-pagination
          small
          layout="prev, pager, next"
          :total="500"
        /> -->
      </div>
      <el-input
        ref="selectTableInput"
        slot="reference"
        v-model="currentValue"
        clearable
        @keyup.enter.native="onSearch"
        @blur="closePopup"
        @input="needCheckValue = true"
        @clear="clearInput"
      >
        <i v-show="popupVisible" slot="prefix" class="el-input__icon el-icon-close" @click="popupVisible=false" />
        <i v-show="!popupVisible" slot="prefix" class="el-input__icon el-icon-search" @click="openPopup" />
      </el-input>
      <!-- <el-button slot="reference">click 激活</el-button> -->
    </el-popover>

  </div>
</template>

<script>
// import { ApiProductList } from '@/api/basic-data'
import request from '@/utils/request'
export default {
  name: 'ElSelectTable',
  props: {
    config: {
      type: Object,
      default: function() {
        return {
          TableName: '',
          ForeignKey: '',
          Columns: [],
          PrimaryKey: '',
          Url: '',
          // 获取单个实体的api地址，如果为空，那么 urlmodel = {Url}/{PrimaryKey}
          ModelUrl: ''
        }
      }
    },
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    foreignKey: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    readonly: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      remoteLoading: false,
      currentValue: this.value,
      popupVisible: false,
      tableData: [],
      currentItem: {},
      lastQueryValue: 'lastQueryValue',
      focuseOnPopup: false,
      tableConfig: {},
      needCheckValue: false // 是否需要检查输入的值
    }
  },
  computed: {
    CurrentKeyValue() {
      // if (!this.data.hasOwnProperty(this.foreignKey)) {
      //   // console.error(`外键字段[${this.foreignKey}]不存在`)
      //   return ''
      // }
      const id = this.data[this.foreignKey]
      // console.log(id)
      return id
    }
  },
  watch: {
    CurrentKeyValue: function(n) {
      // console.log('watch:CurrentKeyValue:' + this.CurrentKeyValue)
      // const param = {}
      // param[this.tableConfig.PrimaryKey] = this.CurrentKeyValue
      // console.log(this.value)
      this.currentValue = this.value
      if (this.currentValue) {
        this.fetchOrigin()
      }
    }
  },
  created() {
    // 调用url获取配置信息
    if (typeof this.url !== 'undefined' && this.url != null && this.url !== '') {
      request({
        url: this.url
      }).then(res => {
        if (res.data && res.data.TableName) {
          this.tableConfig = Object.assign({}, res.data)
        }
      }).catch(() => {
        console.error(`Url地址错误：${this.url}`)
        this.tableConfig = Object.assign({}, this.config)
      }).finally(() =>
        this.fetchOrigin())
    } else {
      this.tableConfig = Object.assign({}, this.config)
      this.fetchOrigin()
    }
  },
  methods: {
    ApiTableData(params) {
      return request({
        url: this.tableConfig.Url,
        method: 'get',
        params: params
      })
    },
    openPopup() {
      // console.log('openPopup')
      const input = this.$refs['selectTableInput']
      const form = this.$refs['selectTableInput'].elForm

      if (input.disabled || input.readonly) {
        return
      }
      if (form && form.disabled) {
        return
      }
      this.popupVisible = true
      this.getTableData()
    },
    // 双击选择一行数据
    selectedRow(row, column, event) {
      this.handleSelectData(row)
      this.popupVisible = false
    },
    onSearch() {
      // console.log('onSearch')
      if (this.lastQueryValue === this.currentValue) {
        if (!this.popupVisible) {
          this.popupVisible = true
        }
        return
      } else {
        this.getTableData()
      }
    },
    // 获取数据
    getTableData() {
      this.remoteLoading = true
      this.ApiTableData({ q: this.currentValue }).then(res => {
        this.lastQueryValue = this.currentValue
        const list = res.data
        this.tableData = list
        // 1、 面板打开了：直接显示查询结果，不赋值 不做任何处理
        // 2、面板没打开：如果只有一行记录 直接赋值不显示面板 否则打开面板
        if (!this.popupVisible) {
          if (list.length === 1) {
            this.handleSelectData(list[0])
          } else {
            this.popupVisible = true
          }
        }
      }).finally(() => {
        this.remoteLoading = false
      })
    },
    // popup 关闭的时候出发
    afterLeave() {
      if (this.needCheckValue) {
        this.ApiTableData({ q: this.currentValue }).then(res => {
          this.lastQueryValue = this.currentValue
          const list = res.data
          this.tableData = list
          if (list.length === 1) {
            this.handleSelectData(list[0])
          } else {
            // console.log('afterLeave:no match')
            this.handleSelectData(this.currentItem)
          }
        })
      } else {
        this.currentValue = this.value
      }
    },
    // 选择数据之后 进行赋值处理
    handleSelectData(row) {
      // console.log(this.row)
      this.needCheckValue = false

      // console.log(this.tableConfig.PrimaryKey)
      // const prefix = this.foreignKey +
      const key = this.tableConfig.PrimaryKey.toLowerCase()
      for (const item in row) {
        // console.log(item)
        const prop = item.toLowerCase()
        // console.log(`key:${key}--prop:${prop}`)
        if (prop === key) {
          // console.log(this.foreignKey)
          // console.log(row[item])
          this.data[this.foreignKey] = row[item]
        } else {
          this.data[`${this.foreignKey}_${item}`] = row[item]
        }
      }
      this.$nextTick(() => {
        this.currentValue = this.value
        if (this.currentItem !== row) {
          this.currentItem = Object.assign({}, row)
          // console.log(this.currentItem)
        }

        this.$emit('select', { data: this.data, item: row })
      })
    },
    // input 失去焦点
    closePopup() {
      // console.log('closePopup:' + this.popupVisible)
      if (this.popupVisible) {
        if (!this.focuseOnPopup) {
          this.popupVisible = false
        }
      } else {
        if (this.needCheckValue) {
          this.afterLeave()
        }
      }
    },
    // 清空选中值
    clearInput() {
      // console.log(this.currentItem)
      this.handleSelectData(this.createEmptyObject(this.currentItem))
    },
    // 获取原始的数据对象
    fetchOrigin() {
      const id = this.CurrentKeyValue // ? this.CurrentKeyValue : '0'
      if (id) {
        const key = `___${this.foreignKey}`
        if (this.data.hasOwnProperty(key)) {
          this.currentItem = this.data[key]
        } else {
          if (this.tableConfig && (this.tableConfig.ModelUrl || this.tableConfig.Url)) {
          // console.log(this.tableConfig)
            let url = this.tableConfig.ModelUrl
            if (typeof url === 'undefined' || url == null || url === '') {
              url = `${this.tableConfig.Url}/${id}`
            }
            // console.log(url)
            const params = {}
            params[this.tableConfig.PrimaryKey] = id
            request({
              url: url,
              method: 'get',
              params: params
            }).then(res => {
              this.currentItem = Object.assign({}, res.data)
              this.data[key] = Object.assign({}, res.data)
            })
          }
        }
      }
    },
    createEmptyObject(object) {
      const newObj = {}
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const type = typeof object[key]
          if (type === 'number') {
            newObj[key] = 0
          } else if (type === 'boolean') {
            newObj[key] = false
          } else {
            newObj[key] = ''
          }
        }
      }
      return newObj
    }
  }
}
</script>

<style lang="scss" scoped>
    // .select-table-container{

    // }
</style>
