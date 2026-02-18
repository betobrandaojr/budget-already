
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, ServiceType, UnitType, ServiceItem } from '@/types/budget';

const initialContactState = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    taxId: '',
};

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set) => ({
            currentStep: 1,
            provider: { ...initialContactState },
            client: { ...initialContactState },
            items: [],
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days from now
            notes: '',

            setStep: (step) => set({ currentStep: step }),

            updateProvider: (data) =>
                set((state) => ({
                    provider: { ...state.provider, ...data },
                })),

            updateClient: (data) =>
                set((state) => ({
                    client: { ...state.client, ...data },
                })),

            addItem: (item) =>
                set((state) => ({
                    items: [...state.items, item],
                })),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            updateItem: (id, data) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, ...data } : item
                    ),
                })),

            updateBudgetDetails: (data) =>
                set((state) => ({ ...state, ...data })),

            reset: () =>
                set({
                    currentStep: 1,
                    provider: { ...initialContactState },
                    client: { ...initialContactState },
                    items: [],
                    validUntil: '',
                    notes: '',
                }),
        }),
        {
            name: 'budget-storage',
        }
    )
);
