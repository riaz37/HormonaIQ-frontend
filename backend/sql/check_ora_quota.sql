-- Deploy this function to Supabase via the SQL editor
-- Called by FastAPI to atomically check+enforce Ora quota

CREATE OR REPLACE FUNCTION check_ora_quota(
  p_user_id UUID,
  p_feature TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Advisory lock prevents concurrent requests for the same user
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));

  SELECT COUNT(*) INTO v_count
  FROM ora_usage
  WHERE user_id = p_user_id
    AND feature = p_feature
    AND called_at >= date_trunc('month', now());

  RETURN v_count < p_limit;
END;
$$;
