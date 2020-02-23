
import { ApiGlobalDataState } from '@/api/common'

const Status = {
  Empty: 8388608,
  Browse: 1,
  New: 2,
  Edit: 4,
  Check: 8
}

ApiGlobalDataState().then(res => {
  if (res.data) {
    Object.assign(Status, res.data)
  }
})

export default Status
