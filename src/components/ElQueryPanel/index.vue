<template>
  <div class="query-panel-container">
    <el-form :inline="true" :model="advSearchForm" class="form-inline" :size="size">
      <el-form-item>
        <el-query-item :field-list="Fields" :param="param" />
      </el-form-item>
      <el-form-item>
        <el-button-group style="vertical-align:inherit;">
          <el-button type="primary" plain icon="el-icon-search" :loading="loading" @click="onSubmit">查询</el-button>
          <el-button type="primary" :size="size" plain icon="el-icon-more" @click="showAdvanceForm" />
        </el-button-group>
      </el-form-item>
    </el-form>

    <el-dialog
      title="高级查询"
      :visible.sync="dialogVisible"
      width="460px"
    >
      <el-form :model="advSearchForm" :size="size">
        <el-form-item>
          <el-select v-model="advSearchForm.logicOption" placeholder="逻辑关系" :size="size" style="width:100px;">
            <el-option
              v-for="item in logicOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            :disabled="advSearchForm.params.length>=10"
            icon="el-icon-plus"
            :size="size"
            @click="addParam"
          />
          <el-button
            :disabled="advSearchForm.params.length===0"
            type="info"
            :size="size"
            plain
            @click="clearAllText"
          >清空所有值</el-button>
          <el-button
            :disabled="advSearchForm.params.length<=1"
            type="info"
            :size="size"
            plain
            @click="advSearchForm.params.splice(1,advSearchForm.params.length)"
          >删除所有条件</el-button>
        </el-form-item>
        <!-- <transition-group name="fade"> -->
        <el-form-item v-for="(item,index) in advSearchForm.params" :key="index">
          <div style="display:flex;vertical-align:inherit;">
            <el-query-item :field-list="Fields" :param="item" />

            <el-button v-show="index>0" type="text" icon="el-icon-close" :size="size" @click="delParam(index)" />
          </div>
        </el-form-item>
        <!-- </transition-group> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取 消</el-button>

        <el-button type="primary" :size="size" icon="el-icon-search" @click="onSubmit">查 询</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ElQueryItem from './ElQueryItem'

const param = {
  field: '',
  logic: 0,
  value: ''
}

const fieldOption = {
  field: '', // 查询字段
  title: '', // 查询字段的描述名称
  // value: '', // 查询值
  // logic: '', // 查询逻辑
  logics: 0, // 字段允许的查询逻辑 枚举类型
  fieldType: '' // 字段类型
}

export default {
  name: 'ElQueryPanel',
  components: { ElQueryItem },
  props: {
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    loading: Boolean
  },
  data() {
    return {
      advSearchForm: {
        logicOption: 0,
        params: []
      },
      dialogVisible: false,
      size: 'small',
      logicOptions: [
        { value: 0, label: '并且' },
        { value: 1, label: '或者' }
      ],
      param: Object.assign({}, param),
      logics: []
    }
  },
  computed: {
    // 根据传入的fields 重新组合一次查询字段
    Fields() {
      return this.fields.map(item => {
        return Object.assign({}, fieldOption, item)
      })
    }
  },
  created() {
  },
  methods: {
    // 点击查询按钮
    onSubmit() {
      const params = []
      if (this.dialogVisible) {
        this.advSearchForm.params.forEach(item => {
          item.join = this.advSearchForm.logicOption
        })
        Object.assign(params, this.advSearchForm.params)

        this.dialogVisible = false
      } else {
        params.push(Object.assign({}, this.param))
      }
      // console.log()
      this.$emit('search', { params: params })
    },
    // 显示高级查询
    showAdvanceForm() {
      this.dialogVisible = true
      if (this.advSearchForm.params.length === 0) {
        this.addParam()
      }
    },
    // 添加参数
    addParam() {
      this.advSearchForm.params.push(
        Object.assign({}, param)
      )
    },
    // 删除参数
    delParam(index) {
      this.advSearchForm.params.splice(index, 1)
    },
    // 删除所有的值
    clearAllText() {
      this.advSearchForm.params.forEach(item => {
        item.value = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.query-panel-container {
.el-form-item {
    margin-bottom: 0px;
  }

  .el-form--inline .el-form-item {
    margin-right: 0px;
  }
}
</style>
