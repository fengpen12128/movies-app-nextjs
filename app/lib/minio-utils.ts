import { Client } from 'minio'

type DeleteResult = {
    success: string[]
    failed: string[]
}

/**
 * 删除文件，支持单个文件或多个文件
 * @param paths - 单个文件路径或文件路径数组
 * @returns Promise<DeleteResult> - 返回成功和失败的文件路径
 */
export async function deleteMinioFiles(paths: string | string[]): Promise<DeleteResult> {
    const minioClient = new Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: parseInt(process.env.MINIO_PORT!),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!
    })

    const filePaths = Array.isArray(paths) ? paths : [paths]
    const results: DeleteResult = {
        success: [],
        failed: []
    }

    await Promise.all(
        filePaths.map(async (filePath) => {
            try {
                await minioClient.removeObject(process.env.MINIO_BUCKET_NAME!, filePath)
                results.success.push(filePath)
            } catch (error) {
                console.error(`删除文件 ${filePath} 失败:`, error)
                results.failed.push(filePath)
            }
        })
    )

    return results
}

/**
 * 删除文件夹及其内容
 * @param folders - 单个文件夹路径或文件夹路径数组
 * @returns Promise<DeleteResult> - 返回成功和失败的文件路径
 */
export async function deleteMinioFolders(folders: string | string[]): Promise<DeleteResult> {
    const minioClient = new Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: parseInt(process.env.MINIO_PORT!),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!
    })

    const folderPaths = Array.isArray(folders) ? folders : [folders]
    const results: DeleteResult = {
        success: [],
        failed: []
    }

    for (const folderPath of folderPaths) {
        // 确保文件夹路径以 '/' 结尾
        const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`

        try {
            // 列出文件夹中的所有对象
            const objectsList: string[] = []
            const objectsStream = minioClient.listObjects(
                process.env.MINIO_BUCKET_NAME!,
                normalizedPath,
                true // recursive = true 递归列出子文件夹中的对象
            )

            // 收集所有对象的路径
            for await (const obj of objectsStream) {
                if (obj.name) {
                    objectsList.push(obj.name)
                }
            }

            if (objectsList.length > 0) {
                // 批量删除所有对象
                await minioClient.removeObjects(
                    process.env.MINIO_BUCKET_NAME!,
                    objectsList
                )
            }

            console.log(`删除文件夹 ${normalizedPath} 成功`)

            // 记录成功删除的文件夹
            results.success.push(normalizedPath)
        } catch (error) {
            console.error(`删除文件夹 ${normalizedPath} 失败:`, error)
            results.failed.push(normalizedPath)
        }
    }

    return results
}
