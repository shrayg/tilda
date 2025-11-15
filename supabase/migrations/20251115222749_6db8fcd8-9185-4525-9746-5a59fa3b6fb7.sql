-- Enable RLS on official_events table (public read access for demo)
ALTER TABLE public.official_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to official events"
ON public.official_events
FOR SELECT
USING (true);

-- Enable RLS on pins table (public access for demo)
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to pins"
ON public.pins
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to pins"
ON public.pins
FOR INSERT
WITH CHECK (true);