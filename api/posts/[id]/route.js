import { NextResponse } from "next/server";
import { posts } from "../route";

export async function GET(req, { params }) {
    const post = posts.find((p) => p.id.toString() === params.id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
}
