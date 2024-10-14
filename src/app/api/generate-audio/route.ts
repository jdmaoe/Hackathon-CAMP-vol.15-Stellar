// src/app/api/generate-audio/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { voiceId, text } = await req.json();

	const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

	if (!voiceId || !text) {
		return NextResponse.json(
			{ message: 'voiceIdとtextが必要です' },
			{ status: 400 }
		);
	}

	if (!ELEVENLABS_API_KEY) {
		return NextResponse.json(
			{ message: 'APIキーが設定されていません' },
			{ status: 500 }
		);
	}

	try {
		const response = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
			{
				method: 'POST',
				headers: {
					'xi-api-key': ELEVENLABS_API_KEY,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text,
					model_id: 'eleven_multilingual_v2', // モデルをMultilingual v2に変更
					voice_settings: {
						stability: 1.0, // Stabilityを100%に設定
						similarity_boost: 1.0, // Similarityを100%に設定
						style: 0.5, // Styleを50%に設定
					},
				}),
			}
		);

		if (response.ok) {
			const audioBuffer = await response.arrayBuffer();
			return new Response(audioBuffer, {
				headers: { 'Content-Type': 'audio/mpeg' },
			});
		} else {
			const errorData = await response.json();
			console.error('音声合成エラー:', errorData);
			return NextResponse.json(
				{ message: '音声合成に失敗しました' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('音声合成中にエラーが発生しました:', error);
		return NextResponse.json(
			{ message: '音声合成中にエラーが発生しました' },
			{ status: 500 }
		);
	}
}
