'use client';
import { createTheme } from '@mui/material';
import { blue } from '@mui/material/colors';

export const darkTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: blue[400],
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: `
            ::-webkit-scrollbar{
                width: 10px;
				max-width: 2vw;
            },
            ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
				border-radius: 5px;
            },
            ::-webkit-scrollbar-track {
                background-color: transparent;
            }
            `,
		},
	},
});
