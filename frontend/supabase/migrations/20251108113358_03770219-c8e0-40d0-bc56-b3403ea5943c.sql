-- Create table for storing user alert settings
CREATE TABLE IF NOT EXISTS public.alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  high_heart_rate BOOLEAN DEFAULT true,
  abnormal_bp BOOLEAN DEFAULT true,
  missed_medication BOOLEAN DEFAULT false,
  daily_reminder BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for alert_settings
CREATE POLICY "Users can view their own alert settings"
  ON public.alert_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alert settings"
  ON public.alert_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert settings"
  ON public.alert_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create table for storing Google Fit data
CREATE TABLE IF NOT EXISTS public.google_fit_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  height NUMERIC,
  weight NUMERIC,
  steps INTEGER,
  calories INTEGER,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.google_fit_data ENABLE ROW LEVEL SECURITY;

-- Create policies for google_fit_data
CREATE POLICY "Users can view their own Google Fit data"
  ON public.google_fit_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Google Fit data"
  ON public.google_fit_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Google Fit data"
  ON public.google_fit_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at on alert_settings
CREATE TRIGGER update_alert_settings_updated_at
  BEFORE UPDATE ON public.alert_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on google_fit_data
CREATE TRIGGER update_google_fit_data_updated_at
  BEFORE UPDATE ON public.google_fit_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
