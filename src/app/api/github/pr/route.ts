import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "GitHub URL is required" }, { status: 400 });
    }

    // Match GitHub PR or Issue URL: https://github.com/owner/repo/pull/42
    const prMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/(pull|issues)\/(\d+)/i);

    if (!prMatch) {
      return NextResponse.json(
        { error: "Invalid GitHub Pull Request or Issue URL format" },
        { status: 400 }
      );
    }

    const [, owner, repo, type, number] = prMatch;
    const endpoint =
      type === "pull"
        ? `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`
        : `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;

    const ghRes = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ClubConnect-App",
      },
    });

    if (!ghRes.ok) {
      return NextResponse.json(
        { error: "Could not fetch GitHub metadata from public API" },
        { status: 404 }
      );
    }

    const data = await ghRes.json();

    return NextResponse.json({
      success: true,
      metadata: {
        title: data.title || "",
        description: data.body ? data.body.slice(0, 300) : "",
        projectEventName: `${owner}/${repo}`,
        author: data.user?.login || "",
        state: data.state || "open",
        isMerged: data.merged || false,
        additions: data.additions || 0,
        deletions: data.deletions || 0,
        commits: data.commits || 1,
      },
    });
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub PR data" }, { status: 500 });
  }
}
