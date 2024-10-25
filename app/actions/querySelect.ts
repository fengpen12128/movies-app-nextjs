export const movieSelect = {

    id: true,
    tags: true,
    duration: true,
    code: true,
    maker: true,
    rate: true,
    rateNum: true,
    releaseDate: true,
    releaseYear: true,
    createdTime: true,
    updatedTime: true,
    actresses: {
        select: {
            id: true,
            actressName: true
        }
    },
    files: {
        where: {
            type: 2
        },
        select: {
            path: true,
            onlineUrl: true
        }
    },
}
