// import { NextRequest, NextResponse } from 'next/server';
// import fetch from 'node-fetch';

// export async function GET(req: NextRequest) {
//     // 環境変数からAPIキーを取得
//     const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

//     // APIキーが正しく設定されていない場合はエラーを返す
//     if (!ELEVENLABS_API_KEY) {
//         return NextResponse.json({ message: 'APIキーが設定されていません' }, { status: 500 });
//     }

//     try {
//         // ElevenLabs APIに音声モデルリストをリクエスト
//         const response = await fetch('https://api.elevenlabs.io/v1/voices', {
//             method: 'GET',
//             headers: {
//                 'xi-api-key': ELEVENLABS_API_KEY,
//             },
//         });

//         // レスポンスが成功したかどうかを確認
//         if (response.ok) {
//             const data = await response.json();

//             // デバッグ用にレスポンスをログに出力して確認
//             console.log('APIレスポンス:', data);

//             // data.voicesが存在しない場合のチェック
//             if (!Array.isArray(data.voices)) {
//                 return NextResponse.json({ message: '音声モデルのデータが見つかりませんでした' }, { status: 500 });
//             }

//             // 成功した場合は音声モデルのリストを返す
//             return NextResponse.json({ models: data.voices });
//         } else {
//             // エラーレスポンスを取得
//             const errorData = await response.json();
//             console.error('音声モデル取得エラー:', errorData);
//             return NextResponse.json({ message: '音声モデルの取得に失敗しました' }, { status: 500 });
//         }
//     } catch (error) {
//         console.error('APIリクエストエラー:', error);
//         return NextResponse.json({ message: '音声モデルの取得中にエラーが発生しました' }, { status: 500 });
//     }
// }

// import { NextResponse } from 'next/server';
// import fetch from 'node-fetch';

// // 音声モデルの型を定義
// interface VoiceModel {
// 	voice_id: string;
// 	name: string;
// 	description: string;
// 	preview_url: string;
// }

// interface VoicesResponse {
// 	voices: VoiceModel[];
// }

// export async function GET() {
// 	// 環境変数からAPIキーを取得
// 	const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// 	// APIキーが正しく設定されていない場合はエラーを返す
// 	if (!ELEVENLABS_API_KEY) {
// 		return NextResponse.json(
// 			{ message: 'APIキーが設定されていません' },
// 			{ status: 500 }
// 		);
// 	}

// 	try {
// 		// ElevenLabs APIに音声モデルリストをリクエスト
// 		const response = await fetch('https://api.elevenlabs.io/v1/voices', {
// 			method: 'GET',
// 			headers: {
// 				'xi-api-key': ELEVENLABS_API_KEY,
// 			},
// 		});

// 		// レスポンスが成功したかどうかを確認
// 		if (response.ok) {
// 			// レスポンスの型を定義した型にキャスト
// 			const data = (await response.json()) as VoicesResponse;

// 			// デバッグ用にレスポンスをログに出力して確認
// 			// console.log('APIレスポンス:', data);

// 			// data.voicesが存在しない場合のチェック
// 			if (!Array.isArray(data.voices)) {
// 				return NextResponse.json(
// 					{ message: '音声モデルのデータが見つかりませんでした' },
// 					{ status: 500 }
// 				);
// 			}

// 			// 成功した場合は音声モデルのリストを返す
// 			return NextResponse.json({ models: data.voices });
// 		} else {
// 			// エラーレスポンスを取得
// 			const errorData = await response.json();
// 			console.error('音声モデル取得エラー:', errorData);
// 			return NextResponse.json(
// 				{ message: '音声モデルの取得に失敗しました' },
// 				{ status: 500 }
// 			);
// 		}
// 	} catch (error) {
// 		console.error('APIリクエストエラー:', error);
// 		return NextResponse.json(
// 			{ message: '音声モデルの取得中にエラーが発生しました' },
// 			{ status: 500 }
// 		);
// 	}
// }

// src/app/api/get-audio-models/route.ts
import { NextResponse } from 'next/server';

// 音声モデルの型を定義
interface VoiceModel {
	voice_id: string;
	name: string;
}

interface VoicesResponse {
	voices: VoiceModel[];
}

export async function GET() {
	// 環境変数からAPIキーを取得
	const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

	// APIキーが正しく設定されていない場合はエラーを返す
	if (!ELEVENLABS_API_KEY) {
		return NextResponse.json(
			{ message: 'APIキーが設定されていません' },
			{ status: 500 }
		);
	}

	try {
		// ElevenLabs APIに音声モデルリストをリクエスト
		const response = await fetch('https://api.elevenlabs.io/v1/voices', {
			method: 'GET',
			headers: {
				'xi-api-key': ELEVENLABS_API_KEY,
			},
		});

		// レスポンスが成功したかどうかを確認
		if (response.ok) {
			// レスポンスの型を定義した型にキャスト
			const data = (await response.json()) as VoicesResponse;

			// 成功した場合は音声モデルのリストを返す
			return NextResponse.json({ models: data.voices });
		} else {
			// エラーレスポンスを取得
			const errorData = await response.json();
			console.error('音声モデル取得エラー:', errorData);
			return NextResponse.json(
				{ message: '音声モデルの取得に失敗しました' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('APIリクエストエラー:', error);
		return NextResponse.json(
			{ message: '音声モデルの取得中にエラーが発生しました' },
			{ status: 500 }
		);
	}
}
