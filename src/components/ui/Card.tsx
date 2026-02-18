import React from 'react';
import { cn } from './Input';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
}

export function Card({ className, title, description, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm",
                className
            )}
            {...props}
        >
            {(title || description) && (
                <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-100/50">
                    {title && (
                        <h3 className="font-semibold leading-none tracking-tight text-lg">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
