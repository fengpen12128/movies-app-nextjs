import React from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { message: dogImage } = await fetch(
    "https://dog.ceo/api/breeds/image/random",
    {
            
    }
  ).then((res) => res.json());

  return (
    <div className="flex-center h-screen">
      <img src={dogImage} alt="dog" />
    </div>
  );
}
