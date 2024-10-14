import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
	const { name, systemInstructions, model } = await req.json();

	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ message: 'APIキーが設定されていません' },
			{ status: 500 }
		);
	}

	try {
		// リクエスト前にログを出力
		console.log('Sending request with body:', {
			name,
			systemInstructions,
			model,
		});

		const response = await fetch('https://api.openai.com/v1/assistants', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				'OpenAI-Beta': 'assistants=v2',
			},
			body: JSON.stringify({
				name,
				instructions: systemInstructions, // 'system_instructions' ではなく 'instructions' に変更
				model,
			}),
		});

		const data = (await response.json()) as { id: string }; // 型アサーションを追加

		// レスポンス内容をログに出力
		console.log('Response data:', data);

		if (response.ok) {
			return NextResponse.json({ assistantId: data.id });
		} else {
			return NextResponse.json(
				{ message: 'Assistantの作成に失敗しました', error: data },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Error creating assistant:', error);
		return NextResponse.json(
			{ message: 'サーバーでエラーが発生しました', error },
			{ status: 500 }
		);
	}
}
