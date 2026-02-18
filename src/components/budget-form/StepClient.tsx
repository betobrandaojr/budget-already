'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/schemas/budgetSchema';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { z } from 'zod';

type ContactFormData = z.infer<typeof contactSchema>;

export function StepClient() {
    const { client, updateClient, setStep } = useBudgetStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: client,
    });

    const onSubmit = (data: ContactFormData) => {
        updateClient(data);
        setStep(3);
    };

    return (
        <Card title="Dados do Cliente" description="Preencha as informações do cliente.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Voltar
                    </Button>
                    <Button type="submit">Próximo</Button>
                </div>
            </form>
        </Card>
    );
}
