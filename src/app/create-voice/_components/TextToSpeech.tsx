// src/app/_component/TextToSpeech.tsx
'use client';

import { Box, Typography } from '@mui/material';

interface TextToSpeechProps {
	voiceId: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = () => {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			padding={10}
		>
			<Typography variant="h6">音声モデルの生成が完了しました</Typography>
		</Box>
	);
};

export default TextToSpeech;
