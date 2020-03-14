<template>
  <el-card
    v-loading="loading"
    class="form-container-detail"
    style="height:calc(100vh-50px);"
  >
    <div slot="header" class="clearfix">
      <router-link to="/material/useout/create">
        <el-button type="success">新增</el-button>
      </router-link>
      <el-button type="success" @click="post">保存</el-button>
    </div>
    <!-- 主表信息 -->
    <el-form
      ref="postForm"
      :model="mainData"
      :rules="rules"
      label-width="120px"
      class="main-form"
      :disabled="IsBrowse"
      label-suffix=":"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号" prop="BillCode">
            <el-input v-model="mainData.BillCode" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库日期" prop="OutStoreDate">
            <el-date-picker
              v-model="mainData.OutStoreDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领用部门" prop="MaterialDepnameID_depname">
            <!-- <el-input v-model="mainData.VendorID_Name" /> -->
            <el-select-table
              v-model="mainData.MaterialDepnameID_depname"
              :data="mainData"
              url="api/ModuleConfigs/MaterialUseOutStore/MaterialDepnameID"
              foreign-key="MaterialDepnameID"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="领用人">
            <el-select v-model="mainData.LeadingPerson" placeholder="">
              <el-option v-for="item in dropDownData['LeadingPerson']" :key="item.id" :label="item.text" :value="item.text" />
            </el-select>
            <!-- <el-input v-model="mainData.CustomerID_Code" disabled /> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领用班组">
            <el-select v-model="mainData.MaterialUseTeam" placeholder="">
              <el-option v-for="item in dropDownData['MaterialUseTeam']" :key="item.id" :label="item.text" :value="item.text" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领用班长">
            <el-select v-model="mainData.MaterialUseTeamHead" placeholder="">
              <el-option v-for="item in dropDownData['MaterialUseTeamHead']" :key="item.id" :label="item.text" :value="item.text" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

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
        <el-form-item label="制单人">
          <u>{{ mainData.Maker }}</u>
        </el-form-item>
        <el-form-item label="制单时间">
          <u><span>{{ mainData.MakeDate | parseTime }}</span></u>
        </el-form-item>

        <el-form-item label="审核人">
          <u>{{ mainData.Audit }}</u>
        </el-form-item>
        <el-form-item label="审核时间">
          <u>{{ mainData.AuditDate | parseTime }}</u>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 从表信息 -->
    <el-table
      :data="tableData"
      border
      stripe
      size="small"
      height="554"
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
      <af-table-column width="100" prop="TotalQuantity" label="出库数量">
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
      <af-table-column width="200" prop="ItRemark" label="明细备注">
        <template slot-scope="{ row }">
          <el-input
            v-show="!IsBrowse"
            v-model="row.ItRemark"
            size="small"
            style="width:100%;"
          />
          <span v-show="IsBrowse">{{ row.Price }}</span>
        </template>
      </af-table-column>
      <af-table-column
        v-if="!IsBrowse"
        fixed="right"
        width="50"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteItem(scope.$index,scope.row)">删除</el-button>
        </template>
      </af-table-column>
    </el-table>
    <!-- 选择数据对话框 -->
    <el-transfer-dialog :visible.sync="choiceDialogVisible" :columns="transferDialogOptions.columns" @success="handleSuccess" />
  </el-card>
</template>

<script>
// import InstoreDetail from './components/InstoreDetail'
import Sticky from '@/components/Sticky' // 粘性header组件
import ElSelectTable from '@/components/ElSelectTable'
import ElTransferDialog from '@/components/ElTransferDialog'

import { form } from '@/mixins/form'
import { parseTime } from '@/utils/index.js'
import request from '@/utils/request'

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
  props: {
    module: {
      type: Object,
      default() {
        return {

        }
      }
    }
  },
  data() {
    return {
      // 下拉选项
      dropDownData: {
        LeadingPerson: [{ id: 'A', text: 'A' }, { id: 'C', text: 'C' }, { id: 'B', text: 'B' }],
        MaterialUseTeam: [{ id: '1', text: 'TeamA' }, { id: '2', text: 'TeamC' }, { id: '3', text: 'TeamB' }],
        MaterialUseTeamHead: [{ id: '1', text: 'TeamHeadA' }, { id: '2', text: 'TeamHeadC' }, { id: '3', text: 'TeamHeadB' }]
      },
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
          { field: 'MaterialWareHouseID_Name', align: '', title: '库位', width: 100 },
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
        if (this.moduleConfigs.toolbars) {
          this.moduleConfigs.toolbars.forEach(item => {
          // console.log(item)
          // console.log(`${item.title} ----- ${item.status} & ${status} === ${item.status} ----- ${(item.status & status) === status}`)
            if ((item.status & status) === status) {
              list.push(Object.assign({}, item))
            }
          })
        }

        if (!this.IsBrowse) {
          // list.push({ id: '123456789', title: '选择库存', command: 'handleSelectStock' })
        }
      }
      return list
    }
  },
  created() {
    this.initData()
    if (this.IsEdit || this.IsBrowse) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else if (this.IsAdd) {
    // this.mainData = Object.assign({}, main)
    }
  },
  mounted() {
    console.log(this)
  },
  methods: {
    // 初始化表
    initData() {
      this.mainData = Object.assign({}, main)
      this.tableData.splice(0, this.tableData.length)
    },
    // 调用api获取入库单数据
    fetchData(id) {
      this.loading = true
      request({
        url: `/api/MaterialUseOutStore/${id}`,
        method: 'get'
      }).then(res => {
        if (res.data) {
          this.mainData = Object.assign({}, res.data)
        }
      })
      request({
        url: `/api/MaterialUseOutStore/detail/${id}`,
        method: 'get'
      }).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      }).finally(() => { this.loading = false })
    },
    // 新增按钮
    handleAdd() {
      this.$router.push(`/material/out/create`)
    },
    // 编辑按钮
    handleEdit() {
      this.lockRecord().then(res => {
        if (res) {
          this.$router.push(`/material/out/edit/${this.id}`)
        }
      })
    },
    // 保存单据
    post() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.mainData.detail = this.tableData
          this.handleObject(this.mainData)
          request({
            url: `/api/MaterialUseOutStore`,
            method: 'post',
            data: this.mainData
          }).then(res => {
            const msg = res.data ? res.data : '录入成功'
            this.$notify({
              title: '成功',
              message: msg,
              type: 'success',
              duration: 2000
            })
            if (this.IsAdd) {
              this.initData()
            } else {
              // 跳转到浏览页面
              this.$router.push(`/material/useout/browse/${this.id}`)
            }
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
    deleteItem(index, row) {
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
    },
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/width.scss";
.form-container-detail{
  .row-bg{
      background-color: #f9fafc;
  }

  .el-select{
    width:  100%;
  }
}

</style>

