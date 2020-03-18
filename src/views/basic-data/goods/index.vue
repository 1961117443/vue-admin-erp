<template>
  <div class="app-container">
    <el-card
      v-loading="listLoading"
    >
      <div slot="header" class="clearfix">
        <el-button type="success" @click="onAdd">新增</el-button>
      </div>
      <el-table
        :data="list"
        element-loading-text="Loading"
        size="small"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="货品编号" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.ProductCode }}
          </template>
        </el-table-column>
        <el-table-column label="货品名称" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ProductName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电压" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.IUint }}
          </template>
        </el-table-column>
        <el-table-column label="功率" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ProductSpec }}</span>
          </template>
        </el-table-column>
        <el-table-column label="颜色" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ProductType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货品类别" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ProductCategoryID_Name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="180">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"
      />
    </el-card>

    <el-drawer
      ref="drawer"
      title=""
      :visible.sync="dialog"
      :wrapper-closable="false"
      :destroy-on-close="true"
      custom-class="demo-drawer"
      direction="rtl"
    >
      <div class="demo-drawer__content" style="padding:20px;">
        <el-form ref="form" :model="form" :label-width="formLabelWidth" :rules="rules">
          <el-form-item label="货品编号" prop="ProductCode">
            <el-input v-model="form.ProductCode" autocomplete="off" />
          </el-form-item>
          <el-form-item label="货品名称" prop="ProductName">
            <el-input v-model="form.ProductName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="货品类别" prop="ProductCategoryID_Name">
            <el-select v-model="form.ProductCategoryID" placeholder="请选择货品类别">
              <el-option v-for="item in categoryList" :key="item.ID" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="电压" prop="IUint">
            <el-input v-model="form.IUint" autocomplete="off" />
          </el-form-item>
          <el-form-item label="颜色" prop="ProductType">
            <el-input v-model="form.ProductType" autocomplete="off" />
          </el-form-item>
          <el-form-item label="功率" prop="ProductSpec">
            <el-input v-model="form.ProductSpec" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" :loading="loading" @click="onSubmit('form')">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getProductList, postProduct, delProduct, getProductCateoryList } from '@/api/basic-data'
import Pagination from '@/components/Pagination'
const table = {
  ID: null,
  ProductCode: '', // 编号
  ProductName: '', // 名称
  ProductSpec: '', // 功率
  IUint: '220V', // 电压
  ProductType: '', // 颜色
  ProductCategoryID: null,
  ProductCategoryID_Name: '' // 类别
}

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
  data() {
    return {
      list: [],
      listLoading: false,
      dialog: false,
      loading: false,
      form: Object.assign({}, table),
      formLabelWidth: '80px',
      rules: {
        ProductCode: [
          { required: true, message: '请输入类别编号', trigger: 'blur' }
        ],
        ProductName: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      },
      categoryList: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  created() {
    this.fetchData()
    this.fetchCategoryList()
  },
  methods: {
    fetchCategoryList() {
      getProductCateoryList({ limit: 0 }).then(res => {
        this.categoryList = res.data.map(item => {
          return { label: item.Name, value: item.ID }
        })
      })
    },
    fetchData() {
      this.listLoading = true
      getProductList(this.listQuery).then(response => {
        const data = response.data
        this.list = data.data
        this.total = data.total
      }).finally(_ => { this.listLoading = false })
    },
    onAdd() {
      this.form = Object.assign({}, table)
      this.dialog = true
    },
    onEdit(row) {
      this.form = Object.assign({}, row)
      this.dialog = true
    },
    onDelete(row) {
      this.$confirm('确定要删除吗？')
        .then(_ => {
          delProduct(row.ID).then(res => {
            let i = -1
            this.list.some((item, index) => {
              if (item.ID === row.ID) {
                i = index
                return true
              }
            })
            if (i > -1) {
              this.list.splice(i, 1)
            }
          })
        })
        .catch(_ => {})
    },
    onSubmit(formName) {
      if (this.loading) {
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const obj = Object.assign({}, this.form)
          postProduct(obj).then(res => {
            if (res.data) {
              let flag = false
              this.list.some(item => {
                if (item.ID === res.data.ID) {
                  Object.assign(item, res.data)
                  flag = true
                  return true
                }
              })
              if (!flag) {
                this.list.push(res.data)
              }
            }
            this.loading = false
            this.dialog = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .demo-drawer{
.demo-drawer__content {
    display: flex;
    flex-direction: column;
    padding: 20px;
} }
}

</style>
