'use client';

import { Image, useScroll, Text, RoundedBox } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function GalleryItem({ url, title, subtitle, price, index, position, scale = [1, 1.5, 1], ...props }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const group = useRef<THREE.Group>(null);
    const hoverScale = 1.05;

    // Removed Floating Animation

    return (
        <group ref={group} position={position}>
            {/* The Image */}
            <Image
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                scale={scale}
                {...props}
            />

            {/* 3D Card Geometry (Fixed to Image) */}
            <group position={[0, -1.5, 0.1]}>
                {/* Shadow */}
                <mesh position={[0.02, -0.02, -0.01]}>
                    <planeGeometry args={[0.96, 0.56]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.1} />
                </mesh>

                {/* Card Background - Further Reduced Size (0.8x) */}
                <RoundedBox args={[0.88, 0.48, 0.05]} radius={0.04} smoothness={4}>
                    <meshBasicMaterial color="#ffffff" />
                </RoundedBox>

                {/* Text Content */}
                <Text
                    position={[0, 0.096, 0.05]}
                    fontSize={0.096}
                    color="#2a2a2a"
                    anchorX="center"
                    anchorY="middle"
                >
                    {title}
                </Text>

                <Text
                    position={[0, 0.016, 0.05]}
                    fontSize={0.032}
                    color="#888888"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.2}
                >
                    {subtitle.toUpperCase()}
                </Text>

                {/* Divider Line */}
                <mesh position={[0, -0.064, 0.05]}>
                    <planeGeometry args={[0.64, 0.002]} />
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
                        USD
                    </Text>
                </group>
            </group>
        </group>
    );
}

export default function Gallery() {
    const { width } = useThree((state) => state.viewport);
    const scroll = useScroll();
    const group = useRef<THREE.Group>(null);

    // Total items
    const items = [
        { url: "/friends-merch/images/1.jpg", title: "Clean Slate", subtitle: "The Beginning", price: "85.00" },
    ];

    // Spacing between items
    const gap = 6;
    // Total width of the scrolling area
    const totalWidth = items.length * gap;

    useFrame(() => {
        if (group.current && scroll) {
            // Smooth scroll movement
            // We offset by a bit to start centered or slightly right
            const x = -scroll.offset * (totalWidth - width);
            group.current.position.x = x;
        }
    });

    return (
        <group ref={group} position={[1, 0, 0]}>
            {items.map((item, i) => (
                <GalleryItem
                    key={i}
                    index={i}
                    url={item.url}
                    title={item.title}
                    subtitle={item.subtitle}
                    price={item.price}
                    position={[i * gap, 0, 0]}
                    scale={[2, 3, 1]} // Reduced size for better fitting
                />
            ))}
        </group>
    );
}
