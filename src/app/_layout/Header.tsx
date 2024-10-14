'use client';
import React, { useState } from 'react';
import {
	AppBar,
	Toolbar,
	Box,
	Drawer,
	List,
	ListItem,
	IconButton,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // メニューアイコン
import CloseIcon from '@mui/icons-material/Close'; // 閉じるアイコン
import Link from 'next/link';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

const CustomDrawer = styled(Drawer)({
	'& .MuiPaper-root': {
		boxShadow: 'none',
		backgroundColor: '#1a1a1a',
	},
	'& .MuiList-root': {
		padding: '20px',
	},
	'& .MuiListItem-root': {
		padding: '10px 20px',
		'&:hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.1)',
		},
	},
	'& .MuiTypography-root': {
		fontSize: '1.2rem',
	},
});

const CustomTypography = styled(Typography)({
	fontFamily: '',
	color: '#fff',
	position: 'relative',
	overflow: 'hidden',
	backgroundColor: '#1a1a1a',
	zIndex: 11,
	'&::before': {
		content: '""',
		position: 'absolute',
		width: '101%',
		height: '90%',
		backgroundColor: '#fff',
		zIndex: -1,
		transform: 'translateX(-100%)', // 初期位置を左端に設定
		transition: 'transform 0.3s ease', // スムーズなトランジションを追加
	},
	'&:hover': {
		color: '#1a1a1a', // ホバー時のテキスト色
		'&::before': {
			transform: 'translateX(0)', // ホバー時に背景を左からスライドさせる
		},
	},
});

const CustomLink = styled(Link)({
	textDecoration: 'none'
});


export default function Header() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	return (
		<Box>
			{/* AppBar */}
			<AppBar
				position="fixed"
				sx={{
					bgcolor: 'black',
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar>
					{/* ハンバーガーメニューボタン */}
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer}
						sx={{ fontSize: '3rem !important' }}
					>
						{/* 開閉状態に応じてアイコンを切り替え */}
						{isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
					</IconButton>

					<div
						style={{
							position: 'relative',
							width: '90px',
							height: '30px',
						}}
					>
						<Link href="/">
							<Image
								src="/title.png"
								alt="タイトル"
								fill
								sizes="(max-width: 80px)"
							/>
						</Link>
					</div>
				</Toolbar>
			</AppBar>

			{/* Drawer */}
			<Box sx={{ margin: '64px 0 0 0' }}>
				<CustomDrawer
					anchor="left"
					open={isDrawerOpen}
					onClose={toggleDrawer}
					sx={{
						zIndex: (theme) => theme.zIndex.appBar - 1,
					}}
				>
					<List
						sx={{
							margin: '70px 0 0 0',
							width: '280px',
							backgroundColor: 'none',
						}}
					>
						<ListItem onClick={toggleDrawer}>
							<CustomLink href="/create-voice">
								<CustomTypography>音声モデル生成</CustomTypography>
							</CustomLink>
						</ListItem>
						<ListItem onClick={toggleDrawer}>
							<CustomLink href="/create-model">
								<CustomTypography>性格モデル使用</CustomTypography>
							</CustomLink>
						</ListItem>
						<ListItem onClick={toggleDrawer}>
							<CustomLink href="/use-ai">
								<CustomTypography>AI使用</CustomTypography>
							</CustomLink>
						</ListItem>
						<ListItem onClick={toggleDrawer}>
							<CustomLink href="/ai-assistant">
								<CustomTypography>AIアシスタント</CustomTypography>
							</CustomLink>
						</ListItem>
					</List>
				</CustomDrawer>
			</Box>
		</Box>
	);
}
