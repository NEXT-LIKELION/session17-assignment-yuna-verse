"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [location, setLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Kakao Maps SDK 동적 로드
        const loadKakaoMaps = () => {
            return new Promise((resolve, reject) => {
                // 이미 로드되어 있는지 확인
                if (
                    window.kakao &&
                    window.kakao.maps &&
                    window.kakao.maps.services
                ) {
                    resolve();
                    return;
                }

                // 스크립트 태그 생성
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`;

                script.onload = () => {
                    // autoload=false이므로 수동으로 로드
                    window.kakao.maps.load(() => {
                        resolve();
                    });
                };

                script.onerror = (error) => {
                    reject(error);
                };

                document.head.appendChild(script);
            });
        };

        loadKakaoMaps()
            .then(() => {
                setIsKakaoLoaded(true);
            })
            .catch((error) => {
                console.error("Kakao SDK 로드 실패:", error);
                setIsLoadingLocation(false);
            });
    }, []);

    useEffect(() => {
        if (!isKakaoLoaded) return;

        // 위치 정보 가져오기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        if (
                            !window.kakao ||
                            !window.kakao.maps ||
                            !window.kakao.maps.services
                        ) {
                            setIsLoadingLocation(false);
                            return;
                        }

                        // 카카오 Geocoder를 사용하여 주소 변환
                        const geocoder =
                            new window.kakao.maps.services.Geocoder();

                        geocoder.coord2Address(
                            longitude,
                            latitude,
                            (result, status) => {
                                if (
                                    status ===
                                    window.kakao.maps.services.Status.OK
                                ) {
                                    const address =
                                        result[0].address.address_name;
                                    setLocation({
                                        address,
                                        coordinates: {
                                            lat: latitude,
                                            lng: longitude,
                                        },
                                    });
                                }
                                setIsLoadingLocation(false);
                            }
                        );
                    } catch (error) {
                        console.error("위치 정보 처리 중 오류:", error);
                        setIsLoadingLocation(false);
                    }
                },
                (error) => {
                    console.error("위치 정보를 가져올 수 없습니다:", error);
                    setIsLoadingLocation(false);
                }
            );
        } else {
            setIsLoadingLocation(false);
        }
    }, [isKakaoLoaded]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    author,
                    location,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create post");
            }

            const data = await res.json();

            // 메인 페이지로 리다이렉트
            router.push("/");
            // 페이지 새로고침으로 데이터 갱신
            window.location.href = "/";
        } catch (error) {
            console.error("Error creating post:", error);
            alert("글 작성에 실패했습니다.");
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">글 작성</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="작성자"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용"
                        className="w-full p-2 border rounded h-40"
                        required
                    />
                </div>
                <div className="text-sm text-gray-600">
                    {isLoadingLocation ? (
                        <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>위치 정보를 가져오는 중...</span>
                        </div>
                    ) : location ? (
                        <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{location.address}</span>
                        </div>
                    ) : (
                        <div className="text-gray-500">
                            위치 정보를 가져올 수 없습니다.
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    작성하기
                </button>
            </form>
        </div>
    );
}
