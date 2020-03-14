<template>
  <div class="form-container">
    <router-view :module="module" />
  </div>
</template>

<script>
// import ElBillList from '@/components/ElBillList'
// import Sticky from '@/components/Sticky'
// import list from './components/list'
import request from '@/utils/request'
export default {
  // components: { ElBillList, Sticky, list, info },
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
      current: 'list',
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
      ],
      // 模块的配置信息
      module: {
        uid: '5D1F2C0B-5A57-4579-8517-D248F991775C',
        master: {
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
        detail: {
          columns: [
            { field: 'ProductID_ProductCode', title: '货品编号' },
            { field: 'ProductID_ProductName', title: '货品名称' },
            { field: 'ProductID_ProductCategoryID_Name', title: '货品类别' },
            { field: '货品规格', title: 'ProductID_ProductSpec' },
            { field: 'ProductID_Unit', title: '基本单位' },
            { field: 'BatNo', title: '批号' },
            { field: 'MaterialWareHouseID_Name', title: '库位' },
            { field: 'TotalQuantity', title: '出库数量' }
          ]
        }
      }
    }
  },
  created() {
    // console.log(this.$route)
    // console.log(this.$router)
  },
  methods: {
    handleAdd() {
      this.$router.push('/material/useout/create')
    },
    handleCommand() {
      console.log(this['handleEdit'])
    },
    handleEdit(data) {
      this.$router.push('/material/in/edit/' + data.ID)
    },
    fetchDropDownData() {
      request({
        url: `api/module/dropdown/${this.module.uid}`,
        method: 'get'
      }).then(res => {
        this.module.dropDownData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
</style>

<style lang="scss">
.form-container{
.el-card__header {
     padding: 10px 20px;
  }
}

</style>

