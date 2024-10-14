'use client';
import { useBreakPoint } from '@/hooks';
import { Audiotrack, CloudUpload } from '@mui/icons-material';
import {
	Box,
	Button,
	CircularProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	TextField,
} from '@mui/material';
import { useState } from 'react';

interface RecorderProps {
	onVoiceIdReceived: (voiceId: string) => void;
}

const Recorder: React.FC<RecorderProps> = ({ onVoiceIdReceived }) => {
	const breakpoint = useBreakPoint();
	const [files, setFiles] = useState<FileList | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [modelName, setModelName] = useState<string>('');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = event.target.files;
		if (!selectedFiles) return;

		// ファイル数のチェック
		if (selectedFiles.length > 25) {
			setError('ファイルは最大25個までです。');
			return;
		}

		// 各ファイルのサイズと形式のチェック
		for (let i = 0; i < selectedFiles.length; i++) {
			const file = selectedFiles[i];

			if (file.size > 10 * 1024 * 1024) {
				setError('ファイルサイズは10MB以内である必要があります。');
				return;
			}

			const validFormats = ['audio/mpeg', 'audio/mp3', 'video/mp4'];
			if (!validFormats.includes(file.type)) {
				setError('対応ファイル形式はmp3およびmp4です。');
				return;
			}
		}

		// エラーがない場合、ファイルをセット
		setFiles(selectedFiles);
		setError(null);
	};

	const uploadFiles = async () => {
		if (!files) {
			setError('ファイルを選択してください。');
			return;
		}
		setIsSending(true);

		try {
			const formData = new FormData();
			Array.from(files).forEach((file) => {
				formData.append('files', file);
			});
			formData.append('modelName', modelName);

			const response = await fetch('/api/upload-audio', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();
			onVoiceIdReceived(data.voiceId);
			setIsSending(false);
		} catch (err) {
			console.error(err);
			setIsSending(false);
		}
	};

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap="30px"
			width={['xs'].includes(breakpoint) ? '90%' : '80%'}
		>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection={['xs'].includes(breakpoint) ? 'column' : 'row'}
				gap="20px"
				width="100%"
			>
				<Button variant="contained" component="label" endIcon={<CloudUpload />}>
					ファイルを選択
					<input
						type="file"
						accept="audio/*"
						multiple
						hidden
						onChange={handleFileChange}
					/>
				</Button>
				<TextField
					variant="outlined"
					size="small"
					label="音声モデル名を入力"
					value={modelName}
					onChange={(e) => setModelName(e.target.value)}
				/>
			</Box>

			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
				gap="30px"
				width="100%"
			>
				{files && (
					<Box
						sx={{
							width: '100%',
						}}
					>
						<List
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '10px',
							}}
						>
							{Array.from(files).map((file, index) => (
								<ListItem
									key={index}
									sx={{
										backgroundColor: '#000',
										borderRadius: '35px',
									}}
								>
									<ListItemText
										primary={file.name}
										secondary={`サイズ: ${(file.size / (1024 * 1024)).toFixed(2)} MB`}
										primaryTypographyProps={{
											color: '#fff',
										}}
										secondaryTypographyProps={{
											color: '#fff',
										}}
									/>
									<ListItemIcon>
										<Audiotrack
											sx={{
												color: '#fff',
											}}
										/>
									</ListItemIcon>
								</ListItem>
							))}
						</List>
					</Box>
				)}
			</Box>

			{error && <p style={{ color: 'red' }}>{error}</p>}
			{!isSending ? (
				<button onClick={uploadFiles} disabled={!files}>
					ファイルをアップロード
				</button>
			) : (
				<CircularProgress />
			)}
		</Box>
	);
};

export default Recorder;
