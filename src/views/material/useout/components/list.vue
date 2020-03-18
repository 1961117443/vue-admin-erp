<template>
  <el-card
    v-loading="listLoading"
    class="form-container"
    style="height:calc(100vh-50px);"
  >
    <div slot="header" class="clearfix">
      <router-link to="/material/useout/create">
        <el-button type="success">新增</el-button>
      </router-link>
    </div>
    <el-table
      :data="table.data"
      element-loading-text="Loading"
      size="mini"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <af-table-column v-for="(item,index) in table.columns" :key="index" :label="item.title" :prop="item.field" align="center" />
      <el-table-column align="center" width="160">
        <template slot-scope="scope">
          <div v-show="scope.row.ID!==''">
            <router-link :to="'/material/useout/browse/'+scope.row.ID">
              <el-button type="primary" size="mini">
                浏览
              </el-button>
            </router-link>
            <!-- v-show="scope.row.DataStatus" -->
            <el-dropdown szie="small" trigger="click" @command="handleCommand">
              <el-button size="mini" type="info" plain>
                操作
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in toolBarList"
                  :key="index"
                  :disabled="(item.disableStatus & scope.row.DataStatus) === scope.row.DataStatus"
                  :icon="item.icon"
                  :command="{ row:scope.row,command:item.command }"
                >{{ item.title }}</el-dropdown-item></el-dropdown-menu>
            </el-dropdown>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="table.total>0"
      :total="table.total"
      :page.sync="searchModel.page"
      :limit.sync="searchModel.limit"
      @pagination="fetchData"
    />
  </el-card>
</template>

<script>
import request from '@/utils/request'
import { RecordLock } from '@/mixins/record-lock'
import FormAction from '@/mixins/formAction'

import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
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
  mixins: [RecordLock, FormAction],
  data() {
    return {
      url: 'api/MaterialUseOutStore',
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
          { field: 'OutStoreDate', title: '出库日期' },
          { field: 'MaterialDepnameID_depname', title: '领用部门' },
          { field: 'LeadingPerson', title: '领用人' },
          { field: 'MaterialUseTeam', title: '领用班组' },
          { field: 'MaterialUseTeamHead', title: '领用班长' },
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
        limit: 10
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
    handleEdit(data) {
      this.$router.push(`/material/useout/edit/${data.ID}`)
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
      const cmd = { command: 'handleAudit', data: data }
      this.$parent.handleCommand(cmd)
      const id = data.ID
      this.$confirm(`确认审核出库单[${data.BillCode}]吗？`, '确认信息', {
        type: 'warning'
      })
        .then(_ => {
          this.listLoading = true
          request({
            url: `api/MaterialUseOutStore/audit/${id}`,
            method: 'post'
          }).then(res => {
            data = Object.assign(data, res.data)
          }).finally(() => {
            this.listLoading = false
          })
        })
        .catch(_ => {})
        .finally(() => {
          this.unLockRecord({ id })
        })
    },
    handleUnAudit(data) {
      const id = data.ID
      this.$confirm(`确认反审出库单[${data.BillCode}]吗？`, '确认信息', {
        type: 'warning'
      })
        .then(_ => {
          this.listLoading = true
          request({
            url: `api/MaterialUseOutStore/unaudit/${id}`,
            method: 'post'
          }).then(res => {
            data = Object.assign(data, res.data)
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
