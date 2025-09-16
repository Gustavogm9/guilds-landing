import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  PlusCircle,
  UserPlus,
  Download,
  Calculator
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email?: string;
  document?: string;
  job_title?: string;
  department?: string;
  hire_date?: string;
  salary?: number;
  salary_type: 'monthly' | 'hourly' | 'project';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PayrollEntry {
  id: string;
  employee_id: string;
  reference_month: string;
  gross_salary: number;
  deductions: any;
  additions: any;
  net_salary: number;
  status: 'calculated' | 'paid';
  payment_date?: string;
  created_at: string;
  employee?: Employee;
}

export function PayrollAdmin() {
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Employee[];
    },
  });

  // Fetch payroll entries
  const { data: payrollEntries = [], isLoading: payrollLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll')
        .select(`
          *,
          employee:employees(*)
        `)
        .order('reference_month', { ascending: false });
      
      if (error) throw error;
      return data as PayrollEntry[];
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(employee)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar funcionário');
      console.error('Error creating employee:', error);
    },
  });

  // Calculate payroll mutation
  const calculatePayrollMutation = useMutation({
    mutationFn: async ({ month, year }: { month: number; year: number }) => {
      const referenceMonth = `${year}-${month.toString().padStart(2, '0')}-01`;
      
      // Calculate payroll for all active employees
      const payrollEntries = employees.map(employee => {
        const grossSalary = employee.salary || 0;
        // Simple calculation - in real system would include taxes, benefits etc
        const inss = grossSalary * 0.11; // 11% INSS (simplified)
        const ir = grossSalary > 2000 ? grossSalary * 0.075 : 0; // IR simplified
        const totalDeductions = inss + ir;
        const netSalary = grossSalary - totalDeductions;

        return {
          employee_id: employee.id,
          reference_month: referenceMonth,
          gross_salary: grossSalary,
          deductions: { inss, ir },
          additions: {},
          net_salary: netSalary,
          status: 'calculated' as const
        };
      });

      const { data, error } = await supabase
        .from('payroll')
        .insert(payrollEntries)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast.success('Folha de pagamento calculada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao calcular folha de pagamento');
      console.error('Error calculating payroll:', error);
    },
  });

  const isLoading = employeesLoading || payrollLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Folha de Pagamento</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded w-24 mb-2"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalGrossSalary = payrollEntries
    .filter(p => p.reference_month === getCurrentMonth())
    .reduce((sum, p) => sum + p.gross_salary, 0);

  const totalNetSalary = payrollEntries
    .filter(p => p.reference_month === getCurrentMonth())
    .reduce((sum, p) => sum + p.net_salary, 0);

  const activeEmployeesCount = employees.length;

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01`;
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      calculated: 'default',
      paid: 'default'
    } as const;
    
    const labels = {
      calculated: 'Calculado',
      paid: 'Pago'
    };
    
    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || 'default'}
        className={status === 'paid' ? 'bg-primary text-primary-foreground' : ''}
      >
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Folha de Pagamento</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={() => {
              const now = new Date();
              calculatePayrollMutation.mutate({ 
                month: now.getMonth() + 1, 
                year: now.getFullYear() 
              });
            }}
            disabled={calculatePayrollMutation.isPending}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Folha
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployeesCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de colaboradores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salário Bruto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGrossSalary)}</div>
            <p className="text-xs text-muted-foreground">
              Mês atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salário Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalNetSalary)}</div>
            <p className="text-xs text-muted-foreground">
              Após descontos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="payroll">Folha de Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Funcionários</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gerencie sua equipe e salários
                  </p>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Funcionário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.job_title} • {employee.department}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(employee.salary || 0)}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {employee.salary_type === 'monthly' ? 'Mensal' : 
                           employee.salary_type === 'hourly' ? 'Por hora' : 'Por projeto'}
                        </div>
                      </div>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                  </div>
                ))}
                {employees.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum funcionário cadastrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Folha de Pagamento</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Histórico de pagamentos e cálculos
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const now = new Date();
                    calculatePayrollMutation.mutate({ 
                      month: now.getMonth() + 1, 
                      year: now.getFullYear() 
                    });
                  }}
                  disabled={calculatePayrollMutation.isPending}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Recalcular
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollEntries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{entry.employee?.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.reference_month).toLocaleDateString('pt-BR', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(entry.net_salary)}</div>
                        <div className="text-sm text-muted-foreground">
                          Bruto: {formatCurrency(entry.gross_salary)}
                        </div>
                      </div>
                      {getStatusBadge(entry.status)}
                    </div>
                  </div>
                ))}
                {payrollEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma folha de pagamento calculada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}