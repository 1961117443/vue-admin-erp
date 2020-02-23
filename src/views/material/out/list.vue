<template>
  <div class="app-container">
    <el-bill-list :columns="columns" :remote-url="url">
      <template v-slot:toolbar>
        <router-link to="/material/out/create">
          <el-button type="success">
            新增
          </el-button>
        </router-link>
      </template>
      <template v-slot:actions>
        <el-table-column align="center" width="160">
          <template slot-scope="scope">
            <router-link :to="'/material/out/edit/'+scope.row.ID">
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
      </template>
    </el-bill-list>
  </div>
</template>

<script>
import ElBillList from '@/components/ElBillList'
export default {
  components: { ElBillList },
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
  data() {
    return {
      url: 'api/MaterialSalesOut',
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
      ],
      toolBarList: [
        // disabledStatus -- 1：未审核 2：已审核
        { icon: 'el-icon-edit', disabled: false, command: 'handleEdit', title: '编辑', disableStatus: 8 },
        { icon: 'el-icon-delete', disabled: false, command: 'handleDelete', title: '删除', disableStatus: 8 },
        { icon: 'el-icon-check', disabled: false, command: 'handleAudit', title: '审核', disableStatus: 8 },
        { icon: 'el-icon-close', disabled: false, command: 'handleUnAudit', title: '反审', disableStatus: 1 }
      ]
    }
  },
  created() {
  },
  methods: {
    handleCommand() {
      console.log(this['handleEdit'])
    },
    handleEdit() {
      console.log('handleEdit')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
