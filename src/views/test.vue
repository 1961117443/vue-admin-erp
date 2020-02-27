<template>
  <div>
    <el-query-panel :fields="fields" @search="onSearch" />
  </div>
</template>

<script>
import ElQueryPanel from '@/components/ElQueryPanel'
export default {
  components: { ElQueryPanel },
  data() {
    return {
      fields: [{
        field: 'ProductID_ProductCode',
        title: '货品编号',
        logics: 1,
        fieldType: 'string'
      }, {
        field: 'ProductID_ProductName',
        title: '货品名称',
        logics: 2 + 4 + 8,
        fieldType: 'date'
      }, {
        field: 'ProductID_ProductCategoryID_Name',
        title: '货品类别',
        fieldType: 'string'
      }, {
        field: 'ProductID_ProductCategoryID_Name1',
        title: '货品类别货品类别',
        fieldType: 'string'
      }]
    }
  },
  methods: {
    onSearch({ data }) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
