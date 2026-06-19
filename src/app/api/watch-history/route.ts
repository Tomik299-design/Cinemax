import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, progress } = await req.json();
  const history = await prisma.watchHistory.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    create: { userId: session.user.id, movieId, progress },
    update: { progress, updatedAt: new Date() },
  });
  return NextResponse.json(history);
}
