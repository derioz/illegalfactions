'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
}: FadeInProps) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration,
                delay,
                ease: [0.23, 1, 0.32, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ScaleInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function ScaleIn({
    children,
    delay = 0,
    duration = 0.5,
    className = '',
}: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration,
                delay,
                ease: [0.23, 1, 0.32, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
    const words = text.split(' ');

    return (
        <motion.span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.4,
                        delay: delay + i * 0.1,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
    return (
        <motion.span
            className={`relative inline-block ${className}`}
            whileHover="glitch"
        >
            <motion.span
                className="relative z-10"
                variants={{
                    glitch: {
                        x: [0, -2, 2, -1, 1, 0],
                        transition: { duration: 0.3, repeat: Infinity },
                    },
                }}
            >
                {text}
            </motion.span>
        </motion.span>
    );
}

interface ParallaxProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
    return (
        <motion.div
            className={className}
            style={{ y: 0 }}
            whileInView={{
                y: [0, -50 * speed],
            }}
            viewport={{ once: false }}
            transition={{
                duration: 1,
                ease: 'linear',
            }}
        >
            {children}
        </motion.div>
    );
}
