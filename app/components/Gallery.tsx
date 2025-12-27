'use client';

import { Image, useScroll, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function GalleryItem({ url, title, subtitle, price, index, position, scale = [1, 1.5, 1], ...props }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const group = useRef<THREE.Group>(null);
    const hoverScale = 1.05;

    useFrame((state, delta) => {
        // Subtle float animation (Reduced to minimum)
        if (group.current) {
            group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.01;
        }
    });

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
            {/* Positioned below the image to bind them visually */}
            <Html position={[0, -1.6, 0]} transform distanceFactor={1.5} center>
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
        { url: "/friends-merch/images/2.jpg", title: "Subtle Beige", subtitle: "Comfort Fit", price: "95.00" },
        { url: "/friends-merch/images/3.jpg", title: "Deep Earth", subtitle: "Heavyweight Cotton", price: "110.00" },
        { url: "/friends-merch/images/4.jpg", title: "Eternity", subtitle: "Signature Hoodie", price: "120.00" },
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
