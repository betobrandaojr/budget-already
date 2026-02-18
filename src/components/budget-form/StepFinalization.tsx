'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetDetailsSchema } from '@/schemas/budgetSchema';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { z } from 'zod';

type BudgetDetailsData = z.infer<typeof budgetDetailsSchema>;

export function StepFinalization() {
    const { validUntil, notes, updateBudgetDetails, setStep } = useBudgetStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BudgetDetailsData>({
        resolver: zodResolver(budgetDetailsSchema),
        defaultValues: {
            validUntil: validUntil ? validUntil.toString() : '',
            notes: notes || '',
        },
    });

    const onSubmit = (data: BudgetDetailsData) => {
        updateBudgetDetails(data);
        setStep(5);
    };

    return (
        <Card title="Finalização" description="Defina a validade e observações do orçamento.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Input
                        label="Validade da Proposta"
                        type="date"
                        error={errors.validUntil?.message}
                        {...register('validUntil')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Data limite para o cliente aceitar o orçamento.
                    </p>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-gray-700">
                        Observações Gerais
                    </label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                        placeholder="Ex: Pagamento 50% na entrada e 50% na entrega..."
                        {...register('notes')}
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(3)}>
                        Voltar
                    </Button>
                    <Button type="submit">Visualizar Orçamento</Button>
                </div>
            </form>
        </Card>
    );
}
