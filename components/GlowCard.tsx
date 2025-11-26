'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import React from 'react';
import { Card } from './ui/card';

interface GlowCardProps extends React.ComponentProps<typeof Card> {
    children: React.ReactNode;
    glowColor?: string;
}

export const GlowCard = ({
    children,
    className,
    glowColor = 'rgba(255, 255, 255, 0.1)',
    ...props
}: GlowCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    return (
        <Card
            className={`relative overflow-hidden group ${className}`}
            onMouseMove={handleMouseMove}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative">{children}</div>
        </Card>
    );
};
