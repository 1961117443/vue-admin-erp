<template>
  <div class="item-container">
    <el-form ref="postItemForm" :rules="detailRules" :model="temp" label-position="right" label-width="100px">
      <el-form-item label="货品编号" prop="ProductID_ProductCode">
        <el-select-table
          v-model="temp.ProductID_ProductCode"
          :data="temp"
          url="http://localhost:8090/api/ModuleConfigs/MaterialPurchaseDetail/ProductID"
          foreign-key="ProductID"
        />
      </el-form-item>
      <el-form-item label="货品名称" prop="ProductID_ProductName">
        <el-input v-model="temp.ProductID_ProductName" />
      </el-form-item>
      <el-form-item label="单位" prop="Unit">
        <el-select v-model="temp.Unit" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位" prop="MaterialWareHouseID">
        <el-select-table
          v-model="temp.MaterialWareHouseID_Name"
          :data="temp"
          url="http://localhost:8090/api/ModuleConfigs/MaterialPurchaseDetail/MaterialWareHouseID"
          foreign-key="MaterialWareHouseID"
        />
      </el-form-item>
      <el-form-item label="入库数量" prop="TotalQuantity">
        <el-input-number v-model="temp.TotalQuantity" text-align="right" controls-position="right" :precision="0" style="width:100%;text-align: right;" />
      </el-form-item>
      <el-form-item label="未税单价" prop="NoTaxPrice">
        <el-input-number v-model="temp.NoTaxPrice" :controls="false" controls-position="right" style="width:100%;text-align:right;" />
      </el-form-item>
      <el-form-item label="税率(%)">
        <el-input-number v-model="temp.DTaxRate" :controls="false" controls-position="right" style="width:100%;text-align:right;" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="temp.ItRemark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import ElSelectTable from '@/components/ElSelectTable'

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
  'DTaxRate': 0,
  'TaxAmount': 0,
  'TaxPrice': 0,
  'AmountTax': 0,
  'BatNo': null,
  'ItRemark': null
}

export default {
  name: 'CreatePostItemForm',
  components: { ElSelectTable },
  props: {
    data: {
      type: Object,
      default() {
        return Object.assign({}, detail)
      }
    }
  },
  data() {
    return {
      options: [{ id: 'KG', text: 'KG' }, { id: '盒', text: '盒' }],
      detailRules: {
        // ProductID_ProductCode: [{ required: true, message: '必选' }],
        // MaterialWareHouseID: [{ required: true, message: '必选' }]
      },
      temp: this.data
    }
  },
  watch: {
    'temp.TotalQuantity': {
      handler(n, o) {
        this.calcMoney()
        // this.temp.NoTaxAmount = (n * this.temp.NoTaxPrice).toFixed(2)
        // this.temp.TaxAmount = (n * this.temp.TaxPrice).toFixed(2)
        // this.temp.AmountTax = (this.temp.TaxAmount * this.temp.DTaxRate * 0.01).toFixed(2)
      }
    },
    'temp.NoTaxPrice': {
      handler(n, o) {
        this.calcMoney()
      }
    },
    'temp.DTaxRate'(n, o) {
      this.calcMoney()
    }
    // temp: {
    //   handler: function(n, o) {
    //     console.log(n)
    //   },
    //   deep: true
    // }
  },
  created() {
    // console.log('created')
  },
  mounted() {
    // console.log('mounted')
  },
  methods: {
    validate: function(callback) {
      this.$refs['postItemForm'].validate((valid) => {
        if (valid) {
          this.calcMoney()
          callback(valid, this.temp)
        }
      })
    },
    clearValidate: function() {
      this.$refs['postItemForm'].clearValidate()
    },
    calcMoney() {
      const tax = (this.temp.DTaxRate * 0.01 + 1)
      const notaxamount = (this.temp.TotalQuantity * this.temp.NoTaxPrice).toFixed(2)
      const taxprice = (this.temp.NoTaxPrice * tax).toFixed(4)
      this.temp.NoTaxAmount = parseFloat(notaxamount)
      this.temp.TaxPrice = parseFloat(taxprice)
      this.temp.TaxAmount = parseFloat((this.temp.TotalQuantity * taxprice).toFixed(2))
      this.temp.AmountTax = parseFloat((this.temp.TotalQuantity * taxprice).toFixed(2))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
