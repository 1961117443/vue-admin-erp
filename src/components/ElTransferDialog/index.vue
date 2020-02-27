<template>
  <div class="transfer-dialog-container">
    <el-dialog
      title="选择库存"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="true"
      :fullscreen="false"
      :show-close="false"
      custom-class="transfer-dialog"
      top="2vh"
      width="90%"
      :modal="true"
      @closed="$emit('update:visible', false)"
    >

      <div v-loading="remoteLoading">
        <div slot="title">
          <el-query-panel :fields="fields" @search="onSearch" />
        </div>

        <el-table
          ref="source"
          :data="sourceTable"
          border
          stripe
          height="50vh"
          size="mini"
          :highlight-current-row="true"
          :row-style="handleRowStyle"
          :row-class-name="handleRowFormat"
          @row-dblclick="handleDblclick"
        >
          <af-table-column type="index" fixed="left" label="序号" />
          <af-table-column type="selection" fixed="left" width="35" />
          <af-table-column min-width="100" prop="ProductID_ProductCode" label="货品编号" />
          <af-table-column min-width="100" prop="ProductID_ProductName" label="货品名称" />
          <af-table-column min-width="100" prop="ProductID_ProductCategoryID_Name" label="货品类别" />
          <af-table-column min-width="100" prop="ProductID_ProductSpec" label="货品规格" />
          <af-table-column min-width="100" prop="ProductID_Unit" label="基本单位" />
          <af-table-column min-width="100" prop="BatNo" label="批号" />
          <af-table-column min-width="100" prop="MaterialWareHouseID_Name" label="库位" />
          <af-table-column min-width="100" prop="Quantity" label="库存数量" />
        </el-table>

        <div class="transfer-controls">
          <div class="transfer-btn">
            <el-button
              icon="el-icon-arrow-down"
              type="success"
              size="mini"
              @click="handleAdd"
            />
            <el-button
              icon="el-icon-arrow-up"
              type="danger"
              size="mini"
            />
          </div>
          <pagination
            v-show="queryParam.total>0"
            :total="queryParam.total"
            :page.sync="queryParam.page"
            :limit.sync="queryParam.limit"
            @pagination="getList"
          />
        </div>
      </div>
      <el-table
        ref="choice"
        :data="choiceTable"
        border
        stripe
        height="25vh"
        size="mini"
      >
        <af-table-column type="index" fixed="left" label="序号" />
        <af-table-column min-width="100" prop="ProductID_ProductCode" label="货品编号" />
        <af-table-column min-width="100" prop="ProductID_ProductName" label="货品名称" />
        <af-table-column min-width="100" prop="ProductID_ProductCategoryID_Name" label="货品类别" />
        <af-table-column min-width="100" prop="ProductID_ProductSpec" label="货品规格" />
        <af-table-column min-width="100" prop="ProductID_Unit" label="基本单位" />
        <af-table-column min-width="100" prop="BatNo" label="批号" />
        <af-table-column min-width="100" prop="MaterialWareHouseID_Name" label="库位" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import ElQueryPanel from '@/components/ElQueryPanel'
import request from '@/utils/request'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'ElTransferDialog',
  components: { Pagination, ElQueryPanel },
  props: {
    visible: Boolean
  },
  data() {
    return {
      innerVisible: this.visible,
      remoteLoading: false,
      fields: [
        { field: 'ProductID_ProductCode', title: '货品编号' },
        { field: 'ProductID_ProductName', title: '货品名称' },
        { field: 'ProductID_ProductCategoryID_Name', title: '货品类别' }
      ],
      sourceTable: [],
      choiceTable: [],
      queryParam: {
        total: 0,
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    CanAddOne: function() {
      if (this.$refs['source'] && this.$refs['source'].selection && this.$refs['source'].selection.length > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    visible(n, o) {
      // console.log('visible:change')
      this.innerVisible = n
    }
  },
  created() {
    // console.log('created')
  },
  methods: {
    onSubmit() {
      // console.log('submit!')
      this.fetchData()
    },
    handleOk() {
      this.innerVisible = false
      this.$emit('success', this.choiceTable)
    },
    getList() {
      // console.log(data)
      this.fetchData()
    },
    onSearch({ data }) {
      // this.queryParam.condition = Object.assign([], data)
      this.fetchData()
    },
    fetchData() {
      this.remoteLoading = true
      const ps = Object.assign({}, this.queryParam)
      request({
        url: 'http://localhost:8090/api/MaterialStock',
        params: ps
      }).then(res => {
        if (res.data) {
          this.queryParam.total = res.data.total
          this.sourceTable = res.data.data
        }
      }).finally(() => {
        this.remoteLoading = false
      })
    },
    handleAdd() {
      this.$refs['source'].selection.forEach(row => {
        this.AddOne(row)
      })
    },
    handleDblclick(row) {
      this.$refs['source'].selection.some(item => {
        if (item.ID === row.ID) {
          this.AddOne(row)
          return true
        }
      })
    },
    handleKeyup(data) {
      console.log(data)
    },
    AddOne(row) {
      var index = this.choiceTable.findIndex(item => item.InID === row.ID)
      if (index === -1) {
        const data = Object.assign({}, row)
        data.ID = new Date().getTime().toString()
        data.InID = row.ID
        this.choiceTable.push(data)
      }
    },
    handleRowStyle({ row, rowIndex }) {

    },
    handleRowFormat({ row, rowIndex }) {
      const index = this.choiceTable.findIndex(item => item.InID === row.ID)
      if (index > -1) {
        return 'selected-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
    .transfer-dialog-container{
      // .transfer-dialog{
      //   .el-dialog__body{
      //     padding: 0 20px;
      //   }
      // }
        .transfer-controls{
            display: flex;
            .transfer-btn{
                margin: 10px 0;
            }
        }
    }
</style>
<style lang="scss">
  .transfer-dialog{
      .el-dialog__body{
        padding: 0 20px;
      }
      .el-dialog__header {
          padding: 20px 20px 0px;
      }
    }
  .el-table .selected-row {
    // background: #409EFF;
    color: #409EFF;
  }
</style>
