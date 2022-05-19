import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  createTheme,
  darken,
  Theme,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery
} from '@mui/material'
import { deepmerge } from '@mui/utils'
import { defaultTheme } from './default.theme'
import { useTranslation } from 'react-i18next'
import { initI18Next, loadFromFB } from './Translate'
import { FirebaseApp } from 'firebase/app'
import {
  Auth,
  User,
  IdTokenResult,
  getAuth,
  onIdTokenChanged
} from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'
import { Alerts } from './Alerts'
import { Link, LinkProps } from 'react-router-dom'
import { library, IconProp, IconPack } from '@fortawesome/fontawesome-svg-core'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import i18next from 'i18next'

library.add(fad as IconPack, far as IconPack)

console.log(`Document: https://phra-in.web.app`)

initI18Next()

export interface CoreProvider {
  theme?: ThemeOptions
  firebaseConfig?: { [key: string]: string }
  firebaseApp: FirebaseApp
  Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >
  onSettingChange?: (key: string, value: any) => void
  sitename?: string
  logo?: string
  logoComponent?: string
  startActions?: React.ReactNode
  endActions?: React.ReactNode
  profileMenu?: React.ReactNode
  appMenu?: {
    icon?: IconProp
    label?: React.ReactNode
    to?: LinkProps['to']
    href?: string
    type: 'Link' | 'a' | 'divider'
  }[]
}
export interface CoreContextTypes extends Omit<CoreProvider, 'firebaseApp'> {
  firebaseApp?: CoreProvider['firebaseApp']
  isMobile: boolean
  theme: Theme
  t: (text: string, dict?: { [key: string]: string }) => string
  fb: null | {
    auth: Auth
    db: Firestore
  }
  user: {
    loading: boolean
    data: User | null
    claims: IdTokenResult | null
  }
  setUser: (data: User | null) => void
}

const CoreContext = createContext<CoreContextTypes>({
  isMobile: false,
  theme: createTheme({}),
  t: () => '',
  fb: null,
  user: {
    loading: true,
    data: null,
    claims: null
  },
  setUser: () => {},
  Link: Link,
  sitename: '',
  logo: ''
})

export const CoreProvider = (props: { children: ReactNode } & CoreProvider) => {
  const { t } = useTranslation()
  const [fb, setFB] = useState<CoreContextTypes['fb']>(null)
  const [user, setUser] = useState<CoreContextTypes['user']>({
    loading: true,
    data: null,
    claims: null
  })

  if (props?.theme?.palette?.primary) {
    const primary = props?.theme?.palette?.primary as any
    if (primary.main) {
      props.theme.palette.gradient = {
        main: `linear-gradient(45deg, ${darken(primary.main, 0.5)} 0%, ${
          primary.main
        } 100%)`
      }
    }
  }
  const theme = createTheme(deepmerge(defaultTheme, props.theme))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const store = {
    ...props,
    isMobile,
    theme,
    fb,
    user,
    setUser: (data: User | null) => setUser((s) => ({ ...s, data })),
    t
  }

  useEffect(() => {
    if (props.firebaseApp) {
      const auth = getAuth(props.firebaseApp)
      const db = getFirestore(props.firebaseApp)
      if (auth && db) {
        setFB((s) => ({ ...s, auth: auth, db: db }))
      }

      loadFromFB(db).then((langs) => {
        langs.forEach(({ name, value }) =>
          i18next.addResourceBundle(name, 'translation', value)
        )
        const current = i18next.language
        i18next.changeLanguage(current)
      })
      const unwatchIdTokenChanged = onIdTokenChanged(auth, async (data) => {
        if (data) {
          const claims = await data.getIdTokenResult(true)
          setUser((s) => ({ ...s, loading: false, data: data, claims: claims }))
        } else {
          setUser((s) => ({ ...s, loading: false, data: null, claims: null }))
        }
      })
      return () => unwatchIdTokenChanged()
    } else {
      return () => {}
    }
  }, [props.firebaseApp])

  useEffect(() => {
    if (props.firebaseConfig) {
      console.warn(
        'CoreProvider firebaseConfig is deprecated. please change to app'
      )
    }
  }, [props.firebaseConfig])

  return (
    <ThemeProvider theme={theme}>
      <Alerts>
        <CoreContext.Provider value={store}>
          {props.children}
        </CoreContext.Provider>
      </Alerts>
    </ThemeProvider>
  )
}

export const useCore = () => useContext(CoreContext)
