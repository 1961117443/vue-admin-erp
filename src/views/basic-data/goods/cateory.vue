<template>
  <div class="app-container">
    <el-card
      v-loading="listLoading"
    >
      <div slot="header" class="clearfix">
        <el-button type="success" @click="dialog = true">新增</el-button>
      </div>
      <el-table
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="类别编号" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.Code }}
          </template>
        </el-table-column>
        <el-table-column label="类别名称" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="上级类别" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ParentID_Name }}</span>
          </template>
        </el-table-column> -->

        <el-table-column align="center" width="180">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
      ref="drawer"
      title=""
      :before-close="handleClose"
      :visible.sync="dialog"
      :wrapper-closable="false"
      :destroy-on-close="true"
      custom-class="demo-drawer"
      direction="rtl"
    >
      <div class="demo-drawer__content" style="padding:20px;">
        <el-form ref="form" :model="form" :label-width="formLabelWidth" :rules="rules">
          <el-form-item label="类别编号" prop="Code">
            <el-input v-model="form.Code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="类别名称" prop="Name">
            <el-input v-model="form.Name" autocomplete="off" />
          </el-form-item>
          <!-- <el-form-item label="上级类别" :label-width="formLabelWidth">
            <el-input v-model="form.Code" autocomplete="off" />
          </el-form-item> -->
        </el-form>
        <div class="demo-drawer__footer">
          <!-- <el-button @click="cancelForm">取 消</el-button> -->
          <el-button type="primary" :loading="loading" @click="onSubmit('form')">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getProductCateoryList, postProductCateory, delProductCateory } from '@/api/basic-data'

const table = {
  ID: null,
  Code: '',
  Name: '',
  ParentID: null,
  ParentID_Name: ''
}

export default {
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
        Code: [
          { required: true, message: '请输入类别编号', trigger: 'blur' }
        ],
        Name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getProductCateoryList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    onEdit(row) {
      this.form = Object.assign({}, row)
      this.dialog = true
    },
    onDelete(row) {
      this.$confirm('确定要删除吗？')
        .then(_ => {
          delProductCateory(row.ID).then(res => {
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
          postProductCateory(obj).then(res => {
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
            // this.$refs[formName].resetFields()
            this.loading = false
            this.dialog = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      done()
      // this.$confirm('确定要提交表单吗？')
      //   .then(_ => {
      //     this.loading = true
      //     this.timer = setTimeout(() => {
      //       done()
      //       // 动画关闭需要一定的时间
      //       setTimeout(() => {
      //         this.loading = false
      //       }, 400)
      //     }, 2000)
      //   })
      //   .catch(_ => {})
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
