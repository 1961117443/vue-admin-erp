
export default {
  methods: {
    // 审核
    audit() {
      return new Promise((r, j) => {
        this.$confirm(`确认审核？`, '确认信息', {
          type: 'warning'
        })
          .then(_ => {
            console.log('confirm')
            r()
          })
          .catch(_ => {})
      })
      //   return this.$confirm(`确认审核？`, '确认信息', {
      //     type: 'warning'
      //   })
      //     .then(_ => {
      //       console.log('confirm')
      //       return new Promise(resolve)
      //       //   Promise.resolve(resolve())
      //         .then(_ => {
      //           console.log('ok')
      //         })
      //     })
      //     .catch(_ => {})

      //   return this.$confirm(`确认审核入库单[${data.BillCode}]吗？`, '确认信息', {
      //     type: 'warning'
      //   })
      //     .then(_ => {
      //       this.listLoading = true
      //       request({
      //         url: `api/MaterialSalesOut/audit/${id}`,
      //         method: 'post'
      //       }).then(res => {
      //         data = Object.assign(data, res.data)
      //         this.$notify({
      //           title: '成功',
      //           message: '审核成功！',
      //           type: 'success',
      //           duration: 2000
      //         })
      //       }).finally(() => {
      //         this.listLoading = false
      //       })
      //     })
      //     .catch(_ => {})
      //     .finally(() => {
      //       this.unLockRecord({ id })
      //     })
    }
  }
}
