-- CreateTable
CREATE TABLE "Actress" (
    "id" SERIAL NOT NULL,
    "actressName" VARCHAR(100),
    "bir" DATE,
    "isBlock" VARCHAR(10) DEFAULT '0',
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieInfo" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100),
    "prefix" VARCHAR(100),
    "duration" VARCHAR(100),
    "rate" DECIMAL(10,2),
    "rateNum" INTEGER,
    "releaseDate" DATE,
    "releaseYear" INTEGER,
    "crawlWebsite" VARCHAR(100),
    "crawlUrl" VARCHAR(200),
    "batchNum" VARCHAR(300),
    "updatedTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActressMovie" (
    "actressId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "ActressMovie_pkey" PRIMARY KEY ("actressId","movieId")
);

-- CreateTable
CREATE TABLE "CrawlInfo" (
    "id" SERIAL NOT NULL,
    "batchId" VARCHAR(255) NOT NULL,
    "newlyIncreasedNum" INTEGER DEFAULT 0,
    "updatedNum" INTEGER DEFAULT 0,
    "downloadSize" VARCHAR(100),
    "duration" INTEGER,
    "checked" VARCHAR(10) DEFAULT '0',
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilesInfo" (
    "id" SERIAL NOT NULL,
    "bucketName" VARCHAR(100),
    "path" VARCHAR(200),
    "size" VARCHAR(100),
    "moviesId" INTEGER,
    "type" INTEGER,
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilesInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagnetLinks" (
    "id" SERIAL NOT NULL,
    "moviesId" INTEGER,
    "linkName" VARCHAR(1000),
    "linkUrl" VARCHAR(1000),
    "size" VARCHAR(100),
    "uploadTime" VARCHAR(100),
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagnetLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesCollection" (
    "id" SERIAL NOT NULL,
    "moviesCode" VARCHAR(100),
    "createdTime" TIMESTAMP,

    CONSTRAINT "MoviesCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesTag" (
    "id" SERIAL NOT NULL,
    "tagName" VARCHAR(100),
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoviesTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesOnTag" (
    "movieId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "MoviesOnTag_pkey" PRIMARY KEY ("movieId","tagId")
);

-- CreateTable
CREATE TABLE "MoviesVideoResource" (
    "id" SERIAL NOT NULL,
    "movieCode" VARCHAR(100) NOT NULL,
    "path" VARCHAR(400),
    "size" BIGINT,
    "createdTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoviesVideoResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "code_uni" ON "MovieInfo"("code");

-- CreateIndex
CREATE INDEX "actress_movie_movie_id_index" ON "ActressMovie"("movieId");

-- CreateIndex
CREATE INDEX "actress_movie_actress_id_index" ON "ActressMovie"("actressId");

-- CreateIndex
CREATE INDEX "files_info_movies_id_index" ON "FilesInfo"("moviesId");

-- CreateIndex
CREATE INDEX "magnet_links_movies_id_index" ON "MagnetLinks"("moviesId");

-- CreateIndex
CREATE INDEX "movies_tag_rel_movie_id_index" ON "MoviesOnTag"("movieId");

-- CreateIndex
CREATE INDEX "movies_tag_rel_tag_id_index" ON "MoviesOnTag"("tagId");
