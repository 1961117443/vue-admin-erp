<template>
  <section v-loading="listLoading" class="bill-list-container">
    <sticky :z-index="10" :class-name="'sub-navbar'">
      <div v-show="$slots.toolbar" class="toolbar-container">
        <slot name="toolbar" />
      </div>
    </sticky>
    <div class="bill-list-grid-container">
      <el-table
        :data="list"
        element-loading-text="Loading"
        size="mini"
        border
        fit
        highlight-current-row
        :height="gridHeight"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <af-table-column v-for="(item,index) in columns" :key="index" :label="item.title" :prop="item.field" align="center" />

        <slot name="actions" />
        <!-- <el-table-column align="center" width="160">
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
        </el-table-column> -->
      </el-table>
      <pagination
        v-show="listQuery.total>0"
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </section>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils/index.js'
export default {
  name: 'BillList',
  components: {
    Pagination, Sticky
  },
  filters: {
    parseTime(date, cFormat) {
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      return parseTime(date, format)
    }
  },
  props: {
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    remoteUrl: String
  },
  data: function() {
    return {
      loading: false,
      list: null,
      listLoading: true,
      listQuery: {
        total: 0,
        page: 1,
        limit: 20
      },
      toolBarList: [
        // disabledStatus -- 1：未审核 2：已审核
        { icon: 'el-icon-edit', disabled: false, command: 'handleEdit', title: '编辑', disableStatus: 8 },
        { icon: 'el-icon-delete', disabled: false, command: 'handleDelete', title: '删除', disableStatus: 8 },
        { icon: 'el-icon-check', disabled: false, command: 'handleAudit', title: '审核', disableStatus: 8 },
        { icon: 'el-icon-close', disabled: false, command: 'handleUnAudit', title: '反审', disableStatus: 1 }
      ],
      gridHeight: 0
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      const clientHeight = document.documentElement.clientHeight
      this.gridHeight = clientHeight - 200
    })
    // console.log(this.$slots)
    // console.log(clientHeight)
  },
  methods: {
    getList() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const ps = Object.assign({}, this.listQuery)
      delete ps.total
      request({
        baseURL: 'http://localhost:8090',
        url: this.remoteUrl,
        params: ps
      })
        .then(response => {
          if (response.data) {
            this.list = response.data.data
            this.listQuery.total = response.data.total
          }
        }).finally(() => {
          this.listLoading = false
        })
    },
    handleCommand() {
      console.log(this['handleEdit'])
    }
  }
}
</script>

<style lang="scss" scoped>
  .bill-list-container{
    .toolbar-container{
      background-color: #f4f4f5;
      padding: 5px 0;
      // .el-alert{
      //   padding: 0 0;
      // }
    }
    .bill-list-grid-container{
      margin: 5px 0 ;
    }
  }
</style>
