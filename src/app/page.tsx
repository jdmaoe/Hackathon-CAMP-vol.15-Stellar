'use client';
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useFadeInOnScroll } from './hooks/useFadeInOnScroll';
import {ListItem, Typography} from '@mui/material';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

const CustomLink = styled(Link)({
	textDecoration: 'none'
});

const CustomTypography = styled(Typography)({
	padding: '0 20px',
	fontFamily: 'none',
	color: '#fff', 
	fontSize: '3rem',
	fontWeight: '300',
	transition: 'color 0.3s ease',
	justifyContent: 'center',
	border: 'solid 1px',
	borderRadius: '5px',
	'&:hover': {
        color: 'transparent', // 文字の中身を透明に
        WebkitTextStroke: '0.5px #fff', // 文字の縁に色をつける
        textStroke: '1px #fff', // フォールバック
    },
});

export default function Page() {
	const descriptionRef = useFadeInOnScroll<HTMLDivElement>();
	const h2Ref = useFadeInOnScroll<HTMLHeadingElement>();
	const pRef = useFadeInOnScroll<HTMLParagraphElement>();
	const h2Ref2 = useFadeInOnScroll<HTMLHeadingElement>();
	const pRef2 = useFadeInOnScroll<HTMLParagraphElement>();
	const h2Ref3 = useFadeInOnScroll<HTMLHeadingElement>();
	const pRef3 = useFadeInOnScroll<HTMLParagraphElement>();
	const h2Ref4 = useFadeInOnScroll<HTMLHeadingElement>();
	const pRef4 = useFadeInOnScroll<HTMLParagraphElement>();
	const [titleOpacity, setTitleOpacity] = useState(0);
	const [linkOpacity, setLinkOpacity] = useState(0);

	// タイトルのフェードイン
	useEffect(() => {
		const timer = setTimeout(() => {
			setTitleOpacity(1);
			setLinkOpacity(1);
		}, 400);

		return () => clearTimeout(timer);
	}, []); // eslint-disable-line

	// スクロールに応じた背景の暗さを調整
	const overlayRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleScroll = () => {
			if (descriptionRef.current && overlayRef.current) {
				const descriptionTop =
					descriptionRef.current.getBoundingClientRect().top;
				const windowHeight = window.innerHeight;
				if (descriptionTop < windowHeight) {
					const opacity =
						Math.min(1, (windowHeight - descriptionTop) / 200) * 0.7;
					overlayRef.current.style.opacity = opacity.toString();
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []); // eslint-disable-line

	return (
		<main style={{ backgroundColor: 'black', fontFamily: 'none' }}>
			<Box
				sx={{
					backgroundImage: "url('/haikei2.png')",
					backgroundSize: 'auto 100%',
					backgroundAttachment: 'fixed',
					backgroundPosition: 'center',
					minHeight: '100vh',
					position: 'relative',
				}}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: '#000',
						transition: 'opacity 0.3s ease',
						opacity: 0,
						overflow: 'hidden',
						position: 'absolute',
					}}
					ref={overlayRef}
				/>
				<Box
					sx={{
						position: 'relative',
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
						maxWidth: '1150px',
						margin: '0 auto',
					}}
				>
					{/* タイトル */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '30vh',
							margin: '220px auto 0 auto',
						}}
					>
						<div
							style={{
								position: 'relative',
								width: '600px',
								height: '200px',
								opacity: titleOpacity,
								transition: 'opacity 1s ease',
							}}
						>
							<Image
								src="/title.png"
								alt="タイトル"
								fill
								sizes="(max-width: 600px)"
							/>
						</div>				
					</div>
					<div style={{margin: '0 auto', justifyContent: 'center', opacity: linkOpacity, transition: 'opacity 1s ease',}}>
						<ListItem>
							<CustomLink href="/ai-assistant">
								<CustomTypography>≫ Let's Start</CustomTypography>
							</CustomLink>
						</ListItem>
					</div>		

					{/* サイトの説明 */}
					<div
						ref={descriptionRef}
						style={{
							margin: '350px 0 300px 0',
							padding: '0 12px',
							color: '#fff',
						}}
					>
						<h2
							ref={h2Ref}
							style={{
								fontWeight: '700',
								fontSize: '2.7rem',
								margin: '0 0 20px 0',
								opacity: 0,
								transform: 'translateY(20px)',
								transition: 'opacity 1.2s ease, transform 1.2s ease',
							}}
						>
							声でつながる特別な会話体験
						</h2>
						<p
							ref={pRef}
							style={{
								padding: '5px 0',
								lineHeight: '3rem',
								fontSize: '1.3rem',
								opacity: 0,
								transform: 'translateX(20px)',
								transition: 'opacity 1s ease, transform 1s ease',
							}}
						>
							Stellarは、AIを活用してユーザーがキャラクターとリアルな会話を楽しむことができるプラットフォームです。
							<br />
							お気に入りキャラクターの特徴を忠実に再現し、まるで本物のような対話体験を提供します。
							<br />
							<br />
							Stellarでは、キャラクターのボイス音声をAIが学習し、その声を使って会話を進めることができます。
							<br />
							また、テキストモデルから、キャラクターの話し方、性格、サンプルテキストを学習し、そのキャラクター独自の言葉遣いや表現を再現します。
							<br />
							ユーザーは、音声モデルとテキストモデルを選択してチャット形式で話しかけると、
							<br />
							AIがそのキャラクターの話し方に合わせた返事テキストを生成し、それを音声モデルが話します。
							<br />
							これにより、まるでキャラクター本人と会話をしているかのような体験が可能です。
							<br />
						</p>
					</div>

					{/* STEP 1 */}
					<div
						style={{
							margin: '0 0 300px 0',
							padding: '50px 12px',
							color: '#fff',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							width: '100%',
						}}
					>
						<div style={{ width: '630px', paddingRight: '20px' }}>
							<h2
								ref={h2Ref2}
								style={{
									fontWeight: '700',
									fontSize: '2.7rem',
									margin: '0 0 20px 0',
									opacity: 0,
									transform: 'translateY(20px)',
									transition: 'opacity 1.2s ease, transform 1.2s ease',
								}}
							>
								STEP 1 <br />
								音声モデルを追加しよう
							</h2>
							<p
								ref={pRef2}
								style={{
									padding: '5px',
									lineHeight: '2rem',
									fontSize: '1.3rem',
									opacity: 0,
									transform: 'translateX(20px)',
									transition: 'opacity 1s ease, transform 1s ease',
								}}
							>
								音声モデル生成ページで音声モデルをアップロードできます。
								<br />
								<br />
								話してみたいキャラクター音声を追加してみてください！
								<br />
							</p>
						</div>
						<div
							style={{
								width: '480px',
								height: '480px',
								overflow: 'hidden',
								position: 'sticky',
								top: '100px',
							}}
						>
							<Image
								src="/chara1.webp"
								alt="原神画像１"
								fill
								sizes="(max-width: 480px)"
								style={{ objectFit: 'cover' }}
							/>
						</div>
					</div>

					{/* STEP 2 */}
					<div
						style={{
							margin: '0 0 300px 0',
							padding: '50px 12px',
							color: '#fff',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							width: '100%',
						}}
					>
						<div
							style={{
								width: '430px',
								height: '510px',
								overflow: 'hidden',
								position: 'sticky',
								top: '100px',
							}}
						>
							<Image
								src="/chara2.webp"
								alt="原神画像２"
								fill
								sizes="(max-width: 430px)"
								style={{ objectFit: 'cover' }}
							/>
						</div>
						<div style={{ width: '630px', paddingLeft: '20px' }}>
							<h2
								ref={h2Ref3}
								style={{
									fontWeight: '700',
									fontSize: '2.7rem',
									margin: '0 0 20px 0',
									opacity: 0,
									transform: 'translateY(20px)',
									transition: 'opacity 1.2s ease, transform 1.2s ease',
								}}
							>
								STEP 2 <br />
								性格モデルを追加しよう
							</h2>
							<p
								ref={pRef3}
								style={{
									padding: '5px',
									lineHeight: '3rem',
									fontSize: '1.3rem',
									opacity: 0,
									transform: 'translateX(20px)',
									transition: 'opacity 1s ease, transform 1s ease',
								}}
							>
								性格モデル使用ページでテキストモデルを追加できます。
								<br />
								　１.モデルの名前を記述します。
								<br />
								　２.AIのモデルを選択します。
								<br />
								　３.キャラクターの概要を記述します。
								<br />
								　４.最後にボタンを押して追加します。
								<br />
								そのキャラの性格や話し方、セリフなどの情報をよりわかりやすくまとめることで精度が上がります！
								<br />
							</p>
						</div>
					</div>

					{/* STEP 3 */}
					<div
						style={{
							margin: '0 0 300px 0',
							padding: '50px 12px',
							color: '#fff',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							width: '100%',
							height: '39vh',
						}}
					>
						<div style={{ width: '630px', paddingRight: '20px' }}>
							<h2
								ref={h2Ref4}
								style={{
									fontWeight: '700',
									fontSize: '2.7rem',
									margin: '0 0 20px 0',
									opacity: 0,
									transform: 'translateY(20px)',
									transition: 'opacity 1.2s ease, transform 1.2s ease',
								}}
							>
								STEP 3 <br />
								あとは会話をするだけ！
							</h2>
							<p
								ref={pRef4}
								style={{
									padding: '5px',
									lineHeight: '3rem',
									fontSize: '1.3rem',
									opacity: 0,
									transform: 'translateX(20px)',
									transition: 'opacity 1s ease, transform 1s ease',
								}}
							>
								AI使用ページでキャラクターと会話をすることができます。
								<br />
								音声モデルと性格モデルを選択したら準備は完了です！
								<br />
								お気に入りのキャラクターと会話をしてみましょう！
							</p>
						</div>
						<div
							style={{
								width: '480px',
								height: '480px',
								overflow: 'hidden',
								position: 'sticky',
								top: '100px',
							}}
						>
							<Image
								src="/chara3.webp"
								alt="原神画像3"
								fill
								sizes="(max-width: 480px)"
								style={{ objectFit: 'cover' }}
							/>
						</div>
					</div>
				</Box>
			</Box>
		</main>
	);
}
