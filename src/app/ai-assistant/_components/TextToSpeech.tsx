// src/components/TextToSpeech.tsx
'use client';

import { Box, Paper } from '@mui/material';

interface TextToSpeechProps {
	voiceId: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ voiceId }) => {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			padding={2}
			bgcolor="#111"
			borderRadius="8px"
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
				音声モデルの生成が完了しました: {voiceId}
			</Paper>
		</Box>
	);
};

export default TextToSpeech;
