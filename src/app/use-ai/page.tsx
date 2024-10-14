'use client';
import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import {
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Modal,
	Typography,
} from '@mui/material';

// 型定義
interface AudioModel {
	voice_id: string;
	name: string;
}

interface AssistantModel {
	id: string;
	name: string;
	instructions?: string;
	model: string; // OpenAIのモデル名を含む
}

interface Message {
	sender: 'user' | 'assistant';
	content: string;
	audioUrl?: string;
}

export default function ApiAi() {
	const [voiceModel, setVoiceModel] = useState<string>(''); // 音声モデルの選択状態
	const [textModel, setTextModel] = useState<string>(''); // テキストモデルの選択状態
	const [audioModels, setAudioModels] = useState<AudioModel[]>([]); // 音声モデルのリスト
	const [assistantModels, setAssistantModels] = useState<AssistantModel[]>([]); // テキストモデルのリスト
	const [loadingAudio, setLoadingAudio] = useState<boolean>(true); // 音声モデル読み込み状態
	const [loadingText, setLoadingText] = useState<boolean>(true); // テキストモデル読み込み状態
	const [userMessage, setUserMessage] = useState<string>(''); // ユーザーのメッセージ
	const [messages, setMessages] = useState<Message[]>([]); // チャット履歴
	const [sending, setSending] = useState<boolean>(false); // メッセージ送信中かどうか

	// モーダルの開閉状態を管理するステート
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// 音声モデルを取得する関数
	useEffect(() => {
		const fetchAudioModels = async () => {
			try {
				const response = await fetch('/api/get-audio-models');
				const data = await response.json();

				console.log('Fetched Audio Models:', data);

				if (data && data.models) {
					setAudioModels(data.models);
				} else {
					console.error('Failed to load audio models: no data.');
				}
			} catch (error) {
				console.error('Failed to load audio models:', error);
			} finally {
				setLoadingAudio(false);
			}
		};
		fetchAudioModels();
	}, []);

	// テキストモデルを取得する関数
	useEffect(() => {
		const fetchAssistantModels = async () => {
			try {
				const response = await fetch('/api/get-assistant-models');
				const data = await response.json();

				console.log('Fetched Assistant Models:', data);

				if (data && data.models) {
					setAssistantModels(data.models);
				} else {
					console.error('Failed to load assistant models: no data.');
				}
			} catch (error) {
				console.error('Failed to load assistant models:', error);
			} finally {
				setLoadingText(false);
			}
		};
		fetchAssistantModels();
	}, []);

	// 音声モデルが変更された際に呼ばれるハンドラー
	const handleVoiceModelChange = (event: SelectChangeEvent<string>) => {
		setVoiceModel(event.target.value);
	};

	// テキストモデルが変更された際に呼ばれるハンドラー
	const handleTextModelChange = (event: SelectChangeEvent<string>) => {
		setTextModel(event.target.value);
	};

	// モーダルを開く関数
	const handleOpenModal = () => {
		if (!voiceModel || !textModel) {
			alert('音声モデルとテキストモデルを選択してください。');
			return;
		}
		setIsModalOpen(true);
	};

	// モーダルを閉じる関数
	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const generateEmbedCode = () => {
		const embedCode = `
			<script src="http://localhost:3000/chatbot.bundle.js"></script>
			<script>
				document.addEventListener('DOMContentLoaded', function() {
					initializeChatbot({
						textModelId: '${textModel}',
						voiceModelId: '${voiceModel}',
						apiUrl: 'http://localhost:3000/api/chatbot'
					});
				});
			</script>
		`;
		return embedCode.trim();
	};

	// メッセージを送信する関数
	const handleSendMessage = async () => {
		if (!textModel || !userMessage.trim()) {
			alert('テキストモデルとメッセージを入力してください。');
			return;
		}

		// 選択されたモデルを取得
		const selectedModel = assistantModels.find(
			(model) => model.id === textModel
		);
		if (!selectedModel) {
			alert('選択されたテキストモデルが見つかりません。');
			return;
		}

		const instructions =
			selectedModel.instructions || 'あなたは有能なアシスタントです。';
		console.log(instructions);
		const openAiModelName = selectedModel.model || 'gpt-4o-mini';

		// ユーザーのメッセージをチャット履歴に追加
		const userMsg: Message = {
			sender: 'user',
			content: userMessage,
		};
		setMessages((prevMessages) => [...prevMessages, userMsg]);

		setSending(true);

		try {
			const response = await fetch('/api/send-message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: openAiModelName, // OpenAIのモデル名を送信
					message: userMessage,
					previousMessages: messages,
					instructions: instructions,
				}),
			});
			const data = await response.json();

			console.log('Response from text model:', data);

			if (data && data.response) {
				// アシスタントの返信をチャット履歴に追加
				const assistantMessage: Message = {
					sender: 'assistant',
					content: data.response,
				};

				setMessages((prevMessages) => [...prevMessages, assistantMessage]);

				// 音声を生成する関数を呼び出す
				await generateAudio(assistantMessage);
			} else {
				console.error('No response from assistant.');
			}
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			setSending(false);
			setUserMessage(''); // メッセージ入力欄をクリア
		}
	};

	// 音声を生成する関数
	const generateAudio = async (message: Message) => {
		if (!voiceModel) {
			console.warn('音声モデルが選択されていません。');
			return;
		}

		try {
			const response = await fetch('/api/generate-audio', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					voiceId: voiceModel,
					text: message.content,
				}),
			});

			if (!response.ok) {
				throw new Error('音声生成に失敗しました。');
			}

			const blob = await response.blob();
			const audioUrl = URL.createObjectURL(blob);

			// メッセージに音声のURLを追加
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg === message ? { ...msg, audioUrl } : msg
				)
			);

			// 音声を再生
			const audio = new Audio(audioUrl);
			audio.play();
		} catch (error) {
			console.error('Failed to generate audio:', error);
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '82vh',
				padding: '2rem',
				justifyContent: 'flex-end',
				alignItems: 'center',
			}}
		>
			{/* モデル選択エリア */}
			<Box
				sx={{
					maxWidth: '1200px',
					width: '100%',
					display: 'flex',
					gap: '1rem',
					marginBottom: '1rem',
				}}
			>
				{/* 音声モデルの選択 */}
				<FormControl fullWidth>
					<InputLabel id="voice-model-label">音声モデル</InputLabel>
					<Select
						labelId="voice-model-label"
						id="voice-model"
						value={voiceModel}
						label="音声モデル"
						onChange={handleVoiceModelChange}
					>
						{loadingAudio ? (
							<MenuItem value="">読み込み中...</MenuItem>
						) : audioModels.length > 0 ? (
							audioModels.map((model) => (
								<MenuItem key={model.voice_id} value={model.voice_id}>
									{model.name}
								</MenuItem>
							))
						) : (
							<MenuItem value="">音声モデルが見つかりません</MenuItem>
						)}
					</Select>
				</FormControl>

				{/* テキストモデルの選択 */}
				<FormControl fullWidth>
					<InputLabel id="text-model-label">テキストモデル</InputLabel>
					<Select
						labelId="text-model-label"
						id="text-model"
						value={textModel}
						label="テキストモデル"
						onChange={handleTextModelChange}
					>
						{loadingText ? (
							<MenuItem value="">読み込み中...</MenuItem>
						) : assistantModels.length > 0 ? (
							assistantModels.map((model) => (
								<MenuItem key={model.id} value={model.id}>
									{model.name}
								</MenuItem>
							))
						) : (
							<MenuItem value="">テキストモデルが見つかりません</MenuItem>
						)}
					</Select>
				</FormControl>

				{/* チャットボット作成ボタンを追加 */}
				<Button
					variant="contained"
					color="primary"
					onClick={handleOpenModal}
					sx={{ height: '56px' }} // ボタンの高さを他の入力欄と揃える
				>
					作成
				</Button>
			</Box>

			{/* チャット表示エリア */}
			<Box
				sx={{
					maxWidth: '1200px',
					width: '100%',
					flexGrow: 1,
					overflowY: 'auto',
					marginBottom: '1rem',
					padding: '1rem',
					border: '1px solid #ccc',
					borderRadius: '4px',
				}}
			>
				{messages.map((msg, index) => (
					<Box
						key={index}
						sx={{
							margin: '0.5rem 0',
							textAlign: msg.sender === 'user' ? 'right' : 'left',
						}}
					>
						<strong>
							{msg.sender === 'user' ? 'あなた' : 'アシスタント'}:
						</strong>{' '}
						{msg.content}
						{/* アシスタントのメッセージに音声再生ボタンを追加 */}
						{msg.sender === 'assistant' && msg.audioUrl && (
							<Button
								variant="outlined"
								size="small"
								onClick={() => {
									const audio = new Audio(msg.audioUrl!);
									audio.play();
								}}
								sx={{ marginLeft: '1rem' }}
							>
								再生
							</Button>
						)}
					</Box>
				))}
			</Box>

			{/* チャット入力エリア */}
			<Box
				sx={{
					display: 'flex',
					gap: '1rem',
					maxWidth: '1200px',
					width: '100%',
				}}
			>
				<TextField
					fullWidth
					label="メッセージを入力"
					multiline
					rows={1}
					value={userMessage}
					onChange={(e) => setUserMessage(e.target.value)}
					disabled={sending}
				/>
				<Button
					variant="contained"
					onClick={handleSendMessage}
					disabled={sending}
				>
					{sending ? '送信中...' : '送信'}
				</Button>
			</Box>

			{/* モーダル */}
			<Modal open={isModalOpen} onClose={handleCloseModal}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 600,
						bgcolor: 'background.paper',
						borderRadius: 1,
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography variant="h6" component="h2">
						埋め込み用コード
					</Typography>
					<TextField
						multiline
						fullWidth
						rows={10}
						variant="outlined"
						value={generateEmbedCode()}
						sx={{ mt: 2 }}
					/>
					<Button
						variant="contained"
						onClick={() => {
							navigator.clipboard.writeText(generateEmbedCode());
							alert('コードをコピーしました。');
						}}
						sx={{ mt: 2 }}
					>
						コードをコピー
					</Button>
				</Box>
			</Modal>
		</Box>
	);
}
