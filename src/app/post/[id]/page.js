"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostPage({ params }) {
    const [post, setPost] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch("/api/posts");
                const posts = await res.json();
                const post = posts.find((p) => p.id === params.id);
                if (post) {
                    setPost(post);
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                router.push("/");
            }
        }
        fetchPost();
    }, [params.id, router]);

    if (!post) {
        return <div className="p-4">로딩 중...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-600 mb-4">
                <div>작성자: {post.author}</div>
                <div>
                    작성일: {new Date(post.createdAt).toLocaleDateString()}
                </div>
                {post.location && <div>작성 위치: {post.location.address}</div>}
            </div>
            <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
    );
}
