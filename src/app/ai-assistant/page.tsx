// src/pages/ai-assistant.tsx
'use client';

import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import Recorder from './_components/Recorder';
import TextToSpeech from './_components/TextToSpeech';
import CreateModel from './_components/CreateModel';
import ApiAi from './_components/ApiAi'; // 新規作成した ApiAi コンポーネントをインポート
import { useBreakPoint } from '@/hooks';

const AiAssistantPage = () => {
	const [voiceId, setVoiceId] = useState<string>('');
	const breakpoint = useBreakPoint();

	const handleVoiceIdReceived = (id: string) => {
		setVoiceId(id);
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
				padding: '2rem',
				boxSizing: 'border-box',
			}}
		>
			<Grid container spacing={2} sx={{ height: '100%', margin: '0 auto' }}>
				{/* 左側: 30% */}
				<Grid
					item
					xs={12}
					md={4}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '2rem',
						margin: '0 auto',
					}}
				>
					{/* 上部: Recorder */}
					<Box>
						<Typography
							variant="h6"
							width={['xs'].includes(breakpoint) ? '90%' : '80%'}
							sx={{
								margin: '0 auto',
							}}
						>
							音声録音
						</Typography>
						{!voiceId ? (
							<Recorder onVoiceIdReceived={handleVoiceIdReceived} />
						) : (
							<>
								<Box
									display="flex"
									justifyContent="center"
									alignItems="center"
									gap="20px"
									flexDirection="column"
									width="80%"
									margin="0 auto"
								>
									<TextToSpeech voiceId={voiceId} />
									<Button
										fullWidth
										size="small"
										variant="contained"
										onClick={() => setVoiceId('')}
									>
										もう一度生成する
									</Button>
								</Box>
							</>
						)}
					</Box>

					{/* 下部: CreateModel */}
					<Box sx={{ flex: '1 1 auto' }}>
						<Typography
							variant="h6"
							width={['xs'].includes(breakpoint) ? '90%' : '80%'}
							sx={{
								margin: '0 auto',
							}}
						>
							モデル作成
						</Typography>
						<CreateModel />
					</Box>
				</Grid>

				{/* 右側: 70% */}
				<Grid
					item
					xs={12}
					md={8}
					sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
				>
					<Typography
						variant="h6"
						width={['xs'].includes(breakpoint) ? '90%' : '80%'}
						sx={{
							margin: '0 auto',
						}}
					>
						AI インターフェース
					</Typography>
					<ApiAi />
				</Grid>
			</Grid>
		</Box>
	);
};

export default AiAssistantPage;
