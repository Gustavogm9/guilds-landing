-- Create craft stages table
CREATE TABLE public.craft_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'hsl(var(--primary))',
  icon_name TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create craft ideas table
CREATE TABLE public.craft_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'concept',
  current_stage UUID REFERENCES public.craft_stages(id),
  problem_thesis TEXT NOT NULL,
  target_persona TEXT NOT NULL,
  pain_points TEXT[],
  proposed_solution TEXT NOT NULL,
  mvp_description TEXT,
  business_model TEXT,
  revenue_streams TEXT[],
  risk_assessment TEXT,
  development_roadmap TEXT,
  ideal_partners TEXT[],
  required_skills TEXT[],
  estimated_timeline TEXT,
  estimated_investment TEXT,
  next_steps TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  meta_description TEXT,
  keywords TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create craft partnership inquiries table
CREATE TABLE public.craft_partnership_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES public.craft_ideas(id),
  partner_name TEXT NOT NULL,
  partner_email TEXT NOT NULL,
  company TEXT,
  partner_type TEXT NOT NULL DEFAULT 'technical',
  message TEXT NOT NULL,
  skills_offered TEXT[],
  investment_capacity TEXT,
  contact_info JSONB DEFAULT '{}',
  portfolio_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  source_page TEXT,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.craft_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craft_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craft_partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for craft_stages
CREATE POLICY "Stages are publicly readable" 
ON public.craft_stages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage stages" 
ON public.craft_stages 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for craft_ideas
CREATE POLICY "Ideas are publicly readable" 
ON public.craft_ideas 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage ideas" 
ON public.craft_ideas 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for craft_partnership_inquiries
CREATE POLICY "Anyone can submit partnership inquiries" 
ON public.craft_partnership_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read partnership inquiries" 
ON public.craft_partnership_inquiries 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update partnership inquiries" 
ON public.craft_partnership_inquiries 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_craft_stages_updated_at
  BEFORE UPDATE ON public.craft_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_craft_ideas_updated_at
  BEFORE UPDATE ON public.craft_ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_craft_partnership_inquiries_updated_at
  BEFORE UPDATE ON public.craft_partnership_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample stages
INSERT INTO public.craft_stages (name, slug, description, color, icon_name, display_order) VALUES
('Explorar', 'explorar', 'Pesquisa de mercado, identificação de oportunidades e validação inicial de hipóteses', 'hsl(210, 100%, 56%)', 'Search', 1),
('Validar', 'validar', 'MVP, testes com usuários reais e coleta de métricas de validação', 'hsl(45, 100%, 51%)', 'TestTube', 2),
('Construir', 'construir', 'Desenvolvimento completo com parcerias estabelecidas e recursos alocados', 'hsl(142, 76%, 36%)', 'Hammer', 3),
('Lançar', 'lancar', 'Go-to-market, scaling e expansão com estratégia de crescimento', 'hsl(262, 83%, 58%)', 'Rocket', 4);

-- Insert sample ideas
INSERT INTO public.craft_ideas (
  slug, title, status, current_stage, problem_thesis, target_persona, pain_points, 
  proposed_solution, mvp_description, business_model, revenue_streams, 
  risk_assessment, development_roadmap, ideal_partners, required_skills,
  estimated_timeline, estimated_investment, next_steps, is_featured, meta_description, keywords
) VALUES
(
  'ecotrack',
  'EcoTrack - Pegada de Carbono Empresarial',
  'validation',
  (SELECT id FROM public.craft_stages WHERE slug = 'validar'),
  'Empresas de médio porte não conseguem medir e reduzir sua pegada de carbono de forma eficiente devido à complexidade e custo das soluções atuais.',
  'Gestores de sustentabilidade e diretores de operações de PMEs com 50-500 funcionários',
  ARRAY['Falta de dados precisos sobre emissões', 'Soluções muito caras', 'Complexidade técnica', 'Falta de expertise interna'],
  'Plataforma SaaS que automatiza o cálculo da pegada de carbono empresarial com integração a sistemas existentes.',
  'Dashboard web com coleta automática de dados, relatórios de sustentabilidade e recomendações de redução.',
  'Freemium com planos pagos baseados no tamanho da empresa e funcionalidades avançadas.',
  ARRAY['SaaS subscription', 'Consultoria especializada', 'Marketplace de créditos de carbono'],
  'Competição com players estabelecidos, mudanças regulatórias, adoção lenta do mercado.',
  'Q1: MVP e primeiros clientes piloto, Q2: Integração com ERPs, Q3: Marketplace de créditos, Q4: Expansão',
  ARRAY['Investidores de impacto', 'Especialistas em sustentabilidade', 'Parceiros tecnológicos'],
  ARRAY['Desenvolvimento full-stack', 'Data science', 'Expertise em sustentabilidade', 'Sales B2B'],
  '12-18 meses para lançamento completo',
  'R$ 300-500k para MVP e primeiros 12 meses',
  'Finalizar testes com clientes piloto e validar modelo de precificação.',
  true,
  'Plataforma inovadora para empresas medirem e reduzirem sua pegada de carbono de forma automatizada.',
  ARRAY['sustentabilidade', 'pegada de carbono', 'ESG', 'tecnologia verde']
),
(
  'teachbot',
  'TeachBot - IA Educacional Personalizada',
  'development',
  (SELECT id FROM public.craft_stages WHERE slug = 'construir'),
  'Estudantes têm ritmos e estilos de aprendizagem diferentes, mas o ensino tradicional oferece uma abordagem única para todos.',
  'Estudantes de ensino médio e superior, professores e instituições educacionais privadas',
  ARRAY['Ensino padronizado', 'Falta de feedback personalizado', 'Dificuldade em identificar lacunas', 'Baixo engajamento'],
  'IA que cria trilhas de aprendizagem personalizadas baseadas no perfil cognitivo e progresso de cada estudante.',
  'Platform educacional com IA que adapta conteúdo, exercícios e metodologia ao perfil individual.',
  'B2B2C via instituições educacionais com licenciamento por estudante.',
  ARRAY['Licenças institucionais', 'Serviços de implementação', 'Conteúdo premium'],
  'Resistência institucional, necessidade de grande base de dados, questões de privacidade.',
  'Q1: Alpha com 3 escolas, Q2: Beta com 10 instituições, Q3: Produto comercial, Q4: Expansão regional',
  ARRAY['Instituições educacionais', 'Especialistas em pedagogia', 'Desenvolvedores de IA'],
  ARRAY['Machine learning', 'Desenvolvimento mobile/web', 'Pedagogia digital', 'UX/UI educacional'],
  '18-24 meses para produto comercial',
  'R$ 800k-1.2M para desenvolvimento e validação',
  'Buscar parceria com universidade para pesquisa e validação acadêmica.',
  true,
  'Inteligência artificial que personaliza o aprendizado para cada estudante individual.',
  ARRAY['educação', 'inteligência artificial', 'personalização', 'aprendizagem']
),
(
  'citypulse',
  'CityPulse - Dashboard Urbano Inteligente',
  'exploration',
  (SELECT id FROM public.craft_stages WHERE slug = 'explorar'),
  'Gestores públicos não têm acesso a dados urbanos em tempo real para tomar decisões informadas sobre trânsito, segurança e serviços.',
  'Secretários municipais, gestores de smart cities e empresas de consultoria urbana',
  ARRAY['Dados fragmentados', 'Falta de visualização', 'Decisões baseadas em intuição', 'Comunicação ineficiente'],
  'Dashboard que integra dados urbanos em tempo real (trânsito, criminalidade, serviços) com análise preditiva.',
  'Prova de conceito com dados públicos de São Paulo mostrando correlações e insights.',
  'B2G (Business to Government) com contratos de prestação de serviços.',
  ARRAY['Contratos governamentais', 'Licenciamento de tecnologia', 'Consultoria especializada'],
  'Burocracia governamental, dependência de dados públicos, ciclos de compra longos.',
  'Q1: Pesquisa e prototipação, Q2: Proof of concept, Q3: Piloto municipal, Q4: Validação',
  ARRAY['Governos municipais', 'Empresas de dados', 'Consultorias em smart cities'],
  ARRAY['Data engineering', 'Visualização de dados', 'Conhecimento em gestão pública', 'Business development'],
  '24-36 meses para implementação comercial',
  'R$ 400-600k para pesquisa e desenvolvimento',
  'Mapear dados disponíveis e identificar município parceiro para piloto.',
  false,
  'Dashboard inteligente que transforma dados urbanos em insights para gestão municipal.',
  ARRAY['smart city', 'dados urbanos', 'gestão pública', 'análise preditiva']
),
(
  'healthchain',
  'HealthChain - Prontuários em Blockchain',
  'launch',
  (SELECT id FROM public.craft_stages WHERE slug = 'lancar'),
  'Prontuários médicos são fragmentados entre diferentes prestadores, dificultando continuidade do cuidado e pesquisa médica.',
  'Hospitais, clínicas, planos de saúde e pacientes que buscam controle sobre seus dados',
  ARRAY['Dados médicos fragmentados', 'Falta de portabilidade', 'Questões de privacidade', 'Interoperabilidade limitada'],
  'Blockchain para prontuários médicos que garante propriedade dos dados pelo paciente e interoperabilidade entre prestadores.',
  'Produto em fase final de desenvolvimento com 2 hospitais piloto e certificação LGPD.',
  'B2B para prestadores de saúde com revenue share para pesquisa médica.',
  ARRAY['Licenças para prestadores', 'Revenue share em pesquisa', 'Serviços de implementação'],
  'Regulamentação complexa, resistência à mudança, questões técnicas de escalabilidade.',
  'Q1: Go-to-market com primeiros clientes, Q2: Expansão regional, Q3: Parcerias estratégicas, Q4: Internacional',
  ARRAY['Investidores de health tech', 'Prestadores de saúde', 'Especialistas em blockchain'],
  ARRAY['Blockchain development', 'Regulamentação de saúde', 'Sales enterprise', 'Compliance LGPD'],
  'Produto pronto para lançamento comercial',
  'R$ 1.5-2M para expansão e go-to-market',
  'Executar estratégia de go-to-market e captar primeiros clientes pagantes.',
  true,
  'Blockchain que revoluciona o compartilhamento seguro de dados médicos entre prestadores.',
  ARRAY['blockchain', 'saúde digital', 'prontuário eletrônico', 'LGPD']
);