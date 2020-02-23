
import { ApiLockRecord, ApiUnLockRecord } from '@/api/common'

// console.log(ApiLockRecord)
// console.log(request)
export const RecordLock = {
  data() {
    return {
      id: '',
      tableName: ''
    }
  },
  created() {
    if (this.$route.meta) {
      this.tableName = this.$route.meta.tableName
    }
    // console.log(this.$router)
  },
  watch: {
    '$route.path': function() {
      console.log(this.$route.path)
    }
  },
  methods: {
    // 锁定记录
    lockRecord(record) {
      record = Object.assign({ id: this.id, tableName: this.tableName }, record)
      return new Promise((resolve, reject) => {
        if (record.id && record.tableName) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          ApiLockRecord(record).then(res => {
            if (res.data) {
              this.$message({
                showClose: true,
                message: `该记录被${res.data.UserName}暂用中，请稍后再尝试。`,
                type: 'error'
              })
              reject(res.data)
            } else {
              resolve(true)
            }
          })
            .catch(error => {
              console.error('lock-error:' + error)
              reject()
            })
            .finally(() => {
              loading.close()
            })
        } else {
          resolve(true)
        }
      })
    },
    // 锁定记录
    async lockRecord1(record) {
      record = Object.assign({ id: this.id, tableName: this.tableName }, record)
      // console.log(record)
      if (record.id && record.tableName) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const res = await ApiLockRecord(record)
        loading.close()
        if (res.data) {
          this.$message({
            showClose: true,
            message: `该记录被${res.data.UserName}暂用中，请稍后再尝试。`,
            type: 'error'
          })
          return false
        }
        return true
      } else {
        return Promise.resolve(true)
      }
    },
    // 解除锁定
    async unLockRecord(record) {
      record = Object.assign({ id: this.id, tableName: this.tableName }, record)
      // console.log(record)
      if (record.id && record.tableName) {
        const res = await ApiUnLockRecord(record)
        // console.log(res)
        return res.data
      }
      return true
    }
  }

}
