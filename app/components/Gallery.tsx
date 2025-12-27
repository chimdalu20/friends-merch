'use client';

import { Image, useScroll, Html } from '@react-three/drei';
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

            {/* The Label / Price Tag */}
            {/* Positioned at the bottom, overlapping the image slightly */}
            <Html position={[0, -1.5, 0]} transform distanceFactor={1.5} center>
                <div className="product-card" style={{ textAlign: 'center', width: '200px' }}>
                    <h2 className="product-title">{title}</h2>
                    <p className="product-subtitle">{subtitle}</p>
                    <div className="product-price">
                        <span>{price}</span>
                        <span className="currency">USD</span>
                    </div>
                </div>
            </Html>
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
