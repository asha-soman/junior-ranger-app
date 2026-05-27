CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CHARACTER VARYING UNIQUE NOT NULL,
    name CHARACTER VARYING,
    role CHARACTER VARYING NOT NULL,
    avatar_url TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    password_hash TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status CHARACTER VARYING NOT NULL DEFAULT 'approved'
);

CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name CHARACTER VARYING NOT NULL,
    description TEXT,
    location TEXT,
    assigned_ranger_id UUID REFERENCES users(id),
    created_by_ranger_id UUID REFERENCES users(id),
    image_url TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invite_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID NOT NULL REFERENCES cohorts(id),
    code TEXT UNIQUE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_usage INTEGER NOT NULL DEFAULT 10,
    used_count INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE cohort_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    cohort_id UUID NOT NULL REFERENCES cohorts(id),
    role CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, cohort_id)
);

