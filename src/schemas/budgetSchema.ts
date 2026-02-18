
import { z } from 'zod';
import { ServiceType, UnitType } from '@/types/budget';

export const contactSchema = z.object({
    firstName: z.string().min(2, 'Nome é obrigatório'),
    lastName: z.string().min(2, 'Sobrenome é obrigatório'),
    phone: z.string().min(10, 'Telefone inválido'),
    email: z.string().email('E-mail inválido'),
    taxId: z.string().min(11, 'CPF/CNPJ inválido'),
});

export const serviceItemSchema = z.object({
    id: z.string(),
    description: z.string().min(3, 'Descrição muito curta'),
    type: z.string().min(1, 'Tipo é obrigatório'),
    unitPrice: z.number().min(0.01, 'Valor deve ser positivo'),
    quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
    unit: z.nativeEnum(UnitType),
});

export const budgetDetailsSchema = z.object({
    validUntil: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Data de validade deve ser futura',
    }),
    notes: z.string().optional(),
});
