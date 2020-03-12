<template>
  <div class="app-container">
    <el-bill-list
      v-loading="listLoading"
      :table="table"
      :pagination="searchModel"
      @page-change="onPageChange"
    >
      <template v-slot:toolbar>
        <router-link to="/material/out/create">
          <el-button type="success">
            新增
          </el-button>
        </router-link>
        <!-- <el-row type="flex">
          <el-col>
            <router-link to="/material/out/create">
              <el-button type="success">
                新增
              </el-button>
            </router-link>
          </el-col>
          <el-col style="float:right;">
            <el-query-panel :fields="columns" @search="onSearch" />
          </el-col>
        </el-row> -->
        <el-query-panel style="float:right; padding: 5px;0px;" :fields="table.columns" @search="onSearch" />
      </template>
      <!-- <template v-slot:toolbar:right>
        <el-query-panel :fields="columns" @search="onSearch" />
      </template> -->
      <template v-slot:actions>
        <el-table-column align="center" width="160">
          <template slot-scope="scope">
            <div v-show="scope.row.ID!==''">
              <router-link :to="'/material/out/browse/'+scope.row.ID">
                <el-button type="primary" size="mini">
                  浏览
                </el-button>
              </router-link>
              <el-dropdown v-show="scope.row.Status" szie="small" trigger="click" @command="handleCommand">
                <el-button size="mini" type="info" plain>
                  操作
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in toolBarList"
                    :key="index"
                    :disabled="(item.disableStatus & scope.row.Status) === scope.row.Status"
                    :icon="item.icon"
                    :command="{ row:scope.row,command:item.command }"
                  >{{ item.title }}</el-dropdown-item></el-dropdown-menu>
              </el-dropdown>
            </div>

          </template>
        </el-table-column>
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
          { field: 'BillCode', title: '单据编号' },
          { field: 'OutStoreDate', title: '销售出库日期' },
          { field: 'CustomerID_Name', title: '客户名称' },
          { field: 'Salesman', title: '业务员' },
          { field: 'CustomerPO', title: '客户PO' },
          { field: 'CustomerID_Code', title: '客户编号' },
          { field: 'Remark', title: '备注' },
          { field: 'Maker', title: '制单人' },
          { field: 'MakeDate', title: '制单时间' },
          { field: 'Audit', title: '审核人' },
          { field: 'AuditDate', title: '审核时间' }
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
      // console.log(data)
      // console.log(JSON.stringify(data))
      this.searchModel.params = JSON.stringify(data.params)
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const ps = Object.assign({}, this.searchModel)
      // console.log(ps)
      // delete ps.total
      request({
        url: this.url,
        params: ps
      })
        .then(response => {
          if (response.data) {
            this.table.data = response.data.data
            this.table.total = response.data.total
          }
        }).finally(() => {
          this.listLoading = false
        })
    },
    handleCommand(data) {
      // console.log(data)
      var method = this[data.command]
      if (method) {
        this.lockRecord({ id: data.row.ID }).then(res => {
          if (res) {
            method(data.row)
          }
        })
      } else {
        console.error('没找到处理方法:' + data.command)
      }
    },
    handleEdit() {
      console.log('handleEdit')
    },
    // 删除订单
    handleDelete(data) {
      const id = data.ID
      this.$confirm(`确认删除入库单[${data.BillCode}]吗？`, '确认信息', {
        type: 'warning'
      })
        .then(_ => {
          this.listLoading = true
          request({
            url: `api/MaterialSalesOut/delete/${id}`,
            method: 'post'
          }).then(res => {
            data.ID = ''
          }).finally(() => {
            this.listLoading = false
          })
        })
        .catch(_ => {})
        .finally(() => {
          this.unLockRecord({ id })
        })
    },
    handleAudit(data) {
      const id = data.ID
      this.$confirm(`确认审核入库单[${data.BillCode}]吗？`, '确认信息', {
        type: 'warning'
      })
        .then(_ => {
          this.listLoading = true
          request({
            url: `api/MaterialSalesOut/audit/${id}`,
            method: 'post'
          }).then(res => {
            data = Object.assign(data, res.data)
            this.$notify({
              title: '成功',
              message: '审核成功！',
              type: 'success',
              duration: 2000
            })
          }).finally(() => {
            this.listLoading = false
          })
        })
        .catch(_ => {})
        .finally(() => {
          this.unLockRecord({ id })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
