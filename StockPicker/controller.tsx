import { User } from 'firebase/auth'
import axios from 'axios'

export interface StockImageTypes {
  __v: string
  _id: string
  datecreate: string
  datemodified: string
  visibility: 'public' | 'private'
  type: 'image'
  user: string
  md5: string
  originalname: string
  size: number
  mimetype: string
  name: string
  path: string
  height?: number
  width?: number
  blurhash: string
  medium?: string
  thumbnail?: string
  from?: string
  fromId?: string
  credit?: {
    type: string
    value: string
    uid: string
  }
  ref?: string
}

export interface StockImageOptionsTypes {
  _id?: string
  datecreate?: string
  datemodified?: string
  visibility?: 'public' | 'private'
  type?: 'image'
  user?: string
  md5?: string
  originalname?: string
  size?: number
  mimetype?: string
  name?: string
  path?: string
  height?: number
  width?: number
  blurhash?: string
  medium?: string
  thumbnail?: string
  from?: string
  fromId?: string
  credit?: {
    type: string
    value: string
    uid: string
  }
  ref?: string
}

export const apiURL = `https://s1.phra.in:8086`

export class StockImageController {
  user: User
  apiURL: string = apiURL

  constructor(user: User) {
    this.user = user
  }

  async getHeader(user: User, opts?: HeadersInit): Promise<HeadersInit> {
    const token = await user.getIdToken()
    return Object.assign({}, opts, {
      Authorization: `Bearer ${token}`
    } as HeadersInit)
  }

  async getMy(): Promise<StockImageTypes[]> {
    if (this.user) {
      const result = await fetch(`${this.apiURL}/file/my`, {
        method: 'GET',
        headers: await this.getHeader(this.user)
      })
        .then<StockImageTypes[]>((res) => res.json())
        .catch((err) => {
          throw new Error(err.message)
        })
      return result
    } else {
      return []
    }
  }

  getPublic = async (page: number = 1): Promise<StockImageTypes[]> => {
    if (this.user) {
      const result = await fetch(`${this.apiURL}/file/public/${page}`, {
        headers: await this.getHeader(this.user)
      }).then((res) => res.json())
      return result
    }
    return []
  }

  upload = async (
    file: File,
    onUploadProgress?: (progress: number) => void
  ): Promise<StockImageTypes> => {
    if (this.user) {
      const token = await this.user.getIdToken()
      const data = new FormData()
      data.append('file', file)
      const result = await axios.put<StockImageTypes>(
        `${this.apiURL}/file/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progress: ProgressEvent) => {
            const percent = progress.loaded / progress.total
            onUploadProgress?.(Math.round(percent * 10000) / 100)
          }
        }
      )
      return result.data
    } else {
      throw new Error('please sign in')
    }
  }

  update = async (
    _id: string,
    data: StockImageOptionsTypes
  ): Promise<StockImageTypes | null> => {
    if (this.user) {
      const res = await fetch(`${this.apiURL}/file/`, {
        method: 'PATCH',
        headers: await this.getHeader(this.user, {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ _id, content: data })
      }).then((res) => res.json())
      return res
    }
    return null
  }

  remove = async (_id: string) => {
    if (this.user) {
      const res = await fetch(`${this.apiURL}/file/id/${_id}`, {
        method: 'DELETE',
        headers: await this.getHeader(this.user)
      }).then((res) => res.json())
      return res
    }
  }

  keep = async (_id: string): Promise<StockImageTypes | null> => {
    if (this.user) {
      const res = await fetch(`${this.apiURL}/file/keep/${_id}`, {
        method: 'PUT',
        headers: await this.getHeader(this.user)
      }).then(
        (res) => res.json(),
        (err) => console.log(err)
      )
      return res
    }
    return null
  }

  getTag = () => {
    return []
  }

  private toDataURL(url: string): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        .catch(() => reject(new Error('Fail to load image from URL')))
    })
  }

  private dataURLtoFile(
    dataurl: string,
    onRejected?: (err: Error) => void
  ): File | null {
    var arr = dataurl.split(','),
      mime = arr[0]?.match(/:(.*?);/)?.[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    if (mime && /image/.test(mime)) {
      const filename =
        Date.now().toString() + '.' + mime.split('/')[1].toLowerCase()
      return new File([u8arr], filename, { type: mime })
    } else {
      onRejected?.(new Error('Invalid type'))
      return null
    }
  }

  fromURL = (url: string): Promise<File | null> => {
    return new Promise(async (resolved, reject) => {
      const buffer = await this.toDataURL(url).catch((err) => {
        reject(err)
      })
      if (typeof buffer === 'string') {
        const file = this.dataURLtoFile(buffer, (err) => {
          reject(err)
        })
        resolved(file)
      } else {
        reject(new Error('invalid URL'))
      }
    })
  }
}
