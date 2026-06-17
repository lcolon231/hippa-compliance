-- Enable Row Level Security on all public tables.
--
-- This application accesses these tables exclusively through Prisma over a
-- direct Postgres connection (the table-owner role, which bypasses RLS), and
-- never through Supabase's anon/authenticated PostgREST data API. The Supabase
-- JS client is used only for Auth and Storage.
--
-- Enabling RLS with no policies therefore closes the publicly-exposed REST
-- endpoints (reachable with the public anon key) for these tables without
-- affecting the application. If a table ever needs to be served via the data
-- API, add explicit policies at that time.

ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Framework" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrgFramework" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ComplianceTask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Evidence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;

-- Prisma's own migrations bookkeeping table is also exposed; lock it down too.
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
