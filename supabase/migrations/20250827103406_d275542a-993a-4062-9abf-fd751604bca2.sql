-- Create workshop categories table
CREATE TABLE public.workshop_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  color TEXT DEFAULT 'hsl(var(--primary))',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create instructors table
CREATE TABLE public.workshop_instructors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  specialties TEXT[],
  avatar_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  years_experience INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshops table
CREATE TABLE public.workshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  duration_hours INTEGER NOT NULL,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  target_audience TEXT[],
  prerequisites TEXT[],
  learning_objectives TEXT[],
  practical_project TEXT,
  certificate_included BOOLEAN NOT NULL DEFAULT true,
  modalities TEXT[] NOT NULL DEFAULT '{"online","presential","in-company"}',
  category_id UUID REFERENCES public.workshop_categories(id),
  price_type TEXT NOT NULL DEFAULT 'quote',
  price_amount DECIMAL(10,2),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  meta_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshop modules table
CREATE TABLE public.workshop_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_hours DECIMAL(4,2),
  module_order INTEGER NOT NULL,
  topics TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshop instructor assignments
CREATE TABLE public.workshop_instructor_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES public.workshop_instructors(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'instructor',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workshop_id, instructor_id)
);

-- Create workshop enrollments table
CREATE TABLE public.workshop_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  experience_level TEXT,
  expectations TEXT,
  preferred_modality TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workshop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_instructor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public reading, admin-only writing
CREATE POLICY "Categories are publicly readable" ON public.workshop_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only authenticated users can manage categories" ON public.workshop_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Instructors are publicly readable" ON public.workshop_instructors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only authenticated users can manage instructors" ON public.workshop_instructors
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Workshops are publicly readable" ON public.workshops
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only authenticated users can manage workshops" ON public.workshops
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Modules are publicly readable" ON public.workshop_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workshops 
      WHERE workshops.id = workshop_modules.workshop_id 
      AND workshops.is_active = true
    )
  );

CREATE POLICY "Only authenticated users can manage modules" ON public.workshop_modules
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Assignments are publicly readable" ON public.workshop_instructor_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workshops 
      WHERE workshops.id = workshop_instructor_assignments.workshop_id 
      AND workshops.is_active = true
    )
  );

CREATE POLICY "Only authenticated users can manage assignments" ON public.workshop_instructor_assignments
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can enroll in workshops" ON public.workshop_enrollments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read enrollments" ON public.workshop_enrollments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update enrollments" ON public.workshop_enrollments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_workshop_categories_updated_at
  BEFORE UPDATE ON public.workshop_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workshop_instructors_updated_at
  BEFORE UPDATE ON public.workshop_instructors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workshop_enrollments_updated_at
  BEFORE UPDATE ON public.workshop_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.workshop_categories (name, slug, description, icon_name, display_order) VALUES
('Tecnologia Aplicada', 'tecnologia-aplicada', 'React, Node.js, Python e outras tecnologias modernas', 'Code', 1),
('Jogos & Gamificação', 'jogos-gamificacao', 'Unity, Game Design e mecânicas de jogos', 'Gamepad2', 2),
('Aplicativos', 'aplicativos', 'Mobile, Web e UX/UI Design', 'Smartphone', 3),
('Habilidades Essenciais', 'habilidades-essenciais', 'Soft skills, Leadership e gestão', 'Users', 4);

INSERT INTO public.workshop_instructors (name, slug, bio, specialties, years_experience) VALUES
('Ana Silva', 'ana-silva', 'Desenvolvedora Full Stack com mais de 8 anos de experiência em React e Node.js. Especialista em arquitetura de software e metodologias ágeis.', '{"React","Node.js","TypeScript","Arquitetura de Software"}', 8),
('Carlos Montenegro', 'carlos-montenegro', 'Game Designer e desenvolvedor Unity com vasta experiência em jogos corporativos. Criador de mais de 15 jogos para treinamento empresarial.', '{"Unity","Game Design","Gamificação","C#"}', 10),
('Marina Costa', 'marina-costa', 'UX Designer e Product Manager. Especialista em design thinking e experiência do usuário para aplicativos mobile e web.', '{"UX/UI Design","Product Management","Design Thinking","Figma"}', 6),
('Roberto Ferreira', 'roberto-ferreira', 'Coach executivo e consultor em liderança. Especialista em desenvolvimento de soft skills e gestão de equipes de tecnologia.', '{"Leadership","Soft Skills","Coaching","Gestão de Equipes"}', 12);

INSERT INTO public.workshops (title, slug, description, short_description, duration_hours, difficulty_level, target_audience, prerequisites, learning_objectives, practical_project, category_id) VALUES
(
  'React do Zero ao Deploy',
  'react-zero-deploy',
  'Workshop intensivo de React com foco prático. Aprenda a desenvolver aplicações completas do zero até o deploy em produção.',
  'Desenvolva aplicações React completas do zero ao deploy',
  40,
  'beginner',
  '{"Desenvolvedores iniciantes","Profissionais de TI","Estudantes de tecnologia"}',
  '{"Conhecimento básico de HTML/CSS","Lógica de programação","JavaScript básico"}',
  '{"Dominar os fundamentos do React","Construir componentes reutilizáveis","Gerenciar estado com hooks","Fazer deploy de aplicações","Integrar com APIs REST"}',
  'Desenvolvimento de um sistema de e-commerce completo com carrinho de compras, autenticação e integração com API',
  (SELECT id FROM public.workshop_categories WHERE slug = 'tecnologia-aplicada')
),
(
  'Game Design para Negócios',
  'game-design-negocios',
  'Aprenda a criar jogos corporativos eficazes para treinamento, engajamento e desenvolvimento de equipes.',
  'Crie jogos corporativos para treinamento e engajamento',
  24,
  'intermediate',
  '{"RH e Treinamento","Gestores","Consultores","Game Designers"}',
  '{"Experiência com gestão de pessoas","Conhecimento básico de gamificação"}',
  '{"Projetar mecânicas de jogo eficazes","Aplicar gamificação em contextos corporativos","Criar narrativas envolventes","Medir engajamento e resultados"}',
  'Desenvolvimento de um jogo de treinamento corporativo completo com narrativa, desafios e sistema de progressão',
  (SELECT id FROM public.workshop_categories WHERE slug = 'jogos-gamificacao')
),
(
  'Automação com IA para PMEs',
  'automacao-ia-pmes',
  'Workshop prático sobre implementação de automação e IA em pequenas e médias empresas.',
  'Implemente automação e IA para otimizar processos',
  16,
  'beginner',
  '{"Empreendedores","Gestores de PMEs","Analistas de processos"}',
  '{"Conhecimento básico de processos empresariais","Interesse em tecnologia"}',
  '{"Identificar oportunidades de automação","Implementar chatbots inteligentes","Automatizar workflows","Medir ROI de automação"}',
  'Criação de um sistema de automação completo para um processo empresarial real',
  (SELECT id FROM public.workshop_categories WHERE slug = 'tecnologia-aplicada')
),
(
  'UX/UI Design Thinking',
  'ux-ui-design-thinking',
  'Metodologia completa de Design Thinking aplicada ao desenvolvimento de interfaces e experiências digitais.',
  'Domine Design Thinking para criar experiências digitais',
  32,
  'intermediate',
  '{"Designers","Desenvolvedores Front-end","Product Managers","Profissionais de UX"}',
  '{"Conhecimento básico de design","Experiência com ferramentas de prototipação"}',
  '{"Aplicar metodologia Design Thinking","Criar protótipos funcionais","Realizar testes de usabilidade","Desenvolver sistemas de design","Validar soluções com usuários"}',
  'Desenvolvimento de um aplicativo mobile completo seguindo toda metodologia de Design Thinking',
  (SELECT id FROM public.workshop_categories WHERE slug = 'aplicativos')
);

-- Insert workshop modules
INSERT INTO public.workshop_modules (workshop_id, title, description, duration_hours, module_order, topics) VALUES
-- React Workshop Modules
((SELECT id FROM public.workshops WHERE slug = 'react-zero-deploy'), 'Fundamentos do React', 'Introdução ao React, JSX e componentes básicos', 8, 1, '{"Introdução ao React","JSX e elementos","Componentes funcionais","Props e children"}'),
((SELECT id FROM public.workshops WHERE slug = 'react-zero-deploy'), 'Hooks e Estado', 'useState, useEffect e gerenciamento de estado', 8, 2, '{"useState","useEffect","useContext","Custom hooks"}'),
((SELECT id FROM public.workshops WHERE slug = 'react-zero-deploy'), 'Integração com APIs', 'Fetch, axios e gerenciamento de dados externos', 8, 3, '{"Fetch API","Axios","Async/await","Error handling"}'),
((SELECT id FROM public.workshops WHERE slug = 'react-zero-deploy'), 'Roteamento e Navegação', 'React Router e navegação entre páginas', 8, 4, '{"React Router","Rotas dinâmicas","Navegação programática","Guards de rota"}'),
((SELECT id FROM public.workshops WHERE slug = 'react-zero-deploy'), 'Deploy e Produção', 'Build, otimização e deploy em produção', 8, 5, '{"Build de produção","Otimização","Deploy no Vercel","CI/CD"}');

-- Insert instructor assignments
INSERT INTO public.workshop_instructor_assignments (workshop_id, instructor_id, role) VALUES
((SELECT id FROM public.workshops WHERE slug = 'react-zero-deploy'), (SELECT id FROM public.workshop_instructors WHERE slug = 'ana-silva'), 'instructor'),
((SELECT id FROM public.workshops WHERE slug = 'game-design-negocios'), (SELECT id FROM public.workshop_instructors WHERE slug = 'carlos-montenegro'), 'instructor'),
((SELECT id FROM public.workshops WHERE slug = 'automacao-ia-pmes'), (SELECT id FROM public.workshop_instructors WHERE slug = 'ana-silva'), 'instructor'),
((SELECT id FROM public.workshops WHERE slug = 'ux-ui-design-thinking'), (SELECT id FROM public.workshop_instructors WHERE slug = 'marina-costa'), 'instructor');