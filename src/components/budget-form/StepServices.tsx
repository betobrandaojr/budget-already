'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceItemSchema } from '@/schemas/budgetSchema';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { z } from 'zod';
import { ServiceType, UnitType, ServiceItem } from '@/types/budget';
import { Plus, Trash2 } from 'lucide-react';

const itemFormSchema = z.object({
    type: z.string().min(1, 'Tipo é obrigatório'),
    customType: z.string().optional(),
    description: z.string().min(3, 'Descrição muito curta'),
    unitPrice: z.coerce.number().min(0.01, 'Valor deve ser positivo'),
    quantity: z.coerce.number().min(1, 'Quantidade deve ser pelo menos 1'),
    unit: z.nativeEnum(UnitType),
}).refine(data => {
    if (data.type === 'custom' && (!data.customType || data.customType.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Informe o nome do novo tipo",
    path: ["customType"],
});

type ItemFormData = {
    type: string;
    customType?: string;
    description: string;
    unitPrice: number;
    quantity: number;
    unit: UnitType;
};

export function StepServices() {
    const { items, addItem, removeItem, setStep } = useBudgetStore();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemFormSchema) as any,
        defaultValues: {
            type: ServiceType.CONSULTANCY,
            unit: UnitType.HOUR,
            quantity: 1,
            unitPrice: 0,
            customType: '',
        }
    });

    const selectedType = watch('type');
    const isCustomType = selectedType === 'custom';

    const onAddItem = (data: ItemFormData) => {
        const finalType = data.type === 'custom' ? data.customType! : data.type;

        const id = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 11);

        addItem({
            ...data,
            type: finalType,
            id,
        });

        reset({
            type: ServiceType.CONSULTANCY,
            unit: UnitType.HOUR,
            quantity: 1,
            description: '',
            unitPrice: 0,
            customType: '',
        });
    };

    const [listError, setListError] = React.useState<string | null>(null);

    const onNext = () => {
        if (items.length === 0) {
            setListError("Adicione pelo menos um item ao orçamento para continuar.");
            return;
        }
        setStep(4);
    };

    React.useEffect(() => {
        if (items.length > 0) {
            setListError(null);
        }
    }, [items.length]);

    return (
        <Card title="Serviços e Itens" description="Adicione os serviços ou produtos ao orçamento.">
            <div className="space-y-6">
                {/* Form to add new item */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Adicionar Novo Item</h4>
                    <form onSubmit={handleSubmit(onAddItem)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            <div className="md:col-span-3">
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Tipo</label>
                                <select
                                    {...register('type')}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    {Object.values(ServiceType).map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                    <option value="custom">+ Novo Tipo</option>
                                </select>
                                {isCustomType && (
                                    <div className="mt-2">
                                        <Input
                                            placeholder="Qual tipo?"
                                            error={errors.customType?.message}
                                            {...register('customType')}
                                            autoFocus
                                        />
                                    </div>
                                )}
                                {!isCustomType && errors.type && <span className="text-xs text-red-500">{errors.type.message}</span>}
                            </div>

                            <div className="md:col-span-5">
                                <Input
                                    label="Descrição"
                                    placeholder="Ex: Desenvolvimento Web"
                                    error={errors.description?.message}
                                    {...register('description')}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="Valor Unit."
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    error={errors.unitPrice?.message}
                                    {...register('unitPrice')}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="Qtd"
                                    type="number"
                                    error={errors.quantity?.message}
                                    {...register('quantity')}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="w-1/2 md:w-1/3">
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Unidade</label>
                                <select
                                    {...register('unit')}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    {Object.values(UnitType).map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" size="sm" variant="secondary" className="font-bold">
                                <Plus className="w-4 h-4 mr-2" /> Adicionar na Lista
                            </Button>
                        </div>
                    </form>
                </div>

                {/* List of added items */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Itens Adicionados ({items.length})</h4>

                    {items.length === 0 ? (
                        <p className="text-sm text-gray-500 italic p-4 text-center border border-dashed rounded-md">
                            Nenhum item adicionado ainda. Use o formulário acima para adicionar serviços.
                        </p>
                    ) : (
                        <div className="border rounded-md divide-y overflow-hidden">
                            {items.map((item) => (
                                <div key={item.id} className="p-3 flex items-center justify-between text-sm bg-white">
                                    <div className="grid grid-cols-12 gap-4 w-full items-center">
                                        <span className="col-span-2 font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs text-center">{item.type}</span>
                                        <span className="col-span-4 font-medium">{item.description}</span>
                                        <span className="col-span-2 text-right text-gray-500">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                                        </span>
                                        <span className="col-span-2 text-center text-gray-500 text-xs">
                                            {item.quantity} {item.unit}
                                        </span>
                                        <span className="col-span-2 text-right font-semibold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice * item.quantity)}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="flex justify-end pt-4">
                            <div className="text-xl font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border">
                                Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t mt-6">
                    {listError && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
                            {listError}
                        </div>
                    )}
                    <div className="flex justify-between items-center w-full">
                        <Button type="button" variant="outline" onClick={() => setStep(2)}>
                            Voltar
                        </Button>
                        <Button onClick={onNext} className="bg-gray-900 hover:bg-gray-800 text-white font-bold">
                            Próximo Passo
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
