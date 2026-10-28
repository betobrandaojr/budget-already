'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/schemas/budgetSchema';
import { useBudgetStore } from '@/store/useBudgetStore'; // Fixed import path
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { z } from 'zod';

type ContactFormData = z.infer<typeof contactSchema>;

export function StepProvider() {
    const { provider, updateProvider, setStep } = useBudgetStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: provider,
    });

    const onSubmit = (data: ContactFormData) => {
        updateProvider(data);
        setStep(2);
    };

    return (
        <Card title="Dados do Prestador" description="Preencha suas informações de contato.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                        label="Nome"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <Input
                        label="Sobrenome"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                        label="E-mail"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        label="Telefone"
                        error={errors.phone?.message}
                        {...register('phone')}
                    />
                </div>

                <Input
                    label="CPF / CNPJ"
                    error={errors.taxId?.message}
                    {...register('taxId')}
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="w-full sm:w-auto">Próximo</Button>
                </div>
            </form>
        </Card>
    );
}
