'use client';
import { useState } from 'react';
import Recorder from './_components/Recorder';
import TextToSpeech from './_components/TextToSpeech';
import { Box } from '@mui/material';

const HomePage = () => {
	const [voiceId, setVoiceId] = useState('');

	const handleVoiceId = (id: string) => {
		setVoiceId(id);
	};

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap="30px"
			width="100%"
			maxWidth="2000px"
			margin="0 auto"
		>
			<h1>音声AI生成アプリ</h1>
			{!voiceId ? (
				<Recorder onVoiceIdReceived={handleVoiceId} />
			) : (
				<TextToSpeech voiceId={voiceId} />
			)}
		</Box>
	);
};

export default HomePage;
