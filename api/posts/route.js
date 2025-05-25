import { NextResponse } from "next/server";

export let posts = [];

export async function GET() {
    return NextResponse.json(posts);
}
