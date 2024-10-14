// // src/app/api/upload-audio/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export const runtime = 'nodejs';

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const audioFile = formData.get('audio');

//   if (!audioFile || !(audioFile instanceof Blob)) {
//     return NextResponse.json({ message: '音声ファイルが見つかりません' }, { status: 400 });
//   }

//   const arrayBuffer = await audioFile.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;

//   // ElevenLabs の API に送信する FormData を作成
//   const apiFormData = new FormData();
//   apiFormData.append('files', new Blob([buffer], { type: 'audio/webm' }), 'audio.webm');
//   apiFormData.append('name', 'UserVoice');
//   apiFormData.append('description', 'User voice clone');

//   const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
//     method: 'POST',
//     headers: {
//       'xi-api-key': ELEVENLABS_API_KEY,
//     },
//     body: apiFormData,
//   });

//   const data = (await response.json()) as { voice_id: string };

//   if (response.ok) {
//     return NextResponse.json({ voiceId: data.voice_id });
//   } else {
//     console.error('音声クローンエラー:', data);
//     return NextResponse.json({ message: '音声クローンの作成に失敗しました' }, { status: 500 });
//   }
// }

// src/app/api/upload-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const files = formData.getAll('files') as Blob[];
	const modelName = formData.get('modelName');

	if (files.length === 0 || !modelName) {
		return NextResponse.json(
			{ message: 'ファイルが見つかりません' },
			{ status: 400 }
		);
	}

	// ファイルサイズと形式のチェック
	for (const file of files) {
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json(
				{ message: 'ファイルサイズは10MB以内である必要があります。' },
				{ status: 400 }
			);
		}
	}

	const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;

	// ElevenLabs の API に送信するための FormData を作成
	const apiFormData = new FormData();
	files.forEach((file, index) => {
		apiFormData.append('files', file, `audio-${index}.mp3`);
	});

	// 必須フィールドが足りない場合に備えて、`name`や`description`も送信する
	apiFormData.append('name', modelName);
	apiFormData.append('description', 'User voice clone');

	const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
		method: 'POST',
		headers: {
			'xi-api-key': ELEVENLABS_API_KEY,
		},
		body: apiFormData,
	});

	const data = await response.json();

	if (response.ok) {
		return NextResponse.json({ voiceId: data.voice_id });
	} else {
		console.error('音声クローンエラー:', data);
		return NextResponse.json(
			{ message: '音声クローンの作成に失敗しました' },
			{ status: 500 }
		);
	}
}
