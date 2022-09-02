import { User } from 'firebase/auth'
import { CoreContextTypes } from '../context'
import { ImageDataMongoTypes, SkeletonController } from '../skeleton.controller'
import axios from 'axios'

export class ImagePickerController extends SkeletonController {
  user: User | null

  constructor(fb: CoreContextTypes['fb'], user: User | null) {
    super(fb)
    this.user = user
  }

  async list(): Promise<ImageDataMongoTypes[]> {
    if (this.user) {
      const token = await this.user?.getIdToken()
      const result = await axios
        .post(`${this.nestURL}/pi/kgcore/image`, { token })
        .catch((err) => {
          throw new Error(err.message)
        })
      return result.data.docs || []
    } else {
      throw new Error('Please sign in')
    }
  }

  fromURL(url: string): Promise<any> {
    return new Promise(async (res, rej) => {
      if (!this.user) {
        rej('Please sign in.')
      } else {
        const token = await this.user?.getIdToken()
        const result = await axios.put(`${this.nestURL}/pi/kgcore/image/url`, {
          url,
          token
        })
        setTimeout(() => {
          res(result.data)
        }, 2000)
      }
    })
  }

  async delete(ids: string[]) {
    if (!this.user) {
      throw new Error('Please sign in.')
    }
    const token = await this.user?.getIdToken()
    const results = ids.map(async (id) => {
      await axios.delete(`${this.nestURL}/pi/kgcore/image/${id}/${token}`)
    })
    await Promise.all(results)
    return true
  }
}
