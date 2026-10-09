-- ==========================================================================
-- CYPHER 4.0 — BACKEND DATABASE SCHEMA & MIGRATIONS
-- Competition Types, Dynamic Problem Statements, Submissions, RLS, Audit Logs
-- ==========================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Roles & Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'participant' CHECK (role IN ('admin', 'judge', 'participant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Competition Types Table
CREATE TABLE IF NOT EXISTS public.competition_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'HACKATHON', 'IDEATHON'
    name VARCHAR(100) NOT NULL,       -- e.g. 'Hackathon', 'Ideathon'
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Problem Statements Table
CREATE TABLE IF NOT EXISTS public.problem_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_type_id UUID NOT NULL REFERENCES public.competition_types(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,        -- e.g. 'HACK-01', 'IDEA-01'
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    description TEXT NOT NULL,
    organization VARCHAR(150),
    category VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_competition_ps_code UNIQUE (competition_type_id, code)
);

-- 5. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'CYP-1047'
    competition_type_id UUID NOT NULL REFERENCES public.competition_types(id) ON DELETE RESTRICT,
    problem_statement_id UUID NOT NULL REFERENCES public.problem_statements(id) ON DELETE RESTRICT,
    team_name VARCHAR(150) NOT NULL,
    team_lead_name VARCHAR(150) NOT NULL,
    team_lead_email VARCHAR(255) NOT NULL,
    members_count INT NOT NULL DEFAULT 1 CHECK (members_count BETWEEN 1 AND 4),
    project_title VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    github_url TEXT NOT NULL,
    deploy_url TEXT NOT NULL,
    demo_video_url TEXT,
    file_name TEXT,
    file_size TEXT,
    score NUMERIC(5,2) DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'EVALUATED', 'SELECTED', 'ELIMINATED', 'PENDING')),
    ai_summary JSONB DEFAULT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'PROBLEM_STATEMENT_CREATED', etc.
    entity_type VARCHAR(100) NOT NULL, -- 'competition_type', 'problem_statement', etc.
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================================
-- TRIGGERS & VALIDATION CONSTRAINTS
-- ==========================================================================

-- Trigger Function: Auto update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_competition_types_updated_at
    BEFORE UPDATE ON public.competition_types
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_problem_statements_updated_at
    BEFORE UPDATE ON public.problem_statements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger Function: Validate Submission Competition Type matches Problem Statement Competition Type and active status
CREATE OR REPLACE FUNCTION public.validate_submission_integrity()
RETURNS TRIGGER AS $$
DECLARE
    v_ps_comp_id UUID;
    v_ps_active BOOLEAN;
    v_comp_active BOOLEAN;
BEGIN
    -- Check competition type active
    SELECT is_active INTO v_comp_active FROM public.competition_types WHERE id = NEW.competition_type_id;
    IF v_comp_active IS NULL OR v_comp_active = false THEN
        RAISE EXCEPTION 'Cannot submit to an inactive or non-existent competition type (id: %)', NEW.competition_type_id;
    END IF;

    -- Check problem statement belongs to this competition type & is active
    SELECT competition_type_id, is_active INTO v_ps_comp_id, v_ps_active 
    FROM public.problem_statements 
    WHERE id = NEW.problem_statement_id;

    IF v_ps_comp_id IS NULL THEN
        RAISE EXCEPTION 'Problem statement not found (id: %)', NEW.problem_statement_id;
    END IF;

    IF v_ps_comp_id <> NEW.competition_type_id THEN
        RAISE EXCEPTION 'Problem statement (id: %) does not belong to the selected competition type (id: %)', 
            NEW.problem_statement_id, NEW.competition_type_id;
    END IF;

    IF TG_OP = 'INSERT' AND (v_ps_active IS NULL OR v_ps_active = false) THEN
        RAISE EXCEPTION 'Cannot submit to an inactive problem statement (id: %)', NEW.problem_statement_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_validate_submission
    BEFORE INSERT OR UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.validate_submission_integrity();

-- Trigger Function: Protect Problem Statements with existing submissions from physical deletion
CREATE OR REPLACE FUNCTION public.prevent_ps_delete_with_submissions()
RETURNS TRIGGER AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.submissions WHERE problem_statement_id = OLD.id;
    IF v_count > 0 THEN
        RAISE EXCEPTION 'Cannot physically delete problem statement % (%) because it has % associated submission(s). Soft-delete by setting is_active = false instead.', 
            OLD.code, OLD.id, v_count;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_prevent_ps_delete
    BEFORE DELETE ON public.problem_statements
    FOR EACH ROW EXECUTE FUNCTION public.prevent_ps_delete_with_submissions();

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================

ALTER TABLE public.competition_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Competition Types Policies
CREATE POLICY "Public users can view active competition types"
    ON public.competition_types FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full access to competition types"
    ON public.competition_types FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 2. Problem Statements Policies
CREATE POLICY "Public and participants can view active problem statements"
    ON public.problem_statements FOR SELECT
    USING (
        (is_active = true AND EXISTS (SELECT 1 FROM public.competition_types ct WHERE ct.id = competition_type_id AND ct.is_active = true))
        OR public.is_admin()
    );

CREATE POLICY "Admins have full access to problem statements"
    ON public.problem_statements FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. Submissions Policies
CREATE POLICY "Participants can view their own submissions"
    ON public.submissions FOR SELECT
    USING (
        team_lead_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "Participants can insert submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins have full access to submissions"
    ON public.submissions FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Audit Logs Policies
CREATE POLICY "Admins can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Authenticated system can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- ==========================================================================
-- SEED INITIAL DATA (HACKATHON & IDEATHON COMPETITION TYPES)
-- ==========================================================================

INSERT INTO public.competition_types (id, code, name, description, is_active, display_order)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'HACKATHON', 'Hackathon Track', '48-Hour Technical Prototype & Code Implementation Track', true, 1),
    ('00000000-0000-0000-0000-000000000002', 'IDEATHON', 'Ideathon Track', 'Innovation, Product Architecture & Problem Solving Design Track', true, 2)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;
