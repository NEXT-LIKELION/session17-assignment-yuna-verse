"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">글 목록</h1>
                <Link href="/write">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        글 작성하기
                    </button>
                </Link>
            </div>
            {posts.length === 0 ? (
                <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li key={post.id} className="border-b pb-4">
                            <Link
                                href={`/post/${post.id}`}
                                className="block hover:bg-gray-50 p-2 rounded"
                            >
                                <h2 className="text-xl font-semibold mb-2">
                                    {post.title}
                                </h2>
                                <div className="text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {post.author}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(
                                                post.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {post.location && (
                                        <div className="text-sm">
                                            📍 {post.location.address}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
