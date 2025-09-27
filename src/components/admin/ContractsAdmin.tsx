import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLegal } from "@/hooks/useLegal";
import { ContractBuilder } from "./contracts/ContractBuilder";
import { ClauseManager } from "./contracts/ClauseManager";
import { TemplateManager } from "./contracts/TemplateManager";
import { FileText, Plus, Eye, Send, Bot, Gavel } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ContractsAdmin = () => {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { contracts, contractsLoading } = useLegal();

  const contractStats = {
    total: contracts?.length || 0,
    draft: contracts?.filter(c => c.status === 'draft').length || 0,
    review: contracts?.filter(c => c.status === 'review').length || 0,
    sent: contracts?.filter(c => c.status === 'approved').length || 0,
    signed: contracts?.filter(c => c.status === 'signed').length || 0,
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      review: "outline",
      approved: "default",
      signed: "premium"
    } as const;
    
    const labels = {
      draft: "Rascunho",
      review: "Em Revisão", 
      approved: "Enviado",
      signed: "Assinado"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (selectedContractId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Contrato</h1>
            <p className="text-muted-foreground">
              Editando contrato existente
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedContractId(null)}
          >
            Voltar à Lista
          </Button>
        </div>

        <ContractBuilder contractId={selectedContractId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sistema Jurídico</h1>
        <p className="text-muted-foreground">
          Geração de contratos com IA, gestão de cláusulas e assinatura eletrônica
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="clauses">Cláusulas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Rascunho</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractStats.draft}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractStats.review}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assinados</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractStats.signed}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>
                  Principais funcionalidades do sistema jurídico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("contracts")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Contrato
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("clauses")}
                >
                  <Gavel className="mr-2 h-4 w-4" />
                  Gerenciar Cláusulas
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("templates")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Templates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contratos Recentes</CardTitle>
                <CardDescription>
                  Últimos contratos criados ou modificados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contractsLoading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : contracts && contracts.length > 0 ? (
                  <div className="space-y-3">
                    {contracts.slice(0, 5).map((contract) => (
                      <div 
                        key={contract.id} 
                        className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedContractId(contract.id)}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {contract.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(contract.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contract.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhum contrato encontrado. Crie seu primeiro contrato!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Contratos</h2>
              <p className="text-muted-foreground">
                Gerencie todos os contratos do sistema
              </p>
            </div>
            <Button onClick={() => setSelectedContractId("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contrato
            </Button>
          </div>

          {selectedContractId === "new" ? (
            <ContractBuilder contractId={null} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Contratos</CardTitle>
                <CardDescription>
                  Todos os contratos criados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contractsLoading ? (
                  <p className="text-muted-foreground">Carregando contratos...</p>
                ) : contracts && contracts.length > 0 ? (
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <div 
                        key={contract.id}
                        className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedContractId(contract.id)}
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{contract.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Contrato #{contract.contract_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Criado {formatDistanceToNow(new Date(contract.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contract.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium">Nenhum contrato encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Comece criando seu primeiro contrato.
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setSelectedContractId("new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Contrato
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="clauses" className="space-y-4">
          <ClauseManager />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};