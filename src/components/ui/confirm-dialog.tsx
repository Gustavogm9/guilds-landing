import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, LogOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive' | 'warning';
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'default',
    loading = false,
}: ConfirmDialogProps) {
    const icons = {
        default: null,
        destructive: Trash2,
        warning: AlertTriangle,
    };

    const Icon = icons[variant];

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-start gap-4">
                        {Icon && (
                            <div className={cn(
                                'p-3 rounded-full',
                                variant === 'destructive' && 'bg-red-100 text-red-600 dark:bg-red-900/20',
                                variant === 'warning' && 'bg-amber-100 text-amber-600 dark:bg-amber-900/20'
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                        <div>
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            <AlertDialogDescription className="mt-2">
                                {description}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            variant === 'destructive' && 'bg-red-600 hover:bg-red-700',
                            variant === 'warning' && 'bg-amber-600 hover:bg-amber-700'
                        )}
                    >
                        {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Predefined confirm dialogs for common actions
export function DeleteConfirmDialog({
    open,
    onOpenChange,
    itemName,
    onConfirm,
    loading
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemName: string;
    onConfirm: () => void;
    loading?: boolean;
}) {
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title={`Excluir ${itemName}?`}
            description={`Esta ação não pode ser desfeita. Tem certeza que deseja excluir ${itemName}?`}
            onConfirm={onConfirm}
            confirmLabel="Excluir"
            variant="destructive"
            loading={loading}
        />
    );
}

export function LogoutConfirmDialog({
    open,
    onOpenChange,
    onConfirm
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}) {
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Sair do sistema?"
            description="Você será desconectado e precisará fazer login novamente."
            onConfirm={onConfirm}
            confirmLabel="Sair"
            variant="warning"
        />
    );
}
