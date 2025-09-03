-- Update history_content to change 2020 to 2022
UPDATE public.company_manifesto 
SET history_content = 'Fundada em 2022 por profissionais apaixonados por tecnologia e inovação, a Guilds nasceu da necessidade de oferecer soluções digitais verdadeiramente personalizadas. Nossa jornada começou com projetos de automação e hoje abrange desenvolvimento de software, IA, jogos corporativos e educação tecnológica.'
WHERE history_content LIKE '%Fundada em 2020%';