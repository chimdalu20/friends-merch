'use client';

import { Image, useScroll, Text, RoundedBox } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function GalleryItem({ url, title, subtitle, price, index, position, scale = [1, 1.5, 1], groupScale = 1, itemRef, ...props }: any) {
    const ref = useRef<THREE.Mesh>(null);

    // position is only the initial placement - Gallery rewrites x every frame so
    // each item can wrap around independently.
    return (
        <group ref={itemRef} position={position} scale={[groupScale, groupScale, groupScale]}>
            {/* The Image */}
            <Image
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                scale={scale}
                {...props}
            />

            {/* Shadow */}
            <mesh position={[0.02, -0.02, -0.01]}>
                <planeGeometry args={[0.88, 0.58]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.1} />
            </mesh>

            {/* 3D Card Geometry (Fixed to Image) */}
            <group position={[0, -1.5, 0.1]}>


                {/* Card Background - Compact Badge Shape with Frost Effect */}
                <RoundedBox args={[0.82, 0.52, 0.05]} radius={0.05} smoothness={4}>
                    <meshPhysicalMaterial
                        color="#ffffff"
                        transmission={0.99}
                        opacity={0.5}
                        transparent
                        roughness={0.45}
                        thickness={0.02}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </RoundedBox>

                {/* Text Content */}
                <Text
                    position={[0, 0.11, 0.055]}
                    fontSize={0.096}
                    color="#2a2a2a"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={0.7}
                    textAlign="center"
                >
                    {title}
                </Text>

                <Text
                    position={[0, 0.03, 0.055]}
                    fontSize={0.032}
                    color="#888888"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.2}
                    maxWidth={0.7}
                    textAlign="center"
                >
                    {subtitle.toUpperCase()}
                </Text>

                {/* Divider Line */}
                <mesh position={[0, -0.05, 0.055]}>
                    <planeGeometry args={[0.6, 0.002]} />
                    <meshBasicMaterial color="#eeeeee" />
                </mesh>

                <group position={[0, -0.128, 0.05]}>
                    <Text
                        position={[-0.12, 0, 0]}
                        fontSize={0.08}
                        color="#1a1a1a"
                        anchorX="right"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        {price}
                    </Text>
                    <Text
                        position={[0.12, 0, 0]}
                        fontSize={0.04}
                        color="#999999"
                        anchorX="left"
                        anchorY="middle"
                    >
                        NGN
                    </Text>
                </group>
            </group>
        </group>
    );
}

export default function Gallery() {
    const { width } = useThree((state) => state.viewport);
    const scroll = useScroll();
    const itemRefs = useRef<(THREE.Group | null)[]>([]);
    const isHovered = useRef(false);

    // The carousel's position is a single continuous number that only ever grows.
    // It is deliberately NOT derived from scroll.el.scrollLeft: a DOM scroller has
    // two ends, and anything driven by its absolute position inherits them.
    const offset = useRef(0);
    const lastScrollLeft = useRef<number | null>(null);

    // Total items
    const items = [
        { url: "/images/1.jpg", title: "Clean Slates", subtitle: "The Beginning", price: "12,000" },
        { url: "/images/2.jpg", title: "Courage", subtitle: "Dark Brown", price: "12,000" },
        { url: "/images/3.jpg", title: "Lilac Dreams", subtitle: "Dark Purple", price: "12,000" },
        { url: "/images/4.jpg", title: "Subtle Sophistication", subtitle: "Beige Pink", price: "7,000" },
        { url: "/images/5.jpg", title: "Off-Duty Elegante", subtitle: "Off-White Hoodie", price: "13,000" },
        { url: "/images/6.jpg", title: "Off-Duty Elegante", subtitle: "Black Hoodie", price: "13,000" },
        { url: "/images/7.jpg", title: "Off-Duty Elegante", subtitle: "Pants", price: "15,000" },
        { url: "/images/8.jpg", title: "Lilac Dreams (M)", subtitle: "Dark Purple", price: "12,000" },
        { url: "/images/9.jpg", title: "Clean Slates (M)", subtitle: "Off-White", price: "12,000" },
        { url: "/images/10.jpg", title: "Subtle Sophistication (M)", subtitle: "Beige", price: "12,000" },
        { url: "/images/11.jpg", title: "Courage (M)", subtitle: "Beige Pink", price: "12,000" },
    ];

    const isMobile = width < 4.8; // Mobile/Portrait threshold
    const wrapperScale = isMobile ? 0.65 : 1; // 65% size on mobile
    const gap = isMobile ? 2.5 : 4; // Tighter spacing on mobile

    // One full cycle of the carousel. Item i sits at i * gap, so after totalWidth
    // the sequence repeats exactly - which is what lets it wrap seamlessly.
    const totalWidth = items.length * gap;

    useFrame((state, delta) => {
        const el = scroll.el;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) return;

        // World units per pixel of DOM scroll, derived exactly as the old absolute
        // mapping was, so dragging keeps the feel it had.
        const unitsPerPixel = (totalWidth - width) / maxScroll;

        if (lastScrollLeft.current === null) {
            // Park the scroller in the middle so there is room to drag either way
            // from the very first frame.
            el.scrollLeft = maxScroll / 2;
            lastScrollLeft.current = el.scrollLeft;
        }

        // 1. The user's scroll, consumed as a DELTA.
        offset.current += (el.scrollLeft - lastScrollLeft.current) * unitsPerPixel;
        lastScrollLeft.current = el.scrollLeft;

        // 2. Idle drift, paused on hover.
        if (!isHovered.current) {
            offset.current += 15 * unitsPerPixel * delta;
        }

        // 3. Recentre the scroller before it can reach either end, so the user never
        //    runs out of scroll in either direction. This is invisible precisely
        //    because nothing on screen is positioned from scrollLeft.
        const edge = maxScroll * 0.15;
        if (el.scrollLeft < edge || el.scrollLeft > maxScroll - edge) {
            el.scrollLeft = maxScroll / 2;
            lastScrollLeft.current = el.scrollLeft;
        }

        // 4. Fold every item into the window centred on the camera. An item that
        //    walks off one side re-enters on the other, totalWidth away - far off
        //    screen, so the jump is never seen. This is the endlessness.
        const half = totalWidth / 2;
        for (let i = 0; i < items.length; i++) {
            const item = itemRefs.current[i];
            if (!item) continue;
            // JS % keeps the sign of the dividend, so a negative result needs a lift
            // back into range before folding.
            let x = (i * gap - offset.current) % totalWidth;
            if (x < 0) x += totalWidth;
            if (x > half) x -= totalWidth;
            item.position.x = x;
        }
    });

    return (
        <group
            position={[1, 0, 0]}
            onPointerOver={() => { isHovered.current = true; }}
            onPointerOut={() => { isHovered.current = false; }}
        >
            {items.map((item, i) => (
                <GalleryItem
                    key={i}
                    index={i}
                    itemRef={(el: THREE.Group | null) => { itemRefs.current[i] = el; }}
                    url={item.url}
                    title={item.title}
                    subtitle={item.subtitle}
                    price={item.price}
                    position={[i * gap, 0, 0]}
                    scale={[2, 3, 1]} // Reduced size for better fitting
                    groupScale={wrapperScale}
                />
            ))}
        </group>
    );
}
