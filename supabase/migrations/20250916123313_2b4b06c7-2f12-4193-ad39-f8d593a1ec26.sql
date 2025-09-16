-- Sistema de Gestão Financeira da Guilds
-- Criando estrutura completa de dados financeiros

-- Plano de Contas
CREATE TABLE public.chart_of_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_id UUID REFERENCES public.chart_of_accounts(id),
  level INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Centros de Custo
CREATE TABLE public.cost_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT NOT NULL, -- 'development', 'marketing', 'admin', 'sales'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fornecedores
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT, -- CPF/CNPJ
  email TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  payment_terms INTEGER DEFAULT 30, -- dias
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contas a Pagar
CREATE TABLE public.accounts_payable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.suppliers(id),
  project_id UUID REFERENCES public.projects(id),
  cost_center_id UUID REFERENCES public.cost_centers(id),
  account_id UUID REFERENCES public.chart_of_accounts(id),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT, -- 'pix', 'transfer', 'boleto', 'card'
  invoice_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contas a Receber
CREATE TABLE public.accounts_receivable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.crm_contacts(id),
  project_id UUID REFERENCES public.projects(id),
  deal_id UUID REFERENCES public.crm_deals(id),
  account_id UUID REFERENCES public.chart_of_accounts(id),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  invoice_number TEXT,
  installment_number INTEGER DEFAULT 1,
  total_installments INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Funcionários/Folha de Pagamento
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  document TEXT, -- CPF
  job_title TEXT,
  department TEXT,
  cost_center_id UUID REFERENCES public.cost_centers(id),
  hire_date DATE,
  salary DECIMAL(10,2),
  salary_type TEXT DEFAULT 'monthly' CHECK (salary_type IN ('monthly', 'hourly', 'project')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Folha de Pagamento
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  reference_month DATE NOT NULL, -- primeiro dia do mês
  gross_salary DECIMAL(10,2) NOT NULL,
  deductions JSONB DEFAULT '{}', -- INSS, IR, etc
  additions JSONB DEFAULT '{}', -- horas extras, bônus
  net_salary DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'calculated' CHECK (status IN ('calculated', 'paid')),
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transações Financeiras (movimentações gerais)
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.chart_of_accounts(id),
  cost_center_id UUID REFERENCES public.cost_centers(id),
  project_id UUID REFERENCES public.projects(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID, -- pode referenciar contas a pagar/receber, folha, etc
  reference_type TEXT, -- 'payable', 'receivable', 'payroll', 'manual'
  transaction_date DATE NOT NULL,
  category TEXT, -- para classificação adicional
  tags TEXT[],
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orçamentos
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Itens do Orçamento
CREATE TABLE public.budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID REFERENCES public.budgets(id),
  account_id UUID REFERENCES public.chart_of_accounts(id),
  cost_center_id UUID REFERENCES public.cost_centers(id),
  amount DECIMAL(15,2) NOT NULL,
  period_type TEXT NOT NULL DEFAULT 'monthly' CHECK (period_type IN ('monthly', 'quarterly', 'annual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projeções/Forecasting
CREATE TABLE public.financial_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scenario TEXT NOT NULL CHECK (scenario IN ('optimistic', 'realistic', 'pessimistic')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  based_on_crm BOOLEAN DEFAULT true, -- se usa dados do CRM para projeção
  assumptions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Itens das Projeções
CREATE TABLE public.forecast_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  forecast_id UUID REFERENCES public.financial_forecasts(id),
  account_id UUID REFERENCES public.chart_of_accounts(id),
  cost_center_id UUID REFERENCES public.cost_centers(id),
  month_year DATE NOT NULL, -- primeiro dia do mês
  projected_amount DECIMAL(15,2) NOT NULL,
  confidence_level INTEGER DEFAULT 80, -- 0-100%
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Importações de Excel
CREATE TABLE public.excel_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  import_type TEXT NOT NULL, -- 'transactions', 'payables', 'receivables', etc
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  total_rows INTEGER,
  processed_rows INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  mapping JSONB, -- mapeamento de colunas
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Triggers para updated_at
CREATE TRIGGER update_chart_of_accounts_updated_at
  BEFORE UPDATE ON public.chart_of_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cost_centers_updated_at
  BEFORE UPDATE ON public.cost_centers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_payable_updated_at
  BEFORE UPDATE ON public.accounts_payable
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_receivable_updated_at
  BEFORE UPDATE ON public.accounts_receivable
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_forecasts_updated_at
  BEFORE UPDATE ON public.financial_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_imports ENABLE ROW LEVEL SECURITY;

-- Políticas (apenas usuários autenticados podem acessar dados financeiros)
CREATE POLICY "Only authenticated users can manage financial data" 
ON public.chart_of_accounts FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage cost centers" 
ON public.cost_centers FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage suppliers" 
ON public.suppliers FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage accounts payable" 
ON public.accounts_payable FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage accounts receivable" 
ON public.accounts_receivable FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage employees" 
ON public.employees FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage payroll" 
ON public.payroll FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage transactions" 
ON public.financial_transactions FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage budgets" 
ON public.budgets FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage budget items" 
ON public.budget_items FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage forecasts" 
ON public.financial_forecasts FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage forecast items" 
ON public.forecast_items FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage imports" 
ON public.excel_imports FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Inserir dados iniciais
INSERT INTO public.chart_of_accounts (code, name, account_type, level) VALUES
-- Ativo
('1', 'ATIVO', 'asset', 1),
('1.1', 'Ativo Circulante', 'asset', 2),
('1.1.1', 'Caixa e Equivalentes', 'asset', 3),
('1.1.1.001', 'Caixa', 'asset', 4),
('1.1.1.002', 'Banco Conta Corrente', 'asset', 4),
('1.1.2', 'Contas a Receber', 'asset', 3),
('1.1.2.001', 'Clientes', 'asset', 4),

-- Passivo
('2', 'PASSIVO', 'liability', 1),
('2.1', 'Passivo Circulante', 'liability', 2),
('2.1.1', 'Contas a Pagar', 'liability', 3),
('2.1.1.001', 'Fornecedores', 'liability', 4),
('2.1.1.002', 'Salários a Pagar', 'liability', 4),

-- Receita
('3', 'RECEITAS', 'revenue', 1),
('3.1', 'Receita de Serviços', 'revenue', 2),
('3.1.1', 'Desenvolvimento de Software', 'revenue', 3),
('3.1.2', 'Automação e IA', 'revenue', 3),
('3.1.3', 'Jogos Corporativos', 'revenue', 3),
('3.1.4', 'Workshops', 'revenue', 3),

-- Despesas
('4', 'DESPESAS', 'expense', 1),
('4.1', 'Despesas Operacionais', 'expense', 2),
('4.1.1', 'Pessoal', 'expense', 3),
('4.1.1.001', 'Salários', 'expense', 4),
('4.1.1.002', 'Encargos Sociais', 'expense', 4),
('4.1.2', 'Administrativas', 'expense', 3),
('4.1.2.001', 'Aluguel', 'expense', 4),
('4.1.2.002', 'Energia Elétrica', 'expense', 4),
('4.1.2.003', 'Internet', 'expense', 4),
('4.1.3', 'Marketing', 'expense', 3),
('4.1.3.001', 'Publicidade Online', 'expense', 4),
('4.1.3.002', 'Eventos', 'expense', 4);

-- Centros de Custo
INSERT INTO public.cost_centers (code, name, department) VALUES
('DEV', 'Desenvolvimento', 'development'),
('MKT', 'Marketing', 'marketing'),
('ADM', 'Administrativo', 'admin'),
('VEN', 'Vendas', 'sales'),
('LAB', 'Guilds Lab', 'development'),
('CRA', 'Guilds Craft', 'development');