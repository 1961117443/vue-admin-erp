<template>
  <el-card
    class="box-card  bill-list-container"
    style="height:calc(100vh-10px)"
  >
    <div slot="header" class="clearfix">
      <div v-show="$slots.toolbar" class="toolbar-container">
        <slot name="toolbar" />
      </div>
    <!-- <span>卡片名称</span>
    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div class="bill-list-grid-container">
      <el-table
        :data="tableData"
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
        <af-table-column v-for="(item,index) in table.columns" :key="index" :label="item.title" :prop="item.field" align="center" />

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
        v-show="table.total>0"
        :total="table.total"
        :page.sync="pagination.page"
        :limit.sync="pagination.limit"
        @pagination="getList"
      />
    </div>
  </el-card>

  <!-- <section class="bill-list-container">
    <sticky :z-index="10" :class-name="'sub-navbar'">
      <div v-show="$slots.toolbar" class="toolbar-container">
        <slot name="toolbar" />
      </div>
    </sticky>
    <div class="bill-list-grid-container">
      <el-table
        :data="tableData"
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
        <af-table-column v-for="(item,index) in table.columns" :key="index" :label="item.title" :prop="item.field" align="center" />

        <slot name="actions" />
      </el-table>
      <pagination
        v-show="table.total>0"
        :total="table.total"
        :page.sync="pagination.page"
        :limit.sync="pagination.limit"
        @pagination="getList"
      />
    </div>
  </section> -->
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils/index.js'
export default {
  name: 'BillList',
  components: {
    Pagination
  },
  filters: {
    parseTime(date, cFormat) {
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      return parseTime(date, format)
    }
  },
  props: {
    pagination: {
      type: Object,
      default() {
        return {
          page: 1,
          limit: 20
        }
      }
    },
    table: {
      type: Object,
      default() {
        return {
          data: [],
          total: 0,
          columns: []
        }
      }
    }
  },
  data: function() {
    return {
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
  computed: {
    tableData() {
      // console.log(this.table.data)
      return this.table.data
    }
  },
  created() {
    // this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      const clientHeight = document.documentElement.clientHeight
      this.gridHeight = clientHeight - 300
    })
    // console.log(this.$slots)
    // console.log(clientHeight)
  },
  methods: {
    getList() {
      // this.fetchData()
      this.$emit('page-change', this.pagination)
    },
    handleCommand() {
      console.log(this['handleEdit'])
    }
  }
}
</script>

<style lang="scss" scoped>
  .bill-list-container{
    // .toolbar-container{
    //   background-color: #f4f4f5;
    //   padding: 5px 0;
    //   // .el-alert{
    //   //   padding: 0 0;
    //   // }
    // }
    // .bill-list-grid-container{
    //   margin: 5px 0 ;
    // }
  }
</style>
