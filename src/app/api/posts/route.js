import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

// 데이터 디렉토리와 파일이 없으면 생성
function ensureDataFile() {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
}

// 글 목록 읽기
function readPosts() {
    ensureDataFile();
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
}

// 글 목록 저장
function writePosts(posts) {
    ensureDataFile();
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

export async function POST(request) {
    try {
        const body = await request.json();
        const posts = readPosts();

        const post = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
        };

        posts.push(post);
        writePosts(posts);

        return NextResponse.json(post);
    } catch (error) {
        console.error("글 저장 중 오류:", error);
        return NextResponse.json(
            { error: "글 저장에 실패했습니다." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const posts = readPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error("글 목록 조회 중 오류:", error);
        return NextResponse.json(
            { error: "글 목록을 불러올 수 없습니다." },
            { status: 500 }
        );
    }
}
