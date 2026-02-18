'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Technical Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm mt-10 max-w-2xl mx-auto">
            <div className="bg-red-50 p-3 rounded-full">
                <svg
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ops! Algo deu errado.</h2>
            <p className="text-gray-500 max-w-md">
                Ocorreu um erro técnico inesperado. Nossa equipe já foi notificada.
                Por favor, tente recarregar a página ou voltar mais tarde.
            </p>
            <div className="flex gap-4 pt-2">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Voltar ao Início
                </Button>
                <Button onClick={() => reset()}>
                    Tentar Novamente
                </Button>
            </div>
        </div>
    );
}
