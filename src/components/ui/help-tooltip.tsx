import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
    content: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}

export function HelpTooltip({ content, side = 'top', className }: HelpTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            'inline-flex items-center justify-center rounded-full',
                            'text-muted-foreground hover:text-foreground',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            'transition-colors',
                            className
                        )}
                    >
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Ajuda</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side={side} className="max-w-xs">
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

interface LabelWithHelpProps {
    label: string;
    help: React.ReactNode;
    required?: boolean;
    className?: string;
}

export function LabelWithHelp({ label, help, required, className }: LabelWithHelpProps) {
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <span className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            <HelpTooltip content={help} />
        </div>
    );
}
