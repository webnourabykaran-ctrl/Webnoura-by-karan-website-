CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  business_name text NOT NULL CHECK (char_length(business_name) BETWEEN 1 AND 150),
  website_type text NOT NULL CHECK (website_type IN ('Business website','Restaurant website','Gym website','Portfolio website','Landing page','E-commerce website','Other')),
  pages text CHECK (pages IS NULL OR char_length(pages) <= 50),
  budget text CHECK (budget IS NULL OR char_length(budget) <= 50),
  details text NOT NULL CHECK (char_length(details) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);