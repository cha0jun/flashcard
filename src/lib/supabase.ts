import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseBrowserClient() {
	return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

export function createSupabaseServerClient(cookies: {
	getAll: () => { name: string; value: string }[];
	setAll: (
		cookies: { name: string; value: string; options: Record<string, unknown> }[]
	) => void;
}) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) =>
				cookies.setAll(cookiesToSet)
		}
	});
}
