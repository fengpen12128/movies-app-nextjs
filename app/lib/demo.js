import { Client } from "minio";

export async function deleteMinioFolders(folders) {
  const minioClient = new Client({
    endPoint: "127.0.0.1",
    port: 9000,
    useSSL: false,
    accessKey: "admin",
    secretKey: "admin123",
  });

  const folderPaths = Array.isArray(folders) ? folders : [folders];

  for (const folderPath of folderPaths) {
    // 确保文件夹路径以 '/' 结尾
    const normalizedPath = folderPath.endsWith("/")
      ? folderPath
      : `${folderPath}/`;

    try {
      // 列出文件夹中的所有对象
      const objectsList = [];
      const objectsStream = minioClient.listObjects(
        "movies",
        normalizedPath,
        true // recursive = true 递归列出子文件夹中的对象
      );

      // 收集所有对象的路径
      for await (const obj of objectsStream) {
        if (obj.name) {
          objectsList.push(obj.name);
        }
      }

      if (objectsList.length > 0) {
        // 批量删除所有对象
        await minioClient.removeObjects("movies", objectsList);
      }

      console.log(`删除文件夹 ${normalizedPath} 成功`);

      // 记录成功删除的文件夹
    } catch (error) {
      console.error(`删除文件夹 ${normalizedPath} 失败:`, error);
    }
  }
}

deleteMinioFolders("PAKO-064").then(() => {
  console.log("删除成功");
});
