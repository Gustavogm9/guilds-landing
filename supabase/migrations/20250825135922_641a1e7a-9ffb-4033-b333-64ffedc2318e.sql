-- Enable realtime for the logos table
ALTER TABLE public.logos REPLICA IDENTITY FULL;

-- Add logos table to the realtime publication
ALTER publication supabase_realtime ADD TABLE public.logos;