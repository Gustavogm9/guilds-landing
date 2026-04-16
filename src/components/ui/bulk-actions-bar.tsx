import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Trash2, Archive, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionsBarProps {
    selectedCount: number;
    onDelete?: () => void;
    onArchive?: () => void;
    onExport?: () => void;
    onSend?: () => void;
    onClearSelection: () => void;
    isDeleting?: boolean;
    className?: string;
}

export function BulkActionsBar({
    selectedCount,
    onDelete,
    onArchive,
    onExport,
    onSend,
    onClearSelection,
    isDeleting,
    className,
}: BulkActionsBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div
            className={cn(
                'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
                'flex items-center gap-3 px-4 py-3',
                'bg-card border shadow-lg rounded-lg',
                'animate-in slide-in-from-bottom-4 duration-200',
                className
            )}
        >
            <div className="flex items-center gap-2 pr-3 border-r">
                <Checkbox checked={true} className="pointer-events-none" />
                <span className="text-sm font-medium">
                    {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex items-center gap-1">
                {onExport && (
                    <Button variant="ghost" size="sm" onClick={onExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                )}

                {onSend && (
                    <Button variant="ghost" size="sm" onClick={onSend} className="gap-2">
                        <Send className="h-4 w-4" />
                        Enviar
                    </Button>
                )}

                {onArchive && (
                    <Button variant="ghost" size="sm" onClick={onArchive} className="gap-2">
                        <Archive className="h-4 w-4" />
                        Arquivar
                    </Button>
                )}

                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                    </Button>
                )}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="ml-2"
            >
                Cancelar
            </Button>
        </div>
    );
}
