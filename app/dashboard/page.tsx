import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const role = session.user.role ?? "USER";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Protected page (App Router)</p>

        <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-medium text-zinc-500">Name</dt>
          <dd>{session.user.name ?? "—"}</dd>
          <dt className="font-medium text-zinc-500">Email</dt>
          <dd>{session.user.email ?? "—"}</dd>
          <dt className="font-medium text-zinc-500">Role</dt>
          <dd>
            <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs dark:bg-zinc-800">
              {role}
            </span>
          </dd>
        </dl>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/api/profile"
            className="text-sm font-medium underline underline-offset-4"
          >
            View /api/profile
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="ml-auto"
          >
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
