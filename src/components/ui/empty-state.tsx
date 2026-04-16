import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon, Plus, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    variant?: 'default' | 'compact';
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    variant = 'default',
}: EmptyStateProps) {
    if (variant === 'compact') {
        return (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <div className="rounded-full bg-muted p-2 mb-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{description}</p>
                {actionLabel && onAction && (
                    <Button size="sm" variant="outline" onClick={onAction} className="mt-3 gap-1">
                        <Plus className="h-3 w-3" />
                        {actionLabel}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Icon className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">{description}</p>

            <div className="flex items-center gap-3 mt-6">
                {actionLabel && onAction && (
                    <Button onClick={onAction} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {actionLabel}
                    </Button>
                )}
                {secondaryActionLabel && onSecondaryAction && (
                    <Button variant="outline" onClick={onSecondaryAction} className="gap-2">
                        {secondaryActionLabel}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
