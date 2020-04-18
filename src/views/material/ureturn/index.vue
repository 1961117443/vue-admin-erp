<template>
  <div class="app-container">
    <el-card
      v-loading="remoteLoading"
      class="form-container"
      style="height:calc(100vh-50px);"
    >
      <div slot="header" class="clearfix">
        <el-button type="success" @click="onCreate()">新增</el-button>
      </div>
      <el-table
        :data="table.data"
        element-loading-text="Loading"
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
        <el-table-column align="center" width="250">
          <template slot-scope="scope">
            <div v-show="scope.row.ID!==''">
              <el-button size="small" type="primary" @click="onBrowse(scope.row.ID)">浏览</el-button>
              <el-button size="small" @click="onEdit(scope.row.ID)">编辑</el-button>
              <!-- <el-dropdown szie="small" trigger="click" @command="handleCommand">
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
                  >
                    {{ item.title }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
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

    <!-- <el-dialog
      :visible.sync="dialog"
      :fullscreen="true"
      :show-close="false"
    >
      <div slot="title" />
      <create-post-form
        v-model="tempData"
        v-loading="remoteLoading"
        :status="dialogStatus"
        @success="submit"
      />
    </el-dialog> -->
    <el-drawer
      ref="drawer"
      :title="textMap[dialogStatus]"
      :with-header="false"
      size="100%"
      :visible.sync="dialog"
      :wrapper-closable="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="demo-drawer"
      direction="rtl"
    >
      <create-post-form
        v-model="tempData"
        v-loading="remoteLoading"
        :status="dialogStatus"
        @success="submit"
      />
    </el-drawer>
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import CreatePostForm from './components/CreatePostForm'

const main = {
  'ID': '',
  'BillCode': '',
  'InStoreDate': '',
  'MaterialDepnameID': '',
  'MaterialDepnameID_depname': '',
  'Buyer': '',
  'DeliveryNum': '',
  'TaxRate': 0,
  'Remark': '',
  'Maker': '',
  'MakeDate': '',
  'Audit': '',
  'AuditDate': '',
  Details: []
}

export default {
  components: { Pagination, CreatePostForm },
  data() {
    return {
      url: 'api/MaterialUseOutStoreReturn',
      toolBarList: [
        // disabledStatus -- 1：未审核 2：已审核
        { icon: 'el-icon-edit', disabled: false, command: 'handleEdit', title: '编辑', disableStatus: 8 },
        { icon: 'el-icon-delete', disabled: false, command: 'handleDelete', title: '删除', disableStatus: 8 },
        { icon: 'el-icon-check', disabled: false, command: 'handleAudit', title: '审核', disableStatus: 8 },
        { icon: 'el-icon-close', disabled: false, command: 'handleUnAudit', title: '反审', disableStatus: 1 }
      ],
      remoteLoading: false,
      table: {
        data: [],
        total: 0,
        columns: [
          { field: 'BillCode', title: '单据编号' },
          { field: 'OutStoreDate', title: '退回日期' },
          { field: 'MaterialDepnameID_depname', title: '退回部门' },
          { field: 'LeadingPerson', title: '退回人' },
          { field: 'MaterialUseTeam', title: '退回班组' },
          { field: 'MaterialUseTeamHead', title: '退回班长' },
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
      },
      dialog: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tempData: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.remoteLoading = true
      const ps = Object.assign({}, this.searchModel)
      request({
        url: 'api/MaterialUseOutStoreReturn',
        params: ps
      })
        .then(response => {
          if (response.data) {
            this.table.data = response.data.data
            this.table.total = response.data.total
          }
        }).finally(() => {
          this.remoteLoading = false
        })
    },
    getData(id) {
      this.remoteLoading = true
      return request({
        url: `/api/MaterialUseOutStoreReturn/${id}`
      }).then(res => {
        if (res.data) {
          this.tempData = Object.assign({}, res.data)
          return Promise.resolve(res.data)
        }
        return Promise.reject(false)
      }).finally(_ => {
        this.remoteLoading = false
      })
    },
    onBrowse(id) {
      this.getData(id).then(_ => {
        this.dialogStatus = 'browse'
        this.dialog = true
      })
    },
    onCreate() {
      this.tempData = Object.assign({}, main)
      this.dialogStatus = 'create'
      this.dialog = true
    },
    onEdit(id) {
      this.getData(id).then(_ => {
        this.dialogStatus = 'update'
        this.dialog = true
      })
    },
    submit(data) {
      if (data.ok) {
        this.remoteLoading = true
        request({
          url: `/api/MaterialUseOutStoreReturn`,
          method: 'post',
          data: Object.assign({}, this.tempData)
        })
          .then(res => {
            this.dialog = false
            if (res.data) {
              console.log(this.dialogStatus)
              if (this.dialogStatus === 'create') {
                console.log(res.data)
                this.table.data.push(res.data)
              } else {
                this.table.data.some(item => {
                  if (item.ID === res.data.ID) {
                    Object.assign(item, res.data)
                    return true
                  }
                })
              }
            }
          })
          .finally(_ => {
            this.remoteLoading = false
          })
      } else {
        this.dialog = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
