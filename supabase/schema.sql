-- Replace every occurrence of REPLACE_WITH_YOUR_ADMIN_EMAIL before running this file.
-- Run in Supabase Dashboard -> SQL Editor.

create table if not exists public.projects (
  id uuid primary key,
  title text not null,
  subtitle text,
  summary text not null,
  tags text[] not null default '{}',
  category text not null check (category in ('mobile', 'web', 'other')),
  cover_url text not null,
  cover_path text not null,
  image_urls text[] not null default '{}',
  image_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Public can read portfolio projects" on public.projects;
create policy "Public can read portfolio projects"
  on public.projects for select
  using (true);

drop policy if exists "Admin can create portfolio projects" on public.projects;
create policy "Admin can create portfolio projects"
  on public.projects for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'REPLACE_WITH_YOUR_ADMIN_EMAIL');

drop policy if exists "Admin can update portfolio projects" on public.projects;
create policy "Admin can update portfolio projects"
  on public.projects for update to authenticated
  using ((auth.jwt() ->> 'email') = 'REPLACE_WITH_YOUR_ADMIN_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'REPLACE_WITH_YOUR_ADMIN_EMAIL');

drop policy if exists "Admin can delete portfolio projects" on public.projects;
create policy "Admin can delete portfolio projects"
  on public.projects for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'REPLACE_WITH_YOUR_ADMIN_EMAIL');

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects for select
  using (bucket_id = 'project-assets');

drop policy if exists "Admin can upload project images" on storage.objects;
create policy "Admin can upload project images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-assets'
    and (auth.jwt() ->> 'email') = 'REPLACE_WITH_YOUR_ADMIN_EMAIL'
  );

drop policy if exists "Admin can delete project images" on storage.objects;
create policy "Admin can delete project images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-assets'
    and (auth.jwt() ->> 'email') = 'REPLACE_WITH_YOUR_ADMIN_EMAIL'
  );
