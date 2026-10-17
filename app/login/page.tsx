import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="font-serif text-2xl font-semibold mb-1">
          Mends Family
        </div>
        <p className="text-muted text-sm mb-8">
          Sign in to see the family archive.
        </p>

        {params.error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-[3px] px-4 py-3 mb-6">
            {params.error}
          </div>
        )}

        <form action={signIn} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm text-muted block mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-line rounded-[3px] px-3.5 py-2.5 text-sm bg-white outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-muted block mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-line rounded-[3px] px-3.5 py-2.5 text-sm bg-white outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="bg-ink text-bg text-sm py-3 rounded-[3px] mt-2"
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-muted mt-6">
          Don&apos;t have an account? Ask whoever set up the site to add you.
        </p>
      </div>
    </div>
  );
}
