export async function POST(req) {
    const { title, author, content } = await req.json();

    function getRandomNickname() {
        const adjectives = [
            "Happy",
            "Crazy",
            "Silent",
            "Brave",
            "Funny",
            "Mysterious",
        ];
        const animals = ["Panda", "Tiger", "Fox", "Rabbit", "Penguin"];
        const randomAdj =
            adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal =
            animals[Math.floor(Math.random() * animals.length)];
        return `${randomAdj} ${randomAnimal}`;
    }

    const nickname = author ? author : getRandomNickname();

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author: nickname,
        createdAt: new Date(),
    };

    posts.push(newPost);

    return NextResponse.json(newPost);
}
