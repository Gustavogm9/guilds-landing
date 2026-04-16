import { useEffect, useState } from 'react';

interface UseCountUpOptions {
    end: number;
    duration?: number;
    startOnMount?: boolean;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export function useCountUp({
    end,
    duration = 1000,
    startOnMount = true,
    prefix = '',
    suffix = '',
    decimals = 0,
}: UseCountUpOptions) {
    const [count, setCount] = useState(startOnMount ? 0 : end);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!startOnMount) return;

        setIsAnimating(true);
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentValue = startValue + (end - startValue) * easeProgress;
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, startOnMount]);

    const formattedValue = `${prefix}${count.toFixed(decimals)}${suffix}`;

    return { count, formattedValue, isAnimating };
}

// Format number with locale
export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat('pt-BR', options).format(value);
}

// Format currency
export function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}
