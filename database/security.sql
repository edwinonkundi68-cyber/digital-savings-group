update public.profiles
set role = 'treasurer'
where id = (
  select id from auth.users where email = 'edwinonkundi68@gmail.com'
);