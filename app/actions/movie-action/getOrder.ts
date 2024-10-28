export function getDefaultOrder(order: MovieOrder) {
    switch (order) {
        case 'crawlDate':
            return { createdTime: 'desc' as const };
        case 'releaseDate':
        default:
            return { releaseDate: 'desc' as const };
    }
}

export function getCollectionOrder(order: MovieOrder) {
    switch (order) {
        case 'favoriteAsc':
            return { createdTime: 'asc' as const };
        case 'releaseDate':
            return { MovieInfo: { releaseDate: 'desc' as const } };
        case 'crawlDate':
            return { MovieInfo: { createdTime: 'desc' as const } };
        case 'favoriteDesc':
        default:
            return { createdTime: 'desc' as const };
    }
}

export function getDownloadOrder(order: MovieOrder) {
    switch (order) {
        case 'downloadAsc':
            return { createdTime: 'asc' as const };
        case 'releaseDate':
            return { MovieInfo: { releaseDate: 'desc' as const } };
        case 'crawlDate':
            return { MovieInfo: { createdTime: 'desc' as const } };
        case 'downloadDesc':
        default:
            return { createdTime: 'desc' as const };
    }
}

export function getMoviesManagerOrder(order: MovieOrder) {
    switch (order) {
        case 'rateDesc':
            return { rate: 'desc' as const };
        case 'rateAsc':
            return { rate: 'asc' as const };
        case 'rateNumDesc':
            return [
                { rateNum: { sort: 'desc', nulls: 'last' } },
                { id: 'desc' }
            ];
        case 'rateNumAsc':
            return [
                { rateNum: { sort: 'asc', nulls: 'last' } },
                { id: 'asc' }
            ]

        case 'releaseDate':
            return { releaseDate: 'desc' as const };
        case 'releaseDateAsc':
            return { releaseDate: 'asc' as const };
        default:
            return { rate: 'desc' as const };
    }
}
