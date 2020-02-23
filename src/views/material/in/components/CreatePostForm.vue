<template>
  <section class="app-container">
    <el-card
      v-loading="loading"
      class="box-card"
    >
      <div slot="header" class="clearfix">
        <!-- 工具栏 -->
        <div v-show="toolBarList.length>0" class="tool-bar">
          <el-row>
            <el-alert :closable="false">
              <el-button
                v-for="item in toolBarList"
                :key="item.id"
                :icon="item.icon"
                @click="handleToolbarClick(item.command)"
              >
                {{ item.title }}
              </el-button>
            </el-alert>
          </el-row>
        </div>
        <!-- 主表信息 -->
        <el-form
          ref="postForm"
          :model="mainData"
          :rules="rules"
          label-width="100px"
          class="main-form"
          :disabled="IsBrowse"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="入库单号：" prop="BillCode">
                <el-input v-model="mainData.BillCode" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库日期：" prop="InStoreDate">
                <el-date-picker
                  v-model="mainData.InStoreDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width:100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商：" prop="VendorID_Name">
                <!-- <el-input v-model="mainData.VendorID_Name" /> -->
                <el-select-table
                  v-model="mainData.VendorID_Name"
                  :data="mainData"
                  url="http://localhost:8090/api/ModuleConfigs/MaterialPurchase/VendorID"
                  foreign-key="VendorID"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购员：">
                <el-input v-model="mainData.Buyer" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货单号：">
                <el-input v-model="mainData.DeliveryNum" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="税率：">
                <!-- <el-input v-model.number="mainData.TaxRate" type="number" min="0" max="100" /> -->
                <el-input-number v-model="mainData.TaxRate" controls-position="right" :precision="0" style="width:100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="备注：">
              <el-input
                v-model="mainData.Remark"
                :rows="3"
                type="textarea"
                maxlength="100"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 2}"
              />
            </el-form-item>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col>
              <label class="el-form-item__label">制单人:{{ mainData.Maker }}</label>
              <label class="el-form-item__label">制单时间:{{ mainData.MakeDate | parseTime }}</label>
              <label class="el-form-item__label">审核人:{{ mainData.Audit }}</label>
              <label class="el-form-item__label">审核时间:{{ mainData.AuditDate | parseTime }}</label>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 从表信息 -->
      <el-table
        :data="tableData"
        border
        stripe
        height="500"
      >
        <af-table-column
          type="index"
          width="50"
          fixed="left"
        />
        <af-table-column
          v-for="(item,index) in moduleConfigs.detailTableConfigs.Columns"
          :key="index"
          :prop="item.field"
          :label="item.title"
          :align="item.align"
        />
        <el-table-column
          v-if="!IsBrowse"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleClickDel(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 明细窗口 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <create-post-item-form ref="itemForm" :key="temp.ID" :data="temp" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
// import InstoreDetail from './components/InstoreDetail'
import Sticky from '@/components/Sticky' // 粘性header组件
import ElSelectTable from '@/components/ElSelectTable'
import CreatePostItemForm from './CreatePostItemForm'

import { ApiMaterialPurchase, ApiMaterialPurchaseDetail, ApiPostMaterialPurchase } from '@/api/material'
import { form } from '@/mixins/form'
import { parseTime } from '@/utils/index.js'

const main = {
  'ID': '',
  'BillCode': '',
  'InStoreDate': '',
  'VendorID': '',
  'VendorID_Name': '',
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
  'ProductID_ProductCode': null,
  'ProductID_ProductName': null,
  'ProductID_ProductSpec': null,
  'ProductID_ProductCategory_Name': null,
  'Unit': null,
  'TotalQuantity': 0,
  'MaterialWareHouseID': null,
  'MaterialWareHouseID_Name': null,
  'NoTaxAmount': 0,
  'NoTaxPrice': 0,
  'Tax': 0,
  'TaxAmount': 0,
  'TaxPrice': 0,
  'AmountTax': 0,
  'BatNo': null,
  'ItRemark': null
}
export default {
  name: 'CreatePostForm',
  // eslint-disable-next-line vue/no-unused-components
  components: { Sticky, ElSelectTable, CreatePostItemForm },
  filters: {
    parseTime(date, cFormat) {
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      return parseTime(date, format)
    }
  },
  mixins: [form],
  data() {
    return {
      tableData: [],
      loading: false,
      mainData: Object.assign({}, main),
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
      tempRoute: {}
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
      ApiMaterialPurchase(id).then(res => {
        if (res.data) {
          this.mainData = res.data
        }
      })
      ApiMaterialPurchaseDetail(id).then(res => {
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
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加明细
    handleAppend() {
      console.log(new Date())
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
    // 编辑明细
    handleUpdate(row) {
      // console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      // console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['itemForm'].clearValidate()
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/width.scss";
.app-container{
  .box-card{
    .tool-bar{
      border: 1px;
      margin-bottom: 10px;
    }
  }
  .item-form-container{
    width: 800px;
  }
}

</style>

