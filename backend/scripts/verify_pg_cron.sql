-- Run in Supabase SQL editor to verify pg_cron jobs are active.
-- Expected: two rows — 'purge-crisis-events' and 'send-daily-reminders'
SELECT
    jobname,
    schedule,
    command,
    active
FROM cron.job
WHERE jobname IN ('purge-crisis-events', 'send-daily-reminders')
ORDER BY jobname;

-- Expected output:
-- jobname                  | schedule      | active
-- purge-crisis-events      | 0 */6 * * *   | true
-- send-daily-reminders     | * * * * *     | true
