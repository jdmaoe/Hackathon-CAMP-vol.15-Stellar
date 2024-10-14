import { NextResponse } from 'next/server';
import axios from 'axios';
import { Buffer } from 'buffer'; // Buffer をインポート

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// アシスタントIDに基づいた指示を取得する関数
async function getAssistantInstructions(
	textModelId: string,
	apiKey: string
): Promise<string> {
	const assistantDetailsUrl = `https://api.openai.com/v1/assistants/${textModelId}`;

	try {
		const response = await axios.get(assistantDetailsUrl, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'OpenAI-Beta': 'assistants=v2', // 必要に応じて適切なヘッダーを設定
			},
		});

		if (response.status === 200 && response.data.instructions) {
			return response.data.instructions;
		} else {
			console.warn(
				`Assistant instructions not found for ID ${textModelId}. Using default instruction.`
			);
			return 'あなたは有能なアシスタントです。';
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				`Error fetching assistant instructions for ID ${textModelId}:`,
				error.response?.data || error.message
			);
		} else if (error instanceof Error) {
			console.error(
				`Error fetching assistant instructions for ID ${textModelId}:`,
				error.message
			);
		} else {
			console.error(
				`Unknown error occurred while fetching assistant instructions for ID ${textModelId}`
			);
		}
		return 'あなたは有能なアシスタントです。';
	}
}

// CORS ヘッダーを設定するヘルパー関数
function setCORSHeaders(response: NextResponse) {
	response.headers.set('Access-Control-Allow-Origin', '*'); // 必要に応じてオリジンを制限してください
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	return response;
}

// OPTIONS メソッドのハンドラ
export async function OPTIONS() {
	const response = new NextResponse(null, { status: 200 });
	return setCORSHeaders(response);
}

// POST メソッドのハンドラ
export async function POST(request: Request) {
	try {
		const { message, textModelId, voiceModelId } = await request.json();

		// 入力チェック
		if (!message || !textModelId || !voiceModelId) {
			console.warn('Invalid request:', { message, textModelId, voiceModelId });
			return setCORSHeaders(
				NextResponse.json(
					{
						error:
							'Invalid request: model ID, voice ID, and message are required.',
					},
					{ status: 400 }
				)
			);
		}

		// OpenAI API キーの確認
		if (!OPENAI_API_KEY) {
			console.error('OpenAI APIキーが設定されていません。');
			return setCORSHeaders(
				NextResponse.json(
					{ error: 'OpenAI APIキーが設定されていません。' },
					{ status: 500 }
				)
			);
		}

		// ElevenLabs API キーの確認
		if (!ELEVENLABS_API_KEY) {
			console.error('ElevenLabsのAPIキーが設定されていません。');
			return setCORSHeaders(
				NextResponse.json(
					{ error: 'ElevenLabsのAPIキーが設定されていません。' },
					{ status: 500 }
				)
			);
		}

		// アシスタントIDに基づいた指示を取得
		const assistantInstructions = await getAssistantInstructions(
			textModelId,
			OPENAI_API_KEY
		);

		// メッセージペイロードの構築
		const messagesPayload = [
			{
				role: 'system',
				content: assistantInstructions,
			},
			{
				role: 'user',
				content: message,
			},
		];

		// OpenAI API へのリクエスト
		const openAiResponse = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4o-mini', // 有効なモデル名を使用
				messages: messagesPayload,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
			}
		);

		const assistantMessage =
			openAiResponse.data.choices[0]?.message?.content ||
			'No response from assistant.';

		// ElevenLabs API へのリクエスト（音声生成）
		const audioResponse = await axios.post(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceModelId}`,
			{
				text: assistantMessage,
				model_id: 'eleven_multilingual_v2', // モデルをMultilingual v2に変更
				voice_settings: {
					stability: 1.0, // Stabilityを100%に設定
					similarity_boost: 1.0, // Similarityを100%に設定
					style: 0.5, // Styleを50%に設定
				},
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'xi-api-key': ELEVENLABS_API_KEY,
				},
				responseType: 'arraybuffer',
			}
		);

		if (audioResponse.status !== 200) {
			throw new Error(`ElevenLabs API Error: ${audioResponse.statusText}`);
		}

		// 音声データを Base64 に変換
		const audioBase64 = Buffer.from(audioResponse.data, 'binary').toString(
			'base64'
		);
		const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

		// 成功レスポンス
		return setCORSHeaders(
			NextResponse.json({
				response: assistantMessage,
				audioUrl,
			})
		);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				'Error in chatbot API:',
				error.response?.data || error.message
			);
		} else if (error instanceof Error) {
			console.error('Error in chatbot API:', error.message);
		} else {
			console.error('Unknown error occurred in chatbot API');
		}

		// エラーレスポンスを返す
		const errorMessage = axios.isAxiosError(error)
			? error.response?.data?.error?.message || error.message
			: error instanceof Error
				? error.message
				: 'Unknown error';

		return setCORSHeaders(
			NextResponse.json(
				{ error: 'Failed to process the message.', details: errorMessage },
				{ status: 500 }
			)
		);
	}
}
