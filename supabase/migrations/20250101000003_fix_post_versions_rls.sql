-- Function to safely create a post version (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_post_version(
  p_post_id UUID,
  p_title TEXT,
  p_content TEXT,
  p_version_number INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.post_versions (post_id, title, content, version_number)
  VALUES (p_post_id, p_title, p_content, p_version_number);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_post_version(UUID, TEXT, TEXT, INTEGER) TO authenticated;
