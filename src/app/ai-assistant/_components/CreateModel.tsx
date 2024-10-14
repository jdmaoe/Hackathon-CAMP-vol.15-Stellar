// src/components/CreateModel.tsx
'use client';
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Paper } from '@mui/material';
import { useBreakPoint } from '@/hooks';

const CreateModel: React.FC = () => {
	const [inputText, setInputText] = useState('');
	const [name, setName] = useState('');
	const [model, setModel] = useState('gpt-3.5');
	const breakpoint = useBreakPoint();

	const handleSubmit = async () => {
		if (!name.trim() || !inputText.trim()) {
			alert('Assistant Name と System Instructions を入力してください。');
			return;
		}

		try {
			const response = await fetch('/api/create-assistant', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, systemInstructions: inputText, model }),
			});
			const data = await response.json();
			if (response.ok) {
				console.log(`Assistant Created: ${data.assistantId}`);
				alert(`Assistant Created: ${data.assistantId}`);
				// 必要に応じてフォームをリセット
				setName('');
				setInputText('');
				setModel('gpt-3.5');
			} else {
				console.error(`Error: ${data.message}`);
				alert(`Error: ${data.message}`);
			}
		} catch (error) {
			console.error('Network or server error:', error);
			alert('ネットワークまたはサーバーエラーが発生しました。');
		}
	};

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap="20px"
			width={['xs'].includes(breakpoint) ? '90%' : '80%'}
			padding="20px 0px"
			margin="0 auto"
			borderRadius="10px"
		>
			<Paper
				elevation={2}
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '30px 0',
				}}
			>
				Create AI Assistant
			</Paper>
			<TextField
				fullWidth
				label="Assistant Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				sx={{ marginBottom: '1rem' }}
			/>
			<TextField
				fullWidth
				select
				label="Model"
				value={model}
				onChange={(e) => setModel(e.target.value)}
				sx={{ marginBottom: '1rem' }}
			>
				<MenuItem value="gpt-4o">GPT-4o</MenuItem>
				<MenuItem value="gpt-4o-mini">GPT-4o-mini</MenuItem>
			</TextField>
			<TextField
				fullWidth
				multiline
				rows={4}
				label="System Instructions"
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				placeholder="Enter system instructions here"
				sx={{ marginBottom: '1rem' }}
			/>
			<Button variant="contained" onClick={handleSubmit}>
				Create Assistant
			</Button>
		</Box>
	);
};

export default CreateModel;
