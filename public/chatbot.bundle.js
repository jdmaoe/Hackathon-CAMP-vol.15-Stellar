(function () {
	// チャットボットUIを生成する関数
	function createChatbotUI() {
		const chatbotContainer = document.createElement('div');
		chatbotContainer.id = 'chatbot';
		chatbotContainer.style.position = 'fixed';
		chatbotContainer.style.bottom = '20px';
		chatbotContainer.style.right = '20px';
		chatbotContainer.style.width = '350px';
		chatbotContainer.style.maxHeight = '400px';
		chatbotContainer.style.backgroundColor = '#fff';
		chatbotContainer.style.border = '1px solid #ccc';
		chatbotContainer.style.borderRadius = '8px';
		chatbotContainer.style.overflow = 'hidden';
		chatbotContainer.style.zIndex = '100000';
		chatbotContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
		chatbotContainer.innerHTML = `
      <div id="chatbot-header" style="background-color: #1976d2; color: white; padding: 10px; font-size: 16px; font-weight: bold;">
        チャットボット
      </div>
      <div id="chatbot-messages" style="height: 250px; overflow-y: auto; padding: 10px; background-color: #f9f9f9;">
        <!-- メッセージがここに表示される -->
      </div>
      <div id="chatbot-input-container" style="padding: 10px; display: flex; gap: 10px; background-color: #f1f1f1;">
        <input type="text" id="chatbot-input" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="メッセージを入力..." />
        <button id="chatbot-send" style="padding: 8px 16px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">送信</button>
      </div>
    `;
		document.body.appendChild(chatbotContainer);
	}

	// チャットボットのメッセージを処理する関数
	function handleMessage(apiUrl, textModelId, voiceModelId) {
		const inputField = document.getElementById('chatbot-input');
		const messageContainer = document.getElementById('chatbot-messages');

		document
			.getElementById('chatbot-send')
			.addEventListener('click', async () => {
				const userMessage = inputField.value.trim();
				if (!userMessage) return;

				// ユーザーのメッセージを表示
				const userMsgDiv = document.createElement('div');
				userMsgDiv.textContent = userMessage;
				userMsgDiv.style.textAlign = 'right';
				userMsgDiv.style.marginBottom = '10px';
				userMsgDiv.style.backgroundColor = '#f1f1f1';
				userMsgDiv.style.padding = '8px';
				userMsgDiv.style.borderRadius = '4px';
				messageContainer.appendChild(userMsgDiv);
				inputField.value = '';

				try {
					// APIリクエストを送信
					const response = await fetch(apiUrl, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							message: userMessage,
							textModelId: textModelId,
							voiceModelId: voiceModelId,
						}),
					});

					const data = await response.json();

					if (response.ok) {
						// アシスタントのメッセージを表示
						const assistantMsgDiv = document.createElement('div');
						assistantMsgDiv.textContent =
							data.response || 'アシスタントからの応答がありません。';
						assistantMsgDiv.style.textAlign = 'left';
						assistantMsgDiv.style.marginBottom = '10px';
						assistantMsgDiv.style.backgroundColor = '#f1f1f1';
						assistantMsgDiv.style.padding = '8px';
						assistantMsgDiv.style.borderRadius = '4px';
						messageContainer.appendChild(assistantMsgDiv);

						// 音声があれば再生
						if (data.audioUrl) {
							const audio = new Audio(data.audioUrl);
							audio.play().catch((error) => {
								console.error('音声再生エラー:', error);
							});
						}
					} else {
						// エラーメッセージを表示
						const errorMsgDiv = document.createElement('div');
						errorMsgDiv.textContent = data.error || 'エラーが発生しました。';
						errorMsgDiv.style.textAlign = 'left';
						errorMsgDiv.style.marginBottom = '10px';
						errorMsgDiv.style.backgroundColor = '#f8d7da';
						errorMsgDiv.style.padding = '8px';
						errorMsgDiv.style.borderRadius = '4px';
						messageContainer.appendChild(errorMsgDiv);
					}

					// メッセージコンテナをスクロール
					messageContainer.scrollTop = messageContainer.scrollHeight;
				} catch (error) {
					console.error('メッセージの送信に失敗しました:', error);
					const errorMsgDiv = document.createElement('div');
					errorMsgDiv.textContent = 'メッセージの送信に失敗しました。';
					errorMsgDiv.style.textAlign = 'left';
					errorMsgDiv.style.marginBottom = '10px';
					errorMsgDiv.style.backgroundColor = '#f8d7da';
					errorMsgDiv.style.padding = '8px';
					errorMsgDiv.style.borderRadius = '4px';
					messageContainer.appendChild(errorMsgDiv);
					messageContainer.scrollTop = messageContainer.scrollHeight;
				}
			});
	}

	// チャットボットの初期化関数
	window.initializeChatbot = function (config) {
		const { textModelId, voiceModelId, apiUrl } = config;
		console.log('Initializing Chatbot with:', config);
		createChatbotUI();
		handleMessage(apiUrl, textModelId, voiceModelId);
	};
})();
