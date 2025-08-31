-- Create company manifesto table
CREATE TABLE public.company_manifesto (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manifesto_title TEXT NOT NULL DEFAULT 'Nosso Manifesto',
  manifesto_content TEXT NOT NULL DEFAULT 'Tecnologia a serviço das pessoas, sempre.',
  history_title TEXT NOT NULL DEFAULT 'Nossa História',
  history_content TEXT NOT NULL DEFAULT 'Fundada com o propósito de transformar negócios através da tecnologia.',
  dna_title TEXT NOT NULL DEFAULT 'Nosso DNA',
  dna_content TEXT NOT NULL DEFAULT 'Inovação, excelência e impacto real.',
  principles JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  expertise JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job positions table
CREATE TABLE public.job_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  differentials JSONB DEFAULT '[]'::jsonb,
  modality TEXT DEFAULT 'hybrid',
  location TEXT DEFAULT 'São Paulo, SP',
  salary_range TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company culture table
CREATE TABLE public.company_culture (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  benefits JSONB DEFAULT '[]'::jsonb,
  culture_description TEXT,
  selection_process JSONB DEFAULT '[]'::jsonb,
  application_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_manifesto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_culture ENABLE ROW LEVEL SECURITY;

-- Create policies for company_manifesto
CREATE POLICY "Manifesto is publicly readable" 
ON public.company_manifesto 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage manifesto" 
ON public.company_manifesto 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for team_members
CREATE POLICY "Active team members are publicly readable" 
ON public.team_members 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage team members" 
ON public.team_members 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for job_positions
CREATE POLICY "Open job positions are publicly readable" 
ON public.job_positions 
FOR SELECT 
USING (status = 'open');

CREATE POLICY "Only authenticated users can manage job positions" 
ON public.job_positions 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for company_culture
CREATE POLICY "Company culture is publicly readable" 
ON public.company_culture 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage company culture" 
ON public.company_culture 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_company_manifesto_updated_at
BEFORE UPDATE ON public.company_manifesto
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_positions_updated_at
BEFORE UPDATE ON public.job_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_culture_updated_at
BEFORE UPDATE ON public.company_culture
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.company_manifesto (
  manifesto_content,
  history_content,
  dna_content,
  principles
) VALUES (
  'Na Guilds, acreditamos que a tecnologia deve servir às pessoas, não o contrário. Desenvolvemos soluções sob medida que respeitam a essência humana de cada negócio, sempre priorizando ética, transparência e impacto real.',
  'Fundada em 2020 por profissionais apaixonados por tecnologia e inovação, a Guilds nasceu da necessidade de oferecer soluções digitais verdadeiramente personalizadas. Nossa jornada começou com projetos de automação e hoje abrange desenvolvimento de software, IA, jogos corporativos e educação tecnológica.',
  'Somos movidos pela curiosidade, guiados pela excelência e comprometidos com resultados que fazem a diferença. Nosso DNA combina expertise técnica sênior com uma abordagem humana e ágil.',
  '[
    {
      "title": "Human-First",
      "description": "Tecnologia a serviço das pessoas, sempre priorizando experiência e usabilidade",
      "icon": "Users"
    },
    {
      "title": "Ética & Transparência",
      "description": "Relações baseadas em confiança, clareza e responsabilidade",
      "icon": "Shield"
    },
    {
      "title": "Impacto Real",
      "description": "Soluções que geram resultados mensuráveis e transformam negócios",
      "icon": "Target"
    },
    {
      "title": "Excelência Técnica",
      "description": "Qualidade sem compromissos, usando as melhores práticas do mercado",
      "icon": "Award"
    }
  ]'::jsonb
);

INSERT INTO public.team_members (
  name, position, bio, expertise, social_links, display_order
) VALUES
(
  'João Silva',
  'CEO & Founder',
  'Empreendedor serial com mais de 10 anos criando soluções digitais. Especialista em estratégia de produto e transformação digital.',
  '["Estratégia Digital", "Liderança", "Product Management", "Empreendedorismo"]'::jsonb,
  '{"linkedin": "https://linkedin.com/in/joaosilva", "twitter": "https://twitter.com/joaosilva"}'::jsonb,
  1
),
(
  'Maria Santos',
  'CTO',
  'Desenvolvedora full-stack sênior com expertise em arquiteturas escaláveis e IA. Lidera nosso time técnico com foco em inovação.',
  '["JavaScript", "Python", "AI/ML", "Cloud Architecture", "Team Leadership"]'::jsonb,
  '{"linkedin": "https://linkedin.com/in/mariasantos", "github": "https://github.com/mariasantos"}'::jsonb,
  2
),
(
  'Pedro Costa',
  'Lead Developer',
  'Especialista em React, Node.js e DevOps. Apaixonado por código limpo e arquiteturas modernas.',
  '["React", "Node.js", "TypeScript", "DevOps", "Clean Code"]'::jsonb,
  '{"linkedin": "https://linkedin.com/in/pedrocosta", "github": "https://github.com/pedrocosta"}'::jsonb,
  3
),
(
  'Ana Lima',
  'UX/UI Designer',
  'Designer focada em experiências digitais centradas no usuário. Especialista em design systems e prototipação.',
  '["UI/UX Design", "Design Systems", "Figma", "User Research", "Prototyping"]'::jsonb,
  '{"linkedin": "https://linkedin.com/in/analima", "behance": "https://behance.net/analima"}'::jsonb,
  4
);

INSERT INTO public.company_culture (
  benefits,
  culture_description,
  selection_process,
  application_info
) VALUES (
  '[
    {
      "title": "Trabalho Remoto",
      "description": "Flexibilidade total para trabalhar de onde quiser",
      "icon": "Home"
    },
    {
      "title": "Horário Flexível",
      "description": "Autonomia para organizar seu tempo e produtividade",
      "icon": "Clock"
    },
    {
      "title": "Educação Continuada",
      "description": "Budget anual para cursos, eventos e certificações",
      "icon": "BookOpen"
    },
    {
      "title": "Equipamentos",
      "description": "Setup completo para trabalhar com máxima eficiência",
      "icon": "Laptop"
    },
    {
      "title": "Plano de Saúde",
      "description": "Cobertura médica e odontológica para você e família",
      "icon": "Heart"
    },
    {
      "title": "Vale Refeição",
      "description": "Cartão alimentação para suas necessidades diárias",
      "icon": "Coffee"
    }
  ]'::jsonb,
  'Na Guilds, cultivamos um ambiente de crescimento mútuo, onde cada pessoa é valorizada e tem autonomia para inovar. Acreditamos no equilíbrio entre vida pessoal e profissional, oferecendo flexibilidade e confiança para que você entregue seu melhor trabalho.',
  '[
    {
      "step": 1,
      "title": "Candidatura",
      "description": "Envie seu CV e portfolio através do nosso formulário"
    },
    {
      "step": 2,
      "title": "Triagem",
      "description": "Análise do perfil e primeira conversa com RH (30min)"
    },
    {
      "step": 3,
      "title": "Desafio Técnico",
      "description": "Teste prático relacionado à vaga (take-home)"
    },
    {
      "step": 4,
      "title": "Entrevista Técnica",
      "description": "Papo com o time técnico sobre o desafio (1h)"
    },
    {
      "step": 5,
      "title": "Cultural Fit",
      "description": "Conversa final sobre valores e expectativas (45min)"
    },
    {
      "step": 6,
      "title": "Proposta",
      "description": "Feedback e apresentação da oferta"
    }
  ]'::jsonb,
  'Interessado em fazer parte do nosso time? Envie seu currículo e portfolio para carreiras@guilds.com.br ou utilize nosso formulário de candidatura. Vamos adorar conhecer você!'
);