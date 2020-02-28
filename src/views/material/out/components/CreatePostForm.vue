<template>
  <section class="app-container">
    <el-card
      v-loading="loading"
      class="box-card"
      style="height:calc(100vh-10px)"
    >
      <div slot="header" class="clearfix">
        <!-- 工具栏 -->
        <div v-show="toolBarList.length>0" class="tool-bar">
          <el-button
            v-for="item in toolBarList"
            :key="item.id"
            :icon="item.icon"
            @click="handleToolbarClick(item.command)"
          >
            {{ item.title }}
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activeName">
        <el-tab-pane label="主表信息" name="master">
          <!-- 主表信息 -->
          <el-form
            ref="postForm"
            :model="mainData"
            :rules="rules"
            label-width="150px"
            class="main-form"
            :disabled="IsBrowse"
            label-suffix=":"
          >
            <el-form-item label="单据编号" prop="BillCode">
              <el-input v-model="mainData.BillCode" />
            </el-form-item>
            <el-form-item label="销售出库日期" prop="OutStoreDate">
              <el-date-picker
                v-model="mainData.OutStoreDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="客户名称" prop="CustomerID_Name">
              <!-- <el-input v-model="mainData.VendorID_Name" /> -->
              <el-select-table
                v-model="mainData.CustomerID_Name"
                :data="mainData"
                url="http://localhost:8090/api/ModuleConfigs/MaterialPurchase/VendorID"
                foreign-key="CustomerID"
              />
            </el-form-item>
            <el-form-item label="客户编号">
              <el-input v-model="mainData.CustomerID_Code" disabled />
            </el-form-item>
            <el-form-item label="业务员">
              <el-input v-model="mainData.Salesman" />
            </el-form-item>
            <el-form-item label="客户PO">
              <el-input v-model="mainData.CustomerPO" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="mainData.Remark"
                :rows="3"
                type="textarea"
                maxlength="100"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4}"
              />
            </el-form-item>
            <!-- footer -->
            <el-row type="flex" class="footer">
              <el-col>
                <el-form-item label="制单人">
                  <u>{{ mainData.Maker }}</u>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="制单时间">
                  <u>{{ mainData.MakeDate | parseTime }}</u>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="审核人">
                  <u>{{ mainData.Audit }}</u>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="审核时间">
                  <u>{{ mainData.AuditDate | parseTime }}</u>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="从表信息" name="detail">
          <!-- 从表信息 -->
          <el-table
            :data="tableData"
            border
            stripe
            size="small"
            height="680"
          >
            <af-table-column
              type="index"
              width="50"
              fixed="left"
            />
            <af-table-column min-width="100" prop="ProductID_ProductCode" label="货品编号" />
            <af-table-column min-width="100" prop="ProductID_ProductName" label="货品名称" />
            <af-table-column min-width="100" prop="ProductID_ProductCategoryID_Name" label="货品类别" />
            <af-table-column min-width="100" prop="ProductID_ProductSpec" label="货品规格" />
            <af-table-column min-width="100" prop="ProductID_Unit" label="基本单位" />
            <af-table-column min-width="100" prop="BatNo" label="批号" />
            <af-table-column min-width="100" prop="MaterialWareHouseID_Name" label="库位" />
            <af-table-column min-width="100" prop="TotalQuantity" label="出库数量">
              <template slot-scope="{ row }">
                <el-input-number
                  v-show="!IsBrowse"
                  v-model="row.TotalQuantity"
                  :controls="false"
                  :min="0"
                  size="small"
                  style="width:100%;"
                  @change="(value)=> row.Amount =parseFloat((value * row.Price).toFixed(2))"
                />
                <span v-show="IsBrowse">{{ row.TotalQuantity }}</span>
              </template>
            </af-table-column>
            <af-table-column min-width="100" prop="Price" label="单价">
              <template slot-scope="{ row }">
                <el-input-number
                  v-show="!IsBrowse"
                  v-model="row.Price"
                  :controls="false"
                  :min="0"
                  size="small"
                  style="width:100%;"
                  @change="(value)=> row.Amount =parseFloat((value * row.TotalQuantity).toFixed(2))"
                />
                <span v-show="IsBrowse">{{ row.Price }}</span>
              </template>
            </af-table-column>
            <af-table-column width="100" prop="Amount" label="金额" />
            <af-table-column
              v-if="!IsBrowse"
              fixed="right"
              width="100"
            >
              <template slot-scope="scope">
                <div v-show="!scope.row.$isEditing">
                  <!-- <el-button type="text" size="small" @click="handleRowEdit(scope.row)">编辑</el-button> -->
                  <el-button type="text" size="small" @click="handleClickDel(scope.$index,scope.row)">删除</el-button>
                </div>
                <div v-show="scope.row.$isEditing">
                  <el-button type="text" size="small" @click="handleRowEdit(scope.row)">确定</el-button>
                  <el-button type="text" size="small" @click="handleRowCancel(scope.row)">放弃</el-button>
                </div>
              </template>
            </af-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 明细窗口 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <!-- <create-post-item-form ref="itemForm" :key="temp.ID" :data="temp" /> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 选择数据对话框 -->
    <el-transfer-dialog :visible.sync="choiceDialogVisible" :columns="transferDialogOptions.columns" @success="handleSuccess" />
  </section>
</template>

<script>
// import InstoreDetail from './components/InstoreDetail'
import Sticky from '@/components/Sticky' // 粘性header组件
import ElSelectTable from '@/components/ElSelectTable'
import ElTransferDialog from '@/components/ElTransferDialog'

import { ApiMaterialSalesOut, ApiMaterialSalesOutDetail, ApiPostMaterialPurchase } from '@/api/material'
import { form } from '@/mixins/form'
import { parseTime } from '@/utils/index.js'

const main = {
  'ID': '',
  'BillCode': '',
  'InStoreDate': '',
  'CustomerID': '',
  'CustomerID_Name': '',
  'Buyer': '',
  'DeliveryNum': '',
  'TaxRate': 0,
  'Remark': '',
  'Maker': '',
  'MakeDate': '',
  'Audit': '',
  'AuditDate': ''
}
const detail = {
  'ID': null,
  'ProductID': null,
  'ProductID_ProductCode': '',
  'ProductID_ProductName': '',
  'ProductID_ProductCategoryID_Name': null,
  'ProductID_ProductSpec': '',
  'ProductID_Unit': '',
  'BatNo': '',
  'MaterialWareHouseID': null,
  'MaterialWareHouseID_Name': '',
  'TotalQuantity': 0,
  'Price': 0,
  'Amount': 0,
  'InID': ''
}
export default {
  name: 'CreatePostForm',
  // eslint-disable-next-line vue/no-unused-components
  components: { Sticky, ElSelectTable, ElTransferDialog },
  filters: {
    parseTime(date, cFormat) {
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      return parseTime(date, format)
    }
  },
  mixins: [form],
  data() {
    return {
      activeName: 'master',
      tableData: [],
      loading: false,
      mainData: {},
      rules: {
        BillCode: [{ required: true, message: '必填', trigger: 'blur' }],
        InStoreDate: [{ required: true, message: '必填' }],
        TaxRate: [{ min: 0, max: 100, trigger: 'blur' }]
      },
      detailRules: {
        // ProductID_ProductCode: [{ required: true, message: '必选' }],
        // MaterialWareHouseID: [{ required: true, message: '必选' }]
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      tempRoute: {},

      choiceDialogVisible: false,
      // 选择单据的对话框配置
      transferDialogOptions: {
        columns: [
          { field: 'ProductID_ProductCode', align: '', title: '货品编号', width: 100 },
          { field: 'ProductID_ProductName', align: '', title: '货品名称', width: 100 },
          { field: 'ProductID_ProductCategoryID_Name', align: '', title: '货品类别', width: 100 },
          { field: 'ProductID_ProductSpec', align: '', title: '货品规格', width: 100 },
          { field: 'ProductID_Unit', align: '', title: '基本单位', width: 100 },
          { field: 'BatNo', align: '', title: '批号', width: 100 },
          { field: 'MaterialWareHouseID_Name', align: '库位', title: '', width: 100 },
          { field: 'Quantity', align: '', title: '库存数量', width: 100 }
        ]
      }
    }
  },
  computed: {
    toolBarList() {
      const list = []
      if (this.mainData) {
        let status = this.DataState
        if (this.mainData.hasOwnProperty('states')) {
          status = status | this.mainData['states']
        }
        this.moduleConfigs.toolbars.forEach(item => {
          // console.log(item)
          // console.log(`${item.title} ----- ${item.status} & ${status} === ${item.status} ----- ${(item.status & status) === status}`)
          if ((item.status & status) === status) {
            list.push(Object.assign({}, item))
          }
        })
        if (!this.IsBrowse) {
          list.push({ id: '123456789', title: '选择库存', command: 'handleSelectStock' })
        }
      }
      return list
    }
  },
  created() {
    if (this.IsEdit || this.IsBrowse) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else if (this.IsAdd) {
      this.mainData = Object.assign({}, main)
    }
  },
  methods: {
    // 调用api获取入库单数据
    fetchData(id) {
      this.loading = true
      ApiMaterialSalesOut(id).then(res => {
        if (res.data) {
          this.mainData = res.data
        }
      })
      ApiMaterialSalesOutDetail(id).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      }).finally(() => { this.loading = false })
    },
    // 新增按钮
    handleAdd() {
      this.$router.push(`/material/in/create`)
    },
    // 编辑按钮
    handleEdit() {
      this.lockRecord().then(res => {
        if (res) {
          this.$router.push(`/material/in/edit/${this.id}`)
        }
      })
    },
    // 保存单据
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.mainData.detail = this.tableData
          this.handleObject(this.mainData)
          ApiPostMaterialPurchase(this.mainData).then(res => {
            const msg = res.data ? res.data : '录入成功'
            this.$notify({
              title: '成功',
              message: msg,
              type: 'success',
              duration: 2000
            })
            // 跳转到浏览页面
            this.$router.push(`/material/in/browse/${this.id}`)
          }).finally(() => {
            this.loading = false
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 添加明细
    handleAppend() {
      this.activeName = 'detail'
      this.temp = Object.assign({}, detail)
      this.temp.ID = new Date().getTime().toString()
      // console.log(this.temp)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log('clearValidate')
        this.$refs['itemForm'].clearValidate()
      })
    },
    // 放弃编辑
    handleRowCancel(row) {
      if (row.$row) {
        Object.assign(row, row.$row)
        delete row.$row
      }
      this.$set(row, '$isEditing', false)
      console.log(row)
    },
    // 编辑明细
    handleRowEdit(row) {
      // 正在编辑 -- 点击确定
      if (row.$isEditing) {
        this.$set(row, '$isEditing', false)
        delete row.$row
      } else {
        this.$set(row, '$isEditing', true)
        row.$row = Object.assign({}, row)
      }
    },
    updateData() {
      this.$refs['itemForm'].validate((valid, model) => {
        if (valid) {
          if (this.dialogStatus === 'update') {
            this.tableData.some(row => {
              if (row.ID === model.ID) {
                // console.log(this.temp)
                Object.assign(row, model)
                this.dialogFormVisible = false
                return true
              }
            })
          } else {
            this.tableData.push(Object.assign({}, model))
            this.dialogFormVisible = false
          }
        }
      })
    },
    // 删除明细
    handleClickDel(index, row) {
      this.tableData.splice(index, 1)
    },
    // 选择库存
    handleSelectStock(data) {
      this.activeName = 'detail'
      this.choiceDialogVisible = true
    },
    handleSuccess(rows) {
      rows.forEach(row => {
        const item = Object.assign({}, detail, row)
        item.TotalQuantity = 0
        item.Amount = 0
        this.tableData.push(item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/width.scss";
.app-container{
  .box-card{
    .tool-bar{
    //   border: 1px;
    //   margin-bottom: 10px;
    }
  }
  .item-form-container{
    // width: 800px;
  }
  .row-bg{
      background-color: #f9fafc;
  }
}

</style>

