import type { Metadata } from 'next';
import { Michroma } from 'next/font/google';
import Header from './_layout/Header';
import './globals.css';
import { darkTheme } from '@/theme';
import { ThemeProvider } from '@mui/material';

const font = Michroma({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Stellar',
	description: 'オリジナル音声AI生成サイト',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<ThemeProvider theme={darkTheme}>
				<body className={font.className}>
					<Header />
					{children}
				</body>
			</ThemeProvider>
		</html>
	);
}
