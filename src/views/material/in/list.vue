<template>
  <section>
    <sticky :z-index="10" :class-name="'sub-navbar'">
      <el-alert :closable="false">
        <router-link to="/material/in/create">
          <el-button type="success">
            新增
          </el-button>
        </router-link>

      </el-alert>
    </sticky>
    <div class="app-container">

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        size="mini"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="单据编号" prop="BillCode" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.BillCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" prop="InStoreDate" align="center" width="120">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.InStoreDate | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <af-table-column label="供应商" prop="VendorID_Name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.VendorID_Name }}</span>
          </template>
        </af-table-column>
        <el-table-column label="采购员" prop="Buyer" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Buyer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="送货单号" prop="DeliveryNum" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.DeliveryNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="税率（%）" prop="TaxRate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.TaxRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="Remark" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="制单人" prop="Maker" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Maker }}</span>
          </template>
        </el-table-column>
        <el-table-column label="制单时间" prop="MakeDate" align="center" width="170">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.MakeDate | parseTime() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" prop="Audit" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Audit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" prop="AuditDate" align="center" width="170">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.AuditDate | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160">
          <template slot-scope="scope">
            <router-link :to="'/material/in/browse/'+scope.row.ID">
              <el-button type="primary" size="mini">
                浏览
              </el-button>
            </router-link>
            <el-dropdown szie="small" trigger="click" @command="handleCommand">
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
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
      <!-- <el-record-lock /> -->
    </div>
  </section>

</template>

<script>
import { ApiMaterialPurchaseList, ApiMaterialPurchaseDelete, ApiMaterialPurchaseAudit, ApiMaterialPurchaseUnAudit } from '@/api/material'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils/index.js'
import { RecordLock } from '@/mixins/record-lock'
import states from '@/utils/data-status'

export default {
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    parseTime(date, cFormat) {
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      return parseTime(date, format)
    }
  },
  mixins: [RecordLock],
  data() {
    // const tableData = {
    //   ID: '',
    //   BillCode: '',
    //   InStoreDate: '',
    //   VendorID: '',
    //   VendorID_Name: '',
    //   Buyer: '',
    //   DeliveryNum: '',
    //   TaxRate: 0,
    //   Remark: '',
    //   Maker: '',
    //   MakeDate: '',
    //   Aduit: '',
    //   AuditDate: ''
    // }
    return {
      loading: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      toolBarList: [
        // disabledStatus -- 1：未审核 2：已审核
        { icon: 'el-icon-edit', disabled: false, command: 'handleEdit', title: '编辑', disableStatus: 8 },
        { icon: 'el-icon-delete', disabled: false, command: 'handleDelete', title: '删除', disableStatus: 8 },
        { icon: 'el-icon-check', disabled: false, command: 'handleAudit', title: '审核', disableStatus: 8 },
        { icon: 'el-icon-close', disabled: false, command: 'handleUnAudit', title: '反审', disableStatus: 1 }
      ]
    }
  },
  computed: {
    States: function() {
      return Object.assign({}, states)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getList() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      ApiMaterialPurchaseList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
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
      }
    },
    // 编辑订单
    handleEdit(data) {
      this.$router.push('/material/in/edit/' + data.ID)
    },
    // 删除订单
    handleDelete(data) {
      const id = data.ID
      this.$confirm(`确认删除入库单[${data.BillCode}]吗？`, '确认信息', {
        type: 'warning'
      })
        .then(_ => {
          this.listLoading = true
          ApiMaterialPurchaseDelete(data.ID).then(res => {
            let index = -1
            this.list.some((item, i) => {
              if (item.ID === data.ID) {
                index = i
                return true
              }
            })
            this.list.splice(index, 1)
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
          ApiMaterialPurchaseAudit(data.ID).then(res => {
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
    },
    handleUnAudit(data) {
      const id = data.ID
      this.$confirm(`确认反审入库单[${data.BillCode}]吗？`, '确认信息', {
        type: 'warning'
      })
        .then(_ => {
          this.listLoading = true
          ApiMaterialPurchaseUnAudit(id).then(res => {
            data = Object.assign(data, res.data)
            this.$notify({
              title: '成功',
              message: '反审成功！',
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
// @import "~@/styles/mixin.scss";

.app-container {
  position: relative;
}
</style>

