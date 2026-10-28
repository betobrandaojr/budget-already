'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { StepProvider } from '@/components/budget-form/StepProvider';
import { StepClient } from '@/components/budget-form/StepClient';
import { StepServices } from '@/components/budget-form/StepServices';
import { StepFinalization } from '@/components/budget-form/StepFinalization';
import { StepPreview } from '@/components/budget-form/StepPreview';
import { cn } from '@/components/ui/Input';
import { Check } from 'lucide-react';

export default function Home() {
  const { currentStep } = useBudgetStore();
  const [hasHydrated, setHasHydrated] = React.useState(false);

  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  const steps = [
    { id: 1, name: 'Prestador' },
    { id: 2, name: 'Contratante' },
    { id: 3, name: 'Serviços' },
    { id: 4, name: 'Finalização' },
    { id: 5, name: 'Preview' },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProvider />;
      case 2:
        return <StepClient />;
      case 3:
        return <StepServices />;
      case 4:
        return <StepFinalization />;
      case 5:
        return <StepPreview />;
      default:
        return <StepProvider />;
    }
  };

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            Budget Master
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base px-2">
            Crie orçamentos profissionais de forma rápida, elegante e 100% gratuita.
          </p>
        </div>

        {/* Progress Indicators */}
        <nav aria-label="Progress" className="max-w-xl mx-auto px-2 sm:px-0">
          <ol className="flex items-center justify-between w-full">
            {steps.map((step, idx) => (
              <li key={step.id} className={cn("relative", idx !== steps.length - 1 && "w-full")}>
                <div className="flex items-center group">
                  <div
                    className={cn(
                      "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all duration-200 z-10",
                      currentStep > step.id
                        ? "bg-gray-900 border-gray-900 text-white"
                        : currentStep === step.id
                          ? "bg-white border-gray-900 text-gray-900 ring-4 ring-gray-100"
                          : "bg-white border-gray-200 text-gray-400"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <span className="text-xs font-bold">{step.id}</span>
                    )}
                  </div>

                  {/* Line connector */}
                  {idx !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-3.5 sm:top-4 left-3.5 sm:left-4 h-0.5 w-full -z-0 transition-colors duration-300",
                        currentStep > step.id ? "bg-gray-900" : "bg-gray-200"
                      )}
                    />
                  )}

                  {/* Label (Desktop only) */}
                  <span
                    className={cn(
                      "absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden md:block transition-colors",
                      currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content Section */}
        <div className="pt-6 sm:pt-4 transition-all duration-300 ease-in-out">
          {hasHydrated ? renderStep() : <div className="h-[400px] flex items-center justify-center text-gray-400">Carregando...</div>}
        </div>

        {/* Footer Section */}
        <footer className="text-center pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            © {hasHydrated ? new Date().getFullYear() : '2026'} Budget Master - Micro SaaS para Orçamentos.
          </p>
        </footer>
      </div>
    </main>
  );
}
