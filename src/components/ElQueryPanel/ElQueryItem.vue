<template>
  <div class="query-item-container">
    <div class="query-field">
      <el-select
        v-model="innerParam.field"
        placeholder="请选择"
        :size="size"
        @change="handleChange"
      >
        <el-option
          v-for="item in fieldList"
          :key="item.field"
          :label="item.title"
          :value="item.field"
        />
      </el-select>
    </div>
    <div class="query-logic">
      <el-select v-model="innerParam.logic" placeholder="请选择" :size="size">
        <el-option
          v-for="item in FieldLogics"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="query-value">
      <el-date-picker v-if="Param.fieldType==='date'" v-model="innerParam.value" :size="size" type="date" placeholder="选择日期" style="width:200px;" />
      <el-input v-else v-model="innerParam.value" placeholder="请输入内容" :size="size" clearable>
        <!-- <i slot="prefix" class="el-input__icon el-icon-search" /> -->
      </el-input>
    </div>
  </div>
</template>

<script>
// 每个查询字段的参数 跟ElQueryPanel一致
const fieldOption = {
  field: '', // 查询字段
  title: '', // 查询字段的描述名称
  // value: '', // 查询值
  // logic: '', // 查询逻辑
  logics: 0, // 字段允许的查询逻辑 枚举类型
  fieldType: '' // 字段类型
}
import { mapGetters } from 'vuex'
export default {
  name: 'ElQueryItem',
  props: {
    fieldList: {
      type: Array,
      default() {
        return []
      }
    },
    param: {
      type: Object,
      default() {
        return {
          field: '',
          logic: 0,
          value: ''
        }
      }
    },
    size: {
      type: String,
      default() {
        return 'small'
      }
    }
  },
  data() {
    return {
      innerParam: this.param
    }
  },
  computed: {
    ...mapGetters(['logics']),
    // 当前选中的查询字段
    Param() {
      let o = Object.assign({}, fieldOption)
      this.fieldList.some(item => {
        if (item.field === this.innerParam.field) {
          o = Object.assign(o, item)
          return true
        }
      })
      return o
    },
    // 查询字段拥有的查询条件
    FieldLogics() {
      return this.$store.getters.getLogics(this.Param.logics)
    }
  },
  mounted() {
    // console.log('mounted:' + this.innerParam.field)
    if (this.innerParam.field === '') {
      this.innerParam.field = this.fieldList[0].field
      this.handleChange()
    }
  },
  methods: {
    handleChange() {
    //   console.log('change')
    //   console.log(typeof this.value)
      //   console.log(this.Param.fieldType)
    //   console.log(this.value instanceof Date)
    //   switch (this.Param.fieldType) {
    //     case 'date':
    //     case 'datetime':
    //       console.log('this.value instanceof Date:' + this.value instanceof Date)
    //       if (this.value instanceof Date) {
    //         this.value = Date.parse(this.value)
    //       } else { this.value = '' }
    //       break
    //     case 'string':
    //       console.log(typeof this.value)
    //       if (this.value instanceof String) {
    //         this.value = Date.parse(this.value)
    //       } else { this.value = '' }
    //       break
    //     default:
    //       break
    //   }
      this.innerParam.logic = this.FieldLogics[0].value
      this.innerParam.value = ''

      //   if (this.Param.fieldType === 'date' || this.Param.fieldType === 'datetime') {
      //     var date = Date.parse(this.value)
      //     if (date < 0) {
      //       this.value = ''
      //     }
      //   }
      //   this.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
    .query-item-container{
    display: flex;
    .query-field {
      width: 100px;
    }
    .query-logic {
      width: 100px;
    }
    .query-value{
        // border: 1px;
        // background-color: blue;
      width: 200px;
    }
  }
</style>
