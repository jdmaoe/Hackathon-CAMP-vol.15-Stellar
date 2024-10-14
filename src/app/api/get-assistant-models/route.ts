import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

interface AssistantModel {
	id: string;
	name: string;
}

export async function GET() {
	const apiKey = process.env.OPENAI_API_KEY; // 環境変数からAPIキーを取得

	if (!apiKey) {
		return NextResponse.json(
			{ message: 'APIキーが設定されていません' },
			{ status: 500 }
		);
	}

	try {
		// OpenAIのAssistants APIを使用してアシスタントモデル一覧を取得
		const response = await fetch('https://api.openai.com/v1/assistants', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'OpenAI-Beta': 'assistants=v2',
			},
		});

		if (response.ok) {
			// JSONレスポンスを AssistantModel[] 型にキャスト
			const data = (await response.json()) as { data: AssistantModel[] };

			//   console.log('アシスタントモデル一覧:', data);

			// 型とデータの存在をチェック
			if (!data || !Array.isArray(data.data)) {
				return NextResponse.json(
					{ message: 'アシスタントモデルのデータが見つかりませんでした' },
					{ status: 500 }
				);
			}

			// 成功した場合はアシスタントモデルのリストを返す
			return NextResponse.json({ models: data.data });
		} else {
			const errorData = await response.json();
			console.error('アシスタントモデル取得エラー:', errorData);
			return NextResponse.json(
				{ message: 'アシスタントモデルの取得に失敗しました', error: errorData },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('APIリクエストエラー:', error);
		return NextResponse.json(
			{
				message: 'アシスタントモデルの取得中にエラーが発生しました',
				error: error,
			},
			{ status: 500 }
		);
	}
}
