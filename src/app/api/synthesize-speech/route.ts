import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
	const { text, voiceId } = await req.json();

	const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;

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
		return new NextResponse(Buffer.from(audioBuffer), {
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
}

// // app/api/synthesize-speech/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export const runtime = 'nodejs'; // Node.js ランタイムを指定

// export async function POST(req: NextRequest) {
//   try {
//     const { text, voiceId } = await req.json();

//     const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

//     if (!ELEVENLABS_API_KEY) {
//       return NextResponse.json({ message: 'APIキーが設定されていません' }, { status: 500 });
//     }

//     const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
//       method: 'POST',
//       headers: {
//         'xi-api-key': ELEVENLABS_API_KEY,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         text,
//       }),
//     });

//     if (response.ok) {
//       const audioBuffer = await response.arrayBuffer();
//       return new NextResponse(Buffer.from(audioBuffer), {
//         headers: { 'Content-Type': 'audio/mpeg' },
//       });
//     } else {
//       const errorData = await response.json();
//       console.error('音声合成エラー:', errorData);
//       return NextResponse.json({ message: '音声合成に失敗しました' }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('サーバーエラー:', error);
//     return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
//   }
// }

// src/app/api/synthesize-speech/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import textToSpeech, { protos } from '@google-cloud/text-to-speech';
// import path from 'path';

// export const runtime = 'nodejs';

// export async function POST(req: NextRequest) {
//   try {
//     const { text } = await req.json();

//     // Google Cloud Text-to-Speech クライアントの作成
//     const client = new textToSpeech.TextToSpeechClient({
//       keyFilename: path.join(process.cwd(), 'gcp-service-account.json'),
//     });

//     // SsmlVoiceGender と AudioEncoding を取得
//     const { SsmlVoiceGender, AudioEncoding } = protos.google.cloud.texttospeech.v1;

//     // リクエストの構築
//     const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
//       input: { text },
//       voice: {
//         languageCode: 'ja-JP',
//         ssmlGender: SsmlVoiceGender.NEUTRAL, // 列挙型を使用
//       },
//       audioConfig: {
//         audioEncoding: AudioEncoding.MP3, // 列挙型を使用
//       },
//     };

//     // 音声合成リクエストの送信
//     const [response] = await client.synthesizeSpeech(request);

//     if (response.audioContent) {
//       return new NextResponse(Buffer.from(response.audioContent), {
//         headers: { 'Content-Type': 'audio/mpeg' },
//       });
//     } else {
//       console.error('音声合成に失敗しました');
//       return NextResponse.json({ message: '音声合成に失敗しました' }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('サーバーエラー:', error);
//     return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
//   }
// }
