'use client';

import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface AudioModel {
	id: string;
	name: string;
}

const VoiceModelList: React.FC = () => {
	const [models, setModels] = useState<AudioModel[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// APIから音声モデル一覧を取得する
		const fetchAudioModels = async () => {
			try {
				const response = await fetch('/api/get-audio-models'); // ここはAPIエンドポイントに合わせる
				const data = await response.json();
				setModels(data.models);
			} catch (error) {
				console.error('モデル一覧の取得に失敗しました:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAudioModels();
	}, []);

	if (loading) {
		return <ListItemText primary="読み込み中..." />;
	}

	if (models.length === 0) {
		return <ListItemText primary="モデルが見つかりません" />;
	}

	return (
		<List>
			{models.map((model) => (
				<ListItem key={model.id}>
					<ListItemText primary={model.name} />
				</ListItem>
			))}
		</List>
	);
};

export default VoiceModelList;
