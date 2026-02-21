import { describe, it, expect } from 'vitest';
import { contactSchema, serviceItemSchema, budgetDetailsSchema } from './budgetSchema';
import { UnitType } from '@/types/budget';

describe('budgetSchema', () => {
    describe('contactSchema', () => {
        it('should validate a correct contact', () => {
            const validContact = {
                firstName: 'Joao',
                lastName: 'Silva',
                phone: '11988888888',
                email: 'joao@silva.com',
                taxId: '12345678909'
            };
            const result = contactSchema.safeParse(validContact);
            expect(result.success).toBe(true);
        });

        it('should fail if email is invalid', () => {
            const invalidContact = {
                firstName: 'Joao',
                lastName: 'Silva',
                phone: '11988888888',
                email: 'invalid-email',
                taxId: '12345678909'
            };
            const result = contactSchema.safeParse(invalidContact);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('E-mail inválido');
            }
        });

        it('should fail if phone is too short', () => {
            const invalidContact = {
                firstName: 'Joao',
                lastName: 'Silva',
                phone: '123',
                email: 'joao@silva.com',
                taxId: '12345678909'
            };
            const result = contactSchema.safeParse(invalidContact);
            expect(result.success).toBe(false);
        });
    });

    describe('serviceItemSchema', () => {
        it('should validate a correct service item', () => {
            const validItem = {
                id: '1',
                description: 'Service Description',
                type: 'Consultoria',
                unitPrice: 100,
                quantity: 1,
                unit: UnitType.HOUR
            };
            const result = serviceItemSchema.safeParse(validItem);
            expect(result.success).toBe(true);
        });

        it('should fail if unitPrice is zero or negative', () => {
            const invalidItem = {
                id: '1',
                description: 'Service Description',
                type: 'Consultoria',
                unitPrice: 0,
                quantity: 1,
                unit: UnitType.HOUR
            };
            const result = serviceItemSchema.safeParse(invalidItem);
            expect(result.success).toBe(false);
        });
    });

    describe('budgetDetailsSchema', () => {
        it('should fail if validUntil is in the past', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);

            const invalidDetails = {
                validUntil: pastDate.toISOString().split('T')[0],
                notes: 'Test'
            };
            const result = budgetDetailsSchema.safeParse(invalidDetails);
            expect(result.success).toBe(false);
        });

        it('should validate a future date', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 7);

            const validDetails = {
                validUntil: futureDate.toISOString().split('T')[0],
                notes: 'Test'
            };
            const result = budgetDetailsSchema.safeParse(validDetails);
            expect(result.success).toBe(true);
        });
    });
});
