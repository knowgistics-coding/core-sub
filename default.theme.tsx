import { darken, ThemeOptions } from '@mui/material'
import { grey } from '@mui/material/colors'

declare module '@mui/material/styles' {
  /**
   * SHAPE
   */
  interface Theme {
    toolbarHeight: number
    sidebarWidth: number
  }
  interface ThemeOptions {
    toolbarHeight?: number
    sidebarWidth?: number
  }
  /**
   * PALETTE
   */
  interface Palette {
    neutral: Palette['primary']
    light: Palette['primary']
    gradient: Palette['primary']
    duotone: {
      '--fa-primary-color': string
      '--fa-secondary-color': string
    }
    appbar: {
      backgroundColor: string
      borderBottom: string
      color: Palette['primary']['main']
    }
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
    light?: PaletteOptions['primary']
    gradient?: PaletteOptions['primary']
    duotone?: {
      '--fa-primary-color': string
      '--fa-secondary-color': string
    }
    appbar?: {
      backgroundColor?: string
      borderBottom?: string
      color?: Palette['primary']['main']
    }
  }

  interface BreakpointOverrides {
    post: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
    light: true
  }
}

declare module '@mui/material/Container' {
  interface ContainerPropsMaxWidthOverrides {
    post: true
  }
}

export const defaultTheme: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1920,
      post: 704
    }
  },
  palette: {
    neutral: {
      main: grey[600],
      contrastText: '#fff'
    },
    light: {
      main: '#fff',
      contrastText: '#333'
    },
    secondary: { main: '#C73D5D' },
    error: { main: '#DC4E34' },
    success: { main: '#6E953B' },
    warning: { main: '#EEA320' },
    primary: { main: '#3C77AE' },
    common: {
      black: '#2C261E'
    },
    gradient: {
      main: `linear-gradient(45deg, ${darken('#3C77AE', 0.5)} 0%, #3C77AE 100%)`
    },
    duotone: {
      '--fa-primary-color': '#3C77AE',
      '--fa-secondary-color': '#EEA320'
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b'
      // primary: '#666'
    },
    appbar: {
      backgroundColor: 'white',
      borderBottom: `solid 1px ${grey[300]}`,
      color: `#1d1d1f`
    }
  },
  typography: {
    body1: {
      fontSize: 18,
      lineHeight: 1.5
    },
    body2: {
      fontSize: 16,
      lineHeight: 1.5
    },
    h1: {
      fontSize: 72,
      fontWeight: 'bold',
      fontFamily: `"Kanit", "Roboto", "Helvetica", "Arial", sans-serif`,
      lineHeight: 1.1
    },
    h2: {
      fontSize: 60,
      fontWeight: 'bold',
      fontFamily: `"Kanit", "Roboto", "Helvetica", "Arial", sans-serif`,
      lineHeight: 1.1
    },
    h3: {
      fontSize: 48,
      fontWeight: 'bold',
      fontFamily: `"Kanit", "Roboto", "Helvetica", "Arial", sans-serif`,
      lineHeight: 1.1
    },
    h4: {
      fontSize: 36,
      fontWeight: 'bold',
      fontFamily: `"Kanit", "Roboto", "Helvetica", "Arial", sans-serif`,
      lineHeight: 1.1
    },
    h5: {
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: `"Kanit", "Roboto", "Helvetica", "Arial", sans-serif`,
      lineHeight: 1.1
    },
    h6: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: `"Kanit", "Roboto", "Helvetica", "Arial", sans-serif`,
      lineHeight: 1.1
    },
    caption: {
      fontSize: 12
    },
    fontFamily: `"Sarabun", "Roboto", "Helvetica", "Arial", sans-serif`,
    htmlFontSize: 16,
    fontSize: 16
  },
  toolbarHeight: 60,
  sidebarWidth: 270,
  components: {
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          fontSize: 16
        },
        sizeMedium: {
          fontSize: 14
        },
        sizeSmall: {
          fontSize: 12
        }
      },
      defaultProps: {
        disableElevation: true
      }
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          minWidth: 42,
          minHeight: 42
        }
      }
    },
    MuiList: {
      defaultProps: {
        disablePadding: true
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36
        }
      }
    }
  }
}
