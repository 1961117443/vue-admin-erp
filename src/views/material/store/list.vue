<template>
  <div class="app-container">
    <el-bill-list
      v-loading="listLoading"
      :table="table"
      :pagination="searchModel"
      @page-change="onPageChange"
    >
      <template v-slot:toolbar>
        <el-query-panel style="padding: 5px;0px;" :fields="table.columns" @search="onSearch" />
      </template>
    </el-bill-list>
  </div>
</template>

<script>
import ElBillList from '@/components/ElBillList'
import request from '@/utils/request'
import { RecordLock } from '@/mixins/record-lock'
import ElQueryPanel from '@/components/ElQueryPanel'

export default {
  components: { ElBillList, ElQueryPanel },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  mixins: [RecordLock],
  data() {
    return {
      url: 'api/MaterialSalesOut',
      toolBarList: [
        // disabledStatus -- 1：未审核 2：已审核
        { icon: 'el-icon-edit', disabled: false, command: 'handleEdit', title: '编辑', disableStatus: 8 },
        { icon: 'el-icon-delete', disabled: false, command: 'handleDelete', title: '删除', disableStatus: 8 },
        { icon: 'el-icon-check', disabled: false, command: 'handleAudit', title: '审核', disableStatus: 8 },
        { icon: 'el-icon-close', disabled: false, command: 'handleUnAudit', title: '反审', disableStatus: 1 }
      ],
      listLoading: false,
      table: {
        data: [],
        total: 0,
        columns: [
          { field: 'ProductID_ProductCode', align: '', title: '货品编号', width: 100 },
          { field: 'ProductID_ProductName', align: '', title: '货品名称', width: 100 },
          { field: 'ProductID_ProductCategoryID_Name', align: '', title: '货品类别', width: 100 },
          { field: 'ProductID_ProductSpec', align: '', title: '货品规格', width: 100 },
          { field: 'ProductID_Unit', align: '', title: '基本单位', width: 100 },
          { field: 'BatNo', align: '', title: '批号', width: 100 },
          { field: 'MaterialWareHouseID_Name', align: '', title: '库位', width: 100 },
          { field: 'Quantity', align: '', title: '库存数量', width: 100 },
          { field: 'Price', align: '', title: '单价', width: 100 },
          { field: 'Amount', align: '', title: '金额', width: 100 }
        ]
      },
      searchModel: {
        params: '',
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    // console.log(this.table)
    this.fetchData()
  },
  methods: {
    onPageChange(data) {
      // Object.assign(this.searchModel, data)
      this.fetchData()
    },
    onSearch(data) {
      console.log(data)
      // console.log(JSON.stringify(data))
      this.searchModel.params = JSON.stringify(data.params)
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const ps = Object.assign({}, this.searchModel)
      console.log(ps)
      request({
        url: 'http://localhost:8090/api/MaterialStock',
        params: ps
      }).then(res => {
        if (res.data) {
          this.table.total = res.data.total
          this.table.data = res.data.data
        }
      }).finally(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
