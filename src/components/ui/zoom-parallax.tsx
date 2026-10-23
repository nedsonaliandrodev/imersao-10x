'use client';

/* Zoom Parallax · 21st.dev (@efferd/zoom-parallax), adaptado: posição da imagem, legenda final e altura configurável */

import { useScroll, useTransform, motion, type MotionValue } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface Image {
	src: string;
	alt?: string;
	position?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
	children?: ReactNode;
	height?: string;
}

function Caption({ progress, children }: { progress: MotionValue<number>; children: ReactNode }) {
	const opacity = useTransform(progress, [0.62, 0.82], [0, 1]);
	const y = useTransform(progress, [0.62, 0.82], [40, 0]);
	return (
		<motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-0 z-10 flex items-end">
			{children}
		</motion.div>
	);
}

export function ZoomParallax({ images, children, height = 'h-[300vh]' }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className={`relative ${height}`}>
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.map(({ src, alt, position }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
						>
							<div className="relative h-[25vh] w-[25vw]">
								<img
									src={src}
									alt={alt || ''}
									loading="lazy"
									className="h-full w-full object-cover"
									style={{ objectPosition: position || 'center' }}
								/>
							</div>
						</motion.div>
					);
				})}
				{children ? <Caption progress={scrollYProgress}>{children}</Caption> : null}
			</div>
		</div>
	);
}
