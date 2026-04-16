import * as Icons from "lucide-react";

interface DynamicIconProps {
    name: any; // Can be string (from DB) or Component (from fallback content)
    className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
    // If name is already a component (from fallback content), render it
    if (typeof name !== 'string') {
        const IconComponent = name;
        return <IconComponent className={className} />;
    }

    // If name is a string (from DB), look it up in Lucide icons
    // @ts-ignore
    const Icon = Icons[name];

    if (!Icon) {
        // Fallback icon if not found
        return <Icons.HelpCircle className={className} />;
    }

    return <Icon className={className} />;
};
