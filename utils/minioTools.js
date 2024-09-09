import { Client } from "minio";

const getMinioFiles = async () => {
  const minioClient = new Client({
    endPoint: process.env.MINIO_URL,
    port: 9000,
    useSSL: false,
    accessKey: "admin",
    secretKey: "admin123",
  });

  const bucketName = "wallpaper2";
  let fileList = [];

  try {
    const stream = minioClient.listObjects(bucketName, "", true);

    for await (const file of stream) {
      fileList.push(file.name);
    }
    return fileList;
  } catch (error) {
    console.error("Error fetching files from Minio:", error);
    return [];
  }
};

// Usage
// const files = await getMinioFiles();

// console.log(files);

export { getMinioFiles };
