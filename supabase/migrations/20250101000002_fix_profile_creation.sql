-- Function to safely create a profile (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_profile_if_not_exists(
  user_id UUID,
  user_email TEXT,
  user_display_name TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
    -- Insert new profile
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (user_id, user_email, user_display_name);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_profile_if_not_exists(UUID, TEXT, TEXT) TO authenticated;
