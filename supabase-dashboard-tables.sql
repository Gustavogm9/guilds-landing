-- Create diagnostic_scores table
CREATE TABLE IF NOT EXISTS public.diagnostic_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE CASCADE,
    overall_score NUMERIC(3,1) NOT NULL,
    processos_score NUMERIC(3,1) NOT NULL,
    sistemas_score NUMERIC(3,1) NOT NULL,
    dados_score NUMERIC(3,1) NOT NULL,
    pessoas_score NUMERIC(3,1) NOT NULL,
    fit_score INTEGER NOT NULL,
    annual_loss_estimate NUMERIC(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(diagnostic_id)
);

-- Create diagnostic_narratives table
CREATE TABLE IF NOT EXISTS public.diagnostic_narratives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE CASCADE,
    section_id VARCHAR(50) NOT NULL, -- e.g., 'maturidade', 'mercado', 'comunicacao', 'empresa', 'plano'
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(diagnostic_id, section_id)
);

-- RLS Policies
ALTER TABLE public.diagnostic_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_narratives ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own scores
CREATE POLICY "Users can view their own diagnostic scores"
    ON public.diagnostic_scores
    FOR SELECT
    USING (
        diagnostic_id IN (
            SELECT id FROM public.diagnostics WHERE user_id = auth.uid()
        )
    );

-- Allow users to view their own narratives
CREATE POLICY "Users can view their own diagnostic narratives"
    ON public.diagnostic_narratives
    FOR SELECT
    USING (
        diagnostic_id IN (
            SELECT id FROM public.diagnostics WHERE user_id = auth.uid()
        )
    );

-- Add Edge Function invoke trigger or just allow service role to insert (default)
