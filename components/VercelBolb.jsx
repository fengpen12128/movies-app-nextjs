import { list } from "@vercel/blob";

export default async function Page() {
  const response = await list();

  return (
    <>
      {response.blobs.map((blob) => (
        <>
          <a key={blob.pathname} href={blob.downloadUrl}>
            {blob.pathname}
          </a>
          <div>
            <img src={blob.downloadUrl} alt={blob.pathname} />
          </div>
        </>
      ))}
    </>
  );
}
