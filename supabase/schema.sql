-- ==============================================================================
-- Rocky's Ed-Lab: 교육용 웹앱 쇼케이스 & 아카이브 데이터베이스 스키마
-- Supabase SQL Editor에 복사하여 [RUN]을 실행하세요.
-- (여러 번 다시 실행해도 충돌 없이 안전하게 업데이트되도록 구성되어 있습니다)
-- ==============================================================================

-- 1. 교육용 웹앱 테이블 생성
create table if not exists public.educational_apps (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text not null,
  description text default '',
  category text not null check (category in ('math', 'science', 'coding', 'language', 'creative', 'tool')),
  target_grade text default '누구나',
  app_url text not null,
  github_url text default '',
  thumbnail_url text default '',
  tags text[] default '{}',
  is_featured boolean default false,
  order_num integer default 0,
  author_email text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 카테고리 제약조건 유연화 (관리자가 자유롭게 새 카테고리를 추가할 수 있도록)
alter table public.educational_apps drop constraint if exists educational_apps_category_check;

-- 2. 사용자 북마크/즐겨찾기 테이블 생성
create table if not exists public.user_bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  app_id uuid references public.educational_apps(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, app_id)
);

-- 3. 카테고리 관리 테이블 생성
create table if not exists public.app_categories (
  id text primary key,
  label text not null,
  description text default '',
  icon_name text default 'Layers',
  order_num integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Row Level Security (RLS) 활성화
alter table public.educational_apps enable row level security;
alter table public.user_bookmarks enable row level security;
alter table public.app_categories enable row level security;

-- 카테고리 RLS: 누구나 조회 가능, 오직 선생님만 추가/수정/삭제 가능
drop policy if exists "누구나 카테고리를 조회할 수 있습니다." on public.app_categories;
create policy "누구나 카테고리를 조회할 수 있습니다."
  on public.app_categories for select
  using (true);

drop policy if exists "선생님만 카테고리를 관리할 수 있습니다." on public.app_categories;
create policy "선생님만 카테고리를 관리할 수 있습니다."
  on public.app_categories for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'baekyungrock1994@gmail.com')
  with check (auth.jwt() ->> 'email' = 'baekyungrock1994@gmail.com');

-- 4. RLS 정책: 누구나 웹앱 목록을 조회할 수 있음 (Public Read)
drop policy if exists "누구나 교육용 앱을 조회할 수 있습니다." on public.educational_apps;
create policy "누구나 교육용 앱을 조회할 수 있습니다."
  on public.educational_apps for select
  using (true);

-- 5. RLS 정책: 오직 관리자(선생님) 이메일만 앱을 추가, 수정, 삭제 가능
drop policy if exists "인증된 사용자는 앱을 추가할 수 있습니다." on public.educational_apps;
drop policy if exists "선생님만 앱을 추가할 수 있습니다." on public.educational_apps;
create policy "선생님만 앱을 추가할 수 있습니다."
  on public.educational_apps for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'baekyungrock1994@gmail.com');

drop policy if exists "인증된 사용자는 앱을 수정할 수 있습니다." on public.educational_apps;
drop policy if exists "선생님만 앱을 수정할 수 있습니다." on public.educational_apps;
create policy "선생님만 앱을 수정할 수 있습니다."
  on public.educational_apps for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'baekyungrock1994@gmail.com');

drop policy if exists "인증된 사용자는 앱을 삭제할 수 있습니다." on public.educational_apps;
drop policy if exists "선생님만 앱을 삭제할 수 있습니다." on public.educational_apps;
create policy "선생님만 앱을 삭제할 수 있습니다."
  on public.educational_apps for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'baekyungrock1994@gmail.com');

-- 6. RLS 정책: 북마크는 본인 것만 조회/등록/삭제 가능
drop policy if exists "사용자는 자신의 북마크만 조회할 수 있습니다." on public.user_bookmarks;
create policy "사용자는 자신의 북마크만 조회할 수 있습니다."
  on public.user_bookmarks for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "사용자는 자신의 북마크를 추가할 수 있습니다." on public.user_bookmarks;
create policy "사용자는 자신의 북마크를 추가할 수 있습니다."
  on public.user_bookmarks for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "사용자는 자신의 북마크를 취소할 수 있습니다." on public.user_bookmarks;
create policy "사용자는 자신의 북마크를 취소할 수 있습니다."
  on public.user_bookmarks for delete
  to authenticated
  using (auth.uid() = user_id);

-- 7. 초기 샘플 데이터 시드 (중복 실행 방지 처리)
insert into public.educational_apps (title, summary, description, category, target_grade, app_url, github_url, thumbnail_url, tags, is_featured, order_num)
select
  '벡터와 좌표계 인터랙티브 연구실',
  '마우스로 벡터 화살표를 직접 당기고 회전시키며 내적과 외적, 정사영의 개념을 직관적으로 이해합니다.',
  '수학 교과서의 평면적인 수식 대신 2D 공간에서 두 벡터의 크기와 방향을 실시간으로 조작할 수 있는 시뮬레이션입니다.',
  'math',
  '중3 ~ 고등',
  'https://phet.colorado.edu/sims/html/vector-addition/latest/vector-addition_all.html',
  'https://github.com/example/geo-vector-lab',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  array['기하', '벡터', '선형대수', '고등수학'],
  true,
  1
where not exists (select 1 from public.educational_apps where title = '벡터와 좌표계 인터랙티브 연구실');

insert into public.educational_apps (title, summary, description, category, target_grade, app_url, github_url, thumbnail_url, tags, is_featured, order_num)
select
  '알고리즘 정렬 시각화 탐험기',
  '버블, 퀵, 병합, 힙 정렬의 비교 횟수와 교환 과정을 오디오 피치와 막대 그래프로 감상합니다.',
  '컴퓨팅 사고력을 기르는 대표적인 정렬 알고리즘 6종의 작동 방식을 단계별로 제어하며 관찰합니다.',
  'coding',
  '중등 ~ 성인 입문',
  'https://visualgo.net/en/sorting',
  'https://github.com/example/sorting-visualizer',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  array['알고리즘', '정렬', '자료구조', '정보교육'],
  true,
  2
where not exists (select 1 from public.educational_apps where title = '알고리즘 정렬 시각화 탐험기');

insert into public.educational_apps (title, summary, description, category, target_grade, app_url, github_url, thumbnail_url, tags, is_featured, order_num)
select
  '진자와 파동 역학 시뮬레이터',
  '단진자의 주기와 중력가속도, 공기 저항 계수를 바꿔가며 에너지 보존 법칙을 직접 검증합니다.',
  '물리학 교실에서 직접 실험하기 까다로운 다중 진자 및 파동의 간섭 현상을 웹 브라우저에서 정밀 시뮬레이션합니다.',
  'science',
  '중등 ~ 고등',
  'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
  'https://github.com/example/pendulum-wave-physics',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  array['물리', '역학', '파동', '시뮬레이션'],
  true,
  3
where not exists (select 1 from public.educational_apps where title = '진자와 파동 역학 시뮬레이터');
