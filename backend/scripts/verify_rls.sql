-- Verify RLS is enabled on all HormonaIQ tables.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users','symptom_logs','drsp_charts','pcos_lab_values',
    'peri_hot_flashes','peri_gcs_assessments','safety_plans',
    'crisis_events','ora_usage','notification_log',
    'sync_watermarks','audit_log'
  )
ORDER BY tablename;
-- All rows should show rowsecurity = true
