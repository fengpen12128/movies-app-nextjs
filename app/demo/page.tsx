import React from "react";

export const dynamic = "force-dynamic";
import Demo2 from "./demo2";

export default async function Home() {
  const { message: dogImage } = await fetch(
    "https://dog.ceo/api/breeds/image/random",
    {}
  ).then((res) => res.json());

  return (
    <div className="w-[80%] mx-auto">
      <Demo2 />
    </div>
  );
}
