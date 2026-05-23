import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role ?? "USER",
  });
}
