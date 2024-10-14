'use client';
import { useRef, useEffect } from 'react';

export const useFadeInOnScroll = <T extends HTMLElement>() => {
	const ref = useRef<T>(null);

	useEffect(() => {
		const handleFadeIn = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && ref.current) {
					ref.current.style.opacity = '1';
					ref.current.style.transform = 'translateY(0)';
				}
			});
		};

		const observer = new IntersectionObserver(handleFadeIn, { threshold: 0.4 });

		if (ref.current) observer.observe(ref.current);

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, []);

	return ref;
};
