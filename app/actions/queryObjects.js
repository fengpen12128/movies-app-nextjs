export const movieQuery = {
  
};

export const downloadMovieQuery = {
  include: {
    MovieInfo: {
      include: {
        files: {
          where: {
            type: 2,
          },
        },
      },
    },
  },
  orderBy: {
    createdTime: "desc",
  },
  distinct: ["movieCode"],
};

export const collectionMovieQuery = {
  include: {
    MovieInfo: {
      include: {
        files: { where: { type: 2 } },
        actresses: true,
      },
    },
  },
  orderBy: { createdTime: "desc" },
};

export const actressFavQuery = {
  orderBy: {
    createdTime: "desc",
  },
  include: {
    Actress: {
      select: {
        avatarBase64: true,
      },
    },
  },
};

export const moviesByActressQuery = {
  select: {
    id: true,
    code: true,
    releaseDate: true,
    rate: true,
    rateNum: true,
    files: {
      where: {
        type: 2,
      },
      select: {
        path: true,
      },
    },
    tags: true,
  },
  orderBy: {
    releaseDate: "desc",
  },
};
