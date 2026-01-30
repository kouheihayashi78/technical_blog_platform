-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own posts" ON posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- Create new policies that work with server-side rendering
-- Using a simpler approach that checks user_id directly
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (
    auth.uid() = user_id AND deleted_at IS NULL
  );

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (
    auth.uid() = user_id AND deleted_at IS NULL
  );

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (
    auth.uid() = user_id
  );
