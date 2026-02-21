import { describe, it, expect, beforeEach } from 'vitest';
import { useBudgetStore } from './useBudgetStore';
import { UnitType } from '@/types/budget';

describe('useBudgetStore', () => {
    beforeEach(() => {
        const { reset } = useBudgetStore.getState();
        reset();
    });

    it('should have initial state', () => {
        const state = useBudgetStore.getState();
        expect(state.currentStep).toBe(1);
        expect(state.items).toEqual([]);
        expect(state.provider.firstName).toBe('');
    });

    it('should set current step', () => {
        const { setStep } = useBudgetStore.getState();
        setStep(2);
        expect(useBudgetStore.getState().currentStep).toBe(2);
    });

    it('should update provider data', () => {
        const { updateProvider } = useBudgetStore.getState();
        updateProvider({ firstName: 'Joao', lastName: 'Silva' });

        const state = useBudgetStore.getState();
        expect(state.provider.firstName).toBe('Joao');
        expect(state.provider.lastName).toBe('Silva');
    });

    it('should add a service item', () => {
        const { addItem } = useBudgetStore.getState();
        const newItem = {
            id: '1',
            description: 'Dev Prep',
            type: 'Desenvolvimento',
            unitPrice: 1000,
            quantity: 1,
            unit: UnitType.HOUR
        };

        addItem(newItem);
        expect(useBudgetStore.getState().items).toHaveLength(1);
        expect(useBudgetStore.getState().items[0].description).toBe('Dev Prep');
    });

    it('should remove a service item', () => {
        const { addItem, removeItem } = useBudgetStore.getState();
        addItem({ id: '1', description: 'Item 1', type: 'T', unitPrice: 10, quantity: 1, unit: UnitType.QUANTITY });
        addItem({ id: '2', description: 'Item 2', type: 'T', unitPrice: 20, quantity: 1, unit: UnitType.QUANTITY });

        removeItem('1');
        const state = useBudgetStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe('2');
    });

    it('should reset state', () => {
        const { updateProvider, addItem, reset } = useBudgetStore.getState();
        updateProvider({ firstName: 'Test' });
        addItem({ id: '1', description: 'Item', type: 'T', unitPrice: 10, quantity: 1, unit: UnitType.QUANTITY });

        reset();
        const state = useBudgetStore.getState();
        expect(state.provider.firstName).toBe('');
        expect(state.items).toHaveLength(0);
        expect(state.currentStep).toBe(1);
    });
});
