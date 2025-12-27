'use client';

import { Image, useScroll, Text } from '@react-three/drei';
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
                {/* Card Background */}
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[2.5, 1.2]} />
                    <meshBasicMaterial color="#f0f0f0" transparent opacity={0.9} />
                </mesh>

                {/* Text Content */}
                <Text
                    position={[0, 0.3, 0.01]}
                    fontSize={0.25}
                    color="#3a2a2a"
                    anchorX="center"
                    anchorY="middle"
                >
                    {title}
                </Text>

                <Text
                    position={[0, 0.1, 0.01]}
                    fontSize={0.1}
                    color="#666"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.1}
                >
                    {subtitle.toUpperCase()}
                </Text>

                <group position={[0, -0.25, 0.01]}>
                    <Text
                        position={[-0.4, 0, 0]}
                        fontSize={0.15}
                        color="#000"
                        anchorX="right"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        {price}
                    </Text>
                    <Text
                        position={[0.4, 0, 0]}
                        fontSize={0.1}
                        color="#888"
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
