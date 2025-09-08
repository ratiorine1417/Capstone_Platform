-- ========== STEP 2 멱등 시드 데이터 ==========
-- 기존 행 삭제 후 새로 추가

-- Delete existing users first
DELETE FROM users WHERE email IN ('admin@taskloom.com', 'teamlead@taskloom.com');

-- users (admin, teamlead)
INSERT INTO users (email, display_name, password, role, created_at, updated_at)
VALUES ('admin@taskloom.com', '시스템 관리자',
        -- bcrypt("password") - 정확한 해시 사용
        '$2a$10$LBWSlYBYknCU4ADirn026ORIRnsWEGtSdZ4d1EC8agr.dkn10XcDe',
        'ADMIN', NOW(), NOW());

INSERT INTO users (email, display_name, password, role, created_at, updated_at)
VALUES ('teamlead@taskloom.com', '팀 리더',
        -- bcrypt("password") - 정확한 해시 사용
        '$2a$10$LBWSlYBYknCU4ADirn026ORIRnsWEGtSdZ4d1EC8agr.dkn10XcDe',
        'TEAM_LEAD', NOW(), NOW());

