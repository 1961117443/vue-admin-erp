<template>
  <div class="query-panel-container">
    <div class="query-field">
      <el-select
        v-model="value"
        placeholder="请选择"
        :size="size"
        @change="handleChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-show="Logics.length>1" class="query-logic">
      <el-select v-model="logic" placeholder="请选择" :size="size">
        <el-option
          v-for="item in Logics"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="query-value">
      <el-date-picker v-if="option && option.type==='date'" v-model="input4" :size="size" type="date" placeholder="选择日期" />
      <el-input v-else v-model="input4" placeholder="请输入内容" :size="size" clearable>
        <!-- <i slot="prefix" class="el-input__icon el-icon-search" /> -->
      </el-input>
    </div>
  </div>
</template>

<script>
const LogicEnum =
   {
     Equal: 1,
     Like: 2,
     GreaterThan: 4,
     GreaterThanOrEqual: 8,
     LessThan: 16,
     LessThanOrEqual: 32,
     In: 64,
     NotIn: 128,
     // / <summary>
     // / ***%
     // / </summary>
     LikeLeft: 256,
     // / <summary>
     // / %***
     // / </summary>
     LikeRight: 512,
     NoEqual: 1024,
     IsNullOrEmpty: 2048,
     IsNot: 4096,
     NoLike: 8192
   }
const LogicEnumDesc =
   {
     Equal: '等于',
     Like: '包含',
     GreaterThan: '大于',
     GreaterThanOrEqual: '大于等于',
     LessThan: '小于',
     LessThanOrEqual: '小于等于',
     //  In: 64,
     //  NotIn: 128,
     // / <summary>
     // / ***%
     // / </summary>
     LikeLeft: '左包含',
     // / <summary>
     // / %***
     // / </summary>
     LikeRight: '右包含',
     NoEqual: '不等于',
     IsNullOrEmpty: '空',
     //  IsNot: 4096,
     NoLike: '不包含'
   }
export default {
  name: 'ElQueryPanel',
  props: {

  },
  data() {
    return {
      size: 'small',
      input4: '',
      options: [{
        value: 'ProductID_ProductCode',
        label: '货品编号',
        logics: 1,
        type: 'string'
      }, {
        value: 'ProductID_ProductName',
        label: '货品名称',
        logics: 2 + 4 + 8,
        type: 'date'
      }, {
        value: 'ProductID_ProductCategoryID_Name',
        label: '货品类别',
        type: 'string'
      }, {
        value: 'ProductID_ProductCategoryID_Name1',
        label: '货品类别货品类别',
        type: 'string'
      }],
      value: '',
      logics: [],
      logic: ''
    }
  },
  computed: {
    option() {
      let o = {}
      this.options.some(item => {
        if (item.value === this.value) {
          o = item
          return true
        }
      })
      return o
    },
    Logics() {
      const arr = []
      const logics = this.option.logics
      // console.log(logics)
      this.logics.forEach(item => {
        // console.log(item.value)
        if (!logics || ((logics & item.value) === item.value)) {
          arr.push(Object.assign({}, item))
        }
      })
      return arr
    }
  },
  created() {
    for (const key in LogicEnum) {
      if (LogicEnumDesc.hasOwnProperty(key)) {
        this.logics.push({ value: LogicEnum[key], label: LogicEnumDesc[key] })
      }
    }
  },
  methods: {
    handleChange() {
      console.log('change')
      this.input4 = ''
      this.logic = this.Logics[0].value
    }
  }
}
</script>

<style lang="scss" scoped>
  .query-panel-container{
    display: flex;
    .query-field {
      width: 100px;
    }
    .query-logic {
      width: 100px;
    }
    .query-value{
      width: 200px;
    }
  }
</style>
