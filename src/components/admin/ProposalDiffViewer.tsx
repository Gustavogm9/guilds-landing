import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { diffJson, diffLines } from 'diff';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProposals } from '@/hooks/useProposals';
import { ArrowLeft } from 'lucide-react';

export const ProposalDiffViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useProposalVersions } = useProposals();
  const { data: versions } = useProposalVersions(id || '');
  
  const [fromVersion, setFromVersion] = useState<number>(1);
  const [toVersion, setToVersion] = useState<number>(2);

  const diffResult = useMemo(() => {
    if (!versions || versions.length < 2) return null;
    
    const vFrom = versions.find(v => v.version_number === fromVersion);
    const vTo = versions.find(v => v.version_number === toVersion);
    
    if (!vFrom || !vTo) return null;
    
    return {
      variables: diffJson(vFrom.variables || {}, vTo.variables || {}),
      pricing: diffJson(vFrom.pricing || {}, vTo.pricing || {}),
      sections: diffSections(vFrom.sections || [], vTo.sections || [])
    };
  }, [versions, fromVersion, toVersion]);

  function diffSections(fromSections: any[], toSections: any[]) {
    const result: any[] = [];
    
    // Removed sections
    fromSections.forEach(section => {
      const exists = toSections.find((s: any) => s.key === section.key);
      if (!exists) {
        result.push({ ...section, status: 'removed' });
      }
    });
    
    // Added or modified sections
    toSections.forEach(section => {
      const original = fromSections.find((s: any) => s.key === section.key);
      
      if (!original) {
        result.push({ ...section, status: 'added' });
      } else if (JSON.stringify(original.body) !== JSON.stringify(section.body)) {
        const diff = diffLines(original.body || '', section.body || '');
        result.push({ 
          ...section, 
          status: 'modified',
          diff: diff.map(part => 
            part.added ? `+ ${part.value}` :
            part.removed ? `- ${part.value}` :
            `  ${part.value}`
          ).join('\n')
        });
      }
    });
    
    return result;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/propostas/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Comparar Versões</h1>
          <p className="text-muted-foreground">Visualize as alterações entre duas versões da proposta</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Select value={fromVersion.toString()} onValueChange={v => setFromVersion(parseInt(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Versão base" />
            </SelectTrigger>
            <SelectContent>
              {versions?.map(v => (
                <SelectItem key={v.id} value={v.version_number.toString()}>
                  Versão {v.version_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="flex-1">
          <Select value={toVersion.toString()} onValueChange={v => setToVersion(parseInt(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Versão comparar" />
            </SelectTrigger>
            <SelectContent>
              {versions?.filter(v => v.version_number > fromVersion).map(v => (
                <SelectItem key={v.id} value={v.version_number.toString()}>
                  Versão {v.version_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {diffResult && (
        <div className="space-y-6">
          {/* Variables Diff */}
          <Card>
            <CardHeader>
              <CardTitle>Alterações em Variáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-x-auto bg-muted p-4 rounded-lg">
                {diffResult.variables.map((part: any, idx: number) => (
                  <span
                    key={idx}
                    className={
                      part.added ? 'bg-green-100 text-green-800' :
                      part.removed ? 'bg-red-100 text-red-800 line-through' :
                      ''
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </pre>
            </CardContent>
          </Card>

          {/* Pricing Diff */}
          <Card>
            <CardHeader>
              <CardTitle>Alterações em Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-x-auto bg-muted p-4 rounded-lg">
                {diffResult.pricing.map((part: any, idx: number) => (
                  <span
                    key={idx}
                    className={
                      part.added ? 'bg-green-100 text-green-800' :
                      part.removed ? 'bg-red-100 text-red-800 line-through' :
                      ''
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </pre>
            </CardContent>
          </Card>

          {/* Sections Diff */}
          <Card>
            <CardHeader>
              <CardTitle>Seções Modificadas</CardTitle>
            </CardHeader>
            <CardContent>
              {diffResult.sections.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma alteração nas seções</p>
              ) : (
                diffResult.sections.map((section: any, idx: number) => (
                  <div key={idx} className="mb-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{section.title}</h4>
                      {section.status && (
                        <Badge variant={
                          section.status === 'added' ? 'default' :
                          section.status === 'removed' ? 'destructive' :
                          'secondary'
                        }>
                          {section.status === 'added' && 'Adicionada'}
                          {section.status === 'removed' && 'Removida'}
                          {section.status === 'modified' && 'Modificada'}
                        </Badge>
                      )}
                    </div>
                    {section.diff && (
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {section.diff}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
