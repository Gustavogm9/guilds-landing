import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Copy, Download, Send, Archive, LucideIcon } from 'lucide-react';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
}

interface QuickActionsMenuProps {
    actions: QuickAction[];
}

export function QuickActionsMenu({ actions }: QuickActionsMenuProps) {
    const regularActions = actions.filter(a => a.variant !== 'destructive');
    const destructiveActions = actions.filter(a => a.variant === 'destructive');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {regularActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <DropdownMenuItem
                            key={idx}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className="gap-2 cursor-pointer"
                        >
                            <Icon className="h-4 w-4" />
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}

                {destructiveActions.length > 0 && regularActions.length > 0 && (
                    <DropdownMenuSeparator />
                )}

                {destructiveActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <DropdownMenuItem
                            key={`destructive-${idx}`}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Icon className="h-4 w-4" />
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Common action presets
export const commonActions = {
    view: (onClick: () => void): QuickAction => ({
        label: 'Visualizar',
        icon: Eye,
        onClick,
    }),
    edit: (onClick: () => void): QuickAction => ({
        label: 'Editar',
        icon: Edit,
        onClick,
    }),
    duplicate: (onClick: () => void): QuickAction => ({
        label: 'Duplicar',
        icon: Copy,
        onClick,
    }),
    export: (onClick: () => void): QuickAction => ({
        label: 'Exportar',
        icon: Download,
        onClick,
    }),
    send: (onClick: () => void): QuickAction => ({
        label: 'Enviar',
        icon: Send,
        onClick,
    }),
    archive: (onClick: () => void): QuickAction => ({
        label: 'Arquivar',
        icon: Archive,
        onClick,
    }),
    delete: (onClick: () => void): QuickAction => ({
        label: 'Excluir',
        icon: Trash2,
        onClick,
        variant: 'destructive',
    }),
};
