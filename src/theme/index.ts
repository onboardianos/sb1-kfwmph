import { createTheme } from "@mui/material";

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    rounded: true,
    flat: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    ghost: true,
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true; 
  }
}

const theme = createTheme({
  breakpoints:{
    values:{
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920
    }
  },
  typography: {
    fontFamily: [
      'Poppins',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      'main':"#00498B",
      '50':"#F4F9FF",
      '100':"#D8EAFC",
      "300": "#59A3DD",
      "500": "#2A87CE",
      "600": "#005394"
    },
    secondary:{
      main:"#FF5964"
    },
    info:{
      main:'#00498B'
    },
    text: {
      primary: "#595959",
      secondary: "#595959",
    },
    success: {
      main: "#1F9003",
      light: "#10C920"
    },
    grey: {
      A100:'#EFEEF6',
      "100": "#EFF2F5",
      "200": "#EEF0F2",
      "300": "#A6A6A6",
      "400": "#979797",
    },
    error: {
      "main": "#B42318"
    },
    common:{
      black:"#262626"
    }


  },
  components: {
    // Name of the component
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "5px 5px 50px 0px rgba(0,0,0,0.1)"
        }
      },
      variants: [{
        props: { variant: 'rounded' },
        style: {
          borderRadius: 16,
        }
      }, {
        props: { variant: 'flat' },
        style: {
          boxShadow: "none"
        }
      }]
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#33333",
          fontWeight: 600,
          fontSize: 14
        }
      }
    },
    MuiTextField: {
      defaultProps:{
        InputLabelProps:{
          shrink:false
        }
      },
      styleOverrides:{
        'root':{
          '& .MuiOutlinedInput-root':{
            borderRadius: 8
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 8,
          paddingRight: 32,
          paddingLeft: 32,
          paddingTop: 0,
          paddingBottom: 0,
          textTransform: "none",
          boxShadow: "0px 10px 25px 0px rgba(0,0,0,0.2);",
          height: 42,
          fontWeight: 600
        },
        outlined: {
          borderRadius: 8,
          paddingRight: 32,
          paddingLeft: 32,
          paddingTop: 0,
          paddingBottom: 0,
          textTransform: "none",
          height: 42,
          fontWeight: 600
        },
        containedError: {
          color: "white",
          backgroundColor: "#B42318",
          "&:hover": {
            backgroundColor: "#FF7575"
          }
        },
        outlinedSecondary:{
          color: "#212121",
          borderColor: "#212121",
          "&:hover":{
            backgroundColor: "#424242",
            color: "white",
            borderColor: "#424242"
          }
        }
      }
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          padding: 8,
        }
      }
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "5px 5px 50px 0px rgba(0,0,0,0.1)"
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          ":before": {
            display: "none",
          },
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      },
      defaultProps: {
        disableGutters: true
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          marginBottom:16,
          color: "#393939",
          "&.Mui-selected": {
            backgroundColor: "#D8EAFC",
            color: "black"
          }
        },


      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          "& span": {
            fontWeight: 600,
            color: "inherit",
            fontSize:14
          }
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        color: "text.primary"
      }
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#ED058A"
        },
        colorSecondary: {
          backgroundColor: "#10C920",
          ':hover': {
            backgroundColor: "#10C920",
          }
        },
        root: {
          padding: "24px 8px",
          borderRadius: 24,
          fontWeight: 500,

        }
      },
      variants: [{
        props: { variant: 'ghost' },
        style: {
          border: 0,
          backgroundColor: "transparent",
          color: "#979797"
        },
      }, {
        props: { variant: 'outlined' },
        style: {
          border: "1px solid #E6E6E6",
          backgroundColor: "transparent",
          color: "#979797"
        },
      }],
    },
  },
});

export default theme