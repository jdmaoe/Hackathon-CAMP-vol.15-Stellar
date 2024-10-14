// // app/api/send-message/route.ts

// import { NextResponse } from 'next/server';

// interface Message {
//   sender: 'user' | 'assistant';
//   content: string;
// }

// export async function POST(req: Request) {
//   const { model, message, previousMessages, instructions } = await req.json();

//   if (!model || !message) {
//     return NextResponse.json(
//       { error: 'モデル名とメッセージが必要です。' },
//       { status: 400 }
//     );
//   }

//   try {
//     const apiKey = process.env.OPENAI_API_KEY;

//     if (!apiKey) {
//       return NextResponse.json(
//         { error: 'APIキーが設定されていません。' },
//         { status: 500 }
//       );
//     }

//     const messagesPayload = [
//       {
//         role: 'system',
//         content: instructions || 'あなたは有能なアシスタントです。',
//       },
//       ...(previousMessages || []).map((msg: Message) => ({
//         role: msg.sender === 'user' ? 'user' : 'assistant',
//         content: msg.content,
//       })),
//       {
//         role: 'user',
//         content: message,
//       },
//     ];

//     const response = await fetch(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify({
//           model: model, // OpenAIのモデル名を使用
//           messages: messagesPayload,
//         }),
//       }
//     );

//     const data = await response.json();

//     if (response.ok && data.choices && data.choices.length > 0) {
//       const assistantResponse = data.choices[0].message.content;
//       return NextResponse.json({ response: assistantResponse });
//     } else {
//       console.error('OpenAI API Error:', data);
//       return NextResponse.json(
//         { error: 'アシスタントからの返信を取得できませんでした。' },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json(
//       { error: 'メッセージの送信中にエラーが発生しました。' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/send-message/route.ts
import { NextResponse } from 'next/server';

interface Message {
	sender: 'user' | 'assistant';
	content: string;
}

export async function POST(req: Request) {
	const { model, message, previousMessages, instructions } = await req.json();

	if (!model || !message) {
		return NextResponse.json(
			{ error: 'モデル名とメッセージが必要です。' },
			{ status: 400 }
		);
	}

	try {
		const apiKey = process.env.OPENAI_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'APIキーが設定されていません。' },
				{ status: 500 }
			);
		}

		const messagesPayload = [
			{
				role: 'system',
				content: instructions || 'あなたは有能なアシスタントです。',
			},
			...(previousMessages || []).map((msg: Message) => ({
				role: msg.sender === 'user' ? 'user' : 'assistant',
				content: msg.content,
			})),
			{
				role: 'user',
				content: message,
			},
		];

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: model, // OpenAIのモデル名を使用
				messages: messagesPayload,
			}),
		});

		const data = await response.json();

		if (response.ok && data.choices && data.choices.length > 0) {
			const assistantResponse = data.choices[0].message.content;
			return NextResponse.json({ response: assistantResponse });
		} else {
			console.error('OpenAI API Error:', data);
			return NextResponse.json(
				{ error: 'アシスタントからの返信を取得できませんでした。' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'メッセージの送信中にエラーが発生しました。' },
			{ status: 500 }
		);
	}
}
