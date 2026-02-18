
export enum ServiceType {
  CONSULTANCY = 'Consultoria',
  DEVELOPMENT = 'Desenvolvimento',
  DESIGN = 'Design',
  OTHER = 'Outros',
}

export enum UnitType {
  HOUR = 'Hora',
  QUANTITY = 'Qtd',
  KG = 'KG',
  METER = 'Metro',
  PROJECT = 'Projeto',
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  taxId: string; // CPF or CNPJ
}

export interface ServiceItem {
  id: string;
  description: string;
  type: ServiceType | string; // Allow custom types
  unitPrice: number;
  quantity: number;
  unit: UnitType;
}

export interface BudgetData {
  provider: ContactInfo;
  client: ContactInfo;
  items: ServiceItem[];
  validUntil: string | Date; // Date string or Date object
  notes?: string;
}

export interface BudgetState extends BudgetData {
  currentStep: number;
  setStep: (step: number) => void;
  updateProvider: (data: Partial<ContactInfo>) => void;
  updateClient: (data: Partial<ContactInfo>) => void;
  addItem: (item: ServiceItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, data: Partial<ServiceItem>) => void;
  updateBudgetDetails: (data: Partial<Pick<BudgetData, 'validUntil' | 'notes'>>) => void;
  reset: () => void;
}
