'use client';

import React, { useRef } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReactToPrint } from 'react-to-print';
import { Download, FileText, Printer } from 'lucide-react';

export function StepPreview() {
    const { provider, client, items, validUntil, notes, setStep } = useBudgetStore();
    const componentRef = useRef<HTMLDivElement>(null);
    const [hasHydrated, setHasHydrated] = React.useState(false);
    const [budgetNo, setBudgetNo] = React.useState('');
    const [issuedDate, setIssuedDate] = React.useState('');

    React.useEffect(() => {
        setHasHydrated(true);
        setBudgetNo(Math.floor(Math.random() * 10000).toString().padStart(5, '0'));
        setIssuedDate(new Date().toLocaleDateString('pt-BR'));
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Orcamento_${client.firstName}_${client.lastName}`,
    });

    const total = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (date: string | Date) => {
        if (!date) return 'Não informada';
        return new Date(date).toLocaleDateString('pt-BR');
    };

    if (!hasHydrated) {
        return null;
    }

    return (
        <div className="space-y-6">
            <Card title="Pré-visualização do Orçamento" description="Verifique os dados antes de gerar o PDF.">
                <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4 no-print">
                    <Button variant="outline" size="sm" onClick={() => setStep(4)} className="w-full sm:w-auto">
                        Voltar e Editar
                    </Button>
                    <Button size="sm" onClick={() => handlePrint()} className="w-full sm:w-auto">
                        <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
                    </Button>
                </div>

                <div
                    ref={componentRef}
                    className="bg-white p-4 sm:p-6 md:p-12 shadow-sm border rounded-lg text-gray-800 font-sans print:shadow-none print:border-none print:p-0 overflow-x-auto"
                    id="budget-document"
                >
                    <style>
                        {`
                            @media print {
                                @page {
                                    margin: 20mm;
                                    size: auto;
                                }
                                .print-avoid-break {
                                    break-inside: avoid-page;
                                    page-break-inside: avoid;
                                }
                                /* Hide shadows and borders for the main document when printing */
                                #budget-document {
                                    box-shadow: none !important;
                                    border: none !important;
                                    padding: 0 !important;
                                    overflow-x: visible !important;
                                }
                            }
                        `}
                    </style>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b pb-6 sm:pb-8 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tight mb-1">Orçamento</h1>
                            <p className="text-sm text-gray-500">Emitido em {issuedDate}</p>
                        </div>
                        <div className="sm:text-right">
                            <div className="font-bold text-gray-900">Nº {budgetNo}</div>
                        </div>
                    </div>

                    {/* Columns: Provider vs Client */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 mb-8 sm:mb-10">
                        <div>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">Prestador</h2>
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">{provider.firstName} {provider.lastName}</p>
                                <p className="text-xs sm:text-sm text-gray-600">CPF/CNPJ: {provider.taxId}</p>
                                <p className="text-xs sm:text-sm text-gray-600 break-all">Email: {provider.email}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Tel: {provider.phone}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">Contratante</h2>
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">{client.firstName} {client.lastName}</p>
                                <p className="text-xs sm:text-sm text-gray-600">CPF/CNPJ: {client.taxId}</p>
                                <p className="text-xs sm:text-sm text-gray-600 break-all">Email: {client.email}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Tel: {client.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Body: Table */}
                    <div className="mb-8 sm:mb-10 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Descrição</th>
                                    <th className="py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Tipo</th>
                                    <th className="py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Preço Unit.</th>
                                    <th className="py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Qtd</th>
                                    <th className="py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <tr key={item.id} className="print-avoid-break">
                                        <td className="py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{item.description}</td>
                                        <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-500 text-center">{item.type}</td>
                                        <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-600 text-right whitespace-nowrap">{formatCurrency(item.unitPrice)}</td>
                                        <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-500 text-center whitespace-nowrap">{item.quantity} {item.unit}</td>
                                        <td className="py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(item.unitPrice * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-100">
                                    <td colSpan={4} className="py-4 sm:py-6 text-right font-bold text-gray-900 text-base sm:text-lg">Total do Orçamento</td>
                                    <td className="py-4 sm:py-6 text-right font-bold text-gray-900 text-base sm:text-lg whitespace-nowrap">{formatCurrency(total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer: Notes and Signature */}
                    <div className="space-y-8 sm:space-y-12">
                        {notes && (
                            <div className="print-avoid-break">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">Observações</h2>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{notes}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-8 sm:pt-16 print-avoid-break">
                            <div className="flex flex-col items-center">
                                <div className="w-full border-t border-gray-400 mb-2"></div>
                                <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase text-center">{provider.firstName} {provider.lastName}</p>
                                <p className="text-xs text-gray-500 text-center">CPF/CNPJ: {provider.taxId}</p>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest mt-1">Prestador</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-full border-t border-gray-400 mb-2"></div>
                                <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase text-center">{client.firstName} {client.lastName}</p>
                                <p className="text-xs text-gray-500 text-center">CPF/CNPJ: {client.taxId}</p>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest mt-1">Contratante</p>
                            </div>
                        </div>

                        <div className="pt-6 sm:pt-8 text-center border-t border-gray-50">
                            <p className="text-xs text-gray-400">
                                Proposta válida até: <span className="text-gray-900 font-semibold">{formatDate(validUntil)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
