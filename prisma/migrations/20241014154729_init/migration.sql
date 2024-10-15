-- CreateTable
CREATE TABLE "movies_info" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100),
    "prefix" VARCHAR(100),
    "duration" VARCHAR(100),
    "rate" DECIMAL(10,2),
    "rate_num" INTEGER,
    "release_date" DATE,
    "release_year" INTEGER,
    "crawl_website" VARCHAR(100),
    "crawl_url" VARCHAR(200),
    "batch_num" VARCHAR(300),
    "updated_time" TIMESTAMP(6),
    "created_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actress" (
    "id" SERIAL NOT NULL,
    "actress_name" VARCHAR(100),
    "birth_day" DATE,
    "avatar_base64" TEXT,
    "is_block" VARCHAR(10) DEFAULT '0',

    CONSTRAINT "actress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crawl_info" (
    "id" SERIAL NOT NULL,
    "batch_id" VARCHAR(255) NOT NULL,
    "newly_increased_num" INTEGER DEFAULT 0,
    "updated_num" INTEGER DEFAULT 0,
    "download_size" VARCHAR(100),
    "duration" INTEGER,
    "checked" VARCHAR(10) DEFAULT '0',
    "created_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crawl_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files_info" (
    "id" SERIAL NOT NULL,
    "bucket_name" VARCHAR(100),
    "path" VARCHAR(200),
    "size" VARCHAR(100),
    "movies_id" INTEGER,
    "type" INTEGER,
    "online_url" TEXT,

    CONSTRAINT "files_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magnet_links" (
    "id" SERIAL NOT NULL,
    "movies_id" INTEGER,
    "link_url" VARCHAR(1000),
    "size" VARCHAR(100),
    "upload_time" VARCHAR(100),

    CONSTRAINT "magnet_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies_collection" (
    "id" SERIAL NOT NULL,
    "movie_code" VARCHAR(100) NOT NULL,
    "created_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies_tag" (
    "id" SERIAL NOT NULL,
    "tag_name" VARCHAR(100),
    "created_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies_video_resource" (
    "id" SERIAL NOT NULL,
    "movie_code" VARCHAR(100) NOT NULL,
    "path" VARCHAR(400) NOT NULL,
    "size" VARCHAR(100),
    "created_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_video_resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_statistics" (
    "id" SERIAL NOT NULL,
    "total_size" BIGINT NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),
    "duration" DOUBLE PRECISION,
    "success_count" INTEGER NOT NULL,
    "failure_count" INTEGER NOT NULL,
    "total_count" INTEGER NOT NULL,
    "batch_id" VARCHAR(100),
    "created_at" DATE,

    CONSTRAINT "download_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_urls" (
    "id" SERIAL NOT NULL,
    "batch_id" TEXT,
    "url" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER,
    "type" INTEGER,

    CONSTRAINT "downloads_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actress_fav" (
    "id" SERIAL NOT NULL,
    "actress_name" VARCHAR(100) NOT NULL,
    "created_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actress_fav_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crawl_source_data" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "crawl_source_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crawl_stat" (
    "id" SERIAL NOT NULL,
    "batch_id" TEXT,
    "status" INTEGER DEFAULT 0,
    "trans_status" INTEGER DEFAULT 0,
    "download_status" INTEGER DEFAULT 0,
    "started_time" TIMESTAMP(6),
    "end_time" TIMESTAMP(6),
    "crawl_params" JSONB,
    "execute_type" TEXT,
    "newly_increased_num" INTEGER DEFAULT 0,
    "updated_num" INTEGER DEFAULT 0,
    "download_size" TEXT,

    CONSTRAINT "crawl_stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crawl_batch_record" (
    "id" SERIAL NOT NULL,
    "batch_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "crawl_batch_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browsing_history" (
    "id" SERIAL NOT NULL,
    "movie_code" VARCHAR(100) NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "browsing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_tag_on_movie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_actress_on_movie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "code_uni" ON "movies_info"("code");

-- CreateIndex
CREATE UNIQUE INDEX "actress_actress_name_key" ON "actress"("actress_name");

-- CreateIndex
CREATE INDEX "files_info_movies_id_index" ON "files_info"("movies_id");

-- CreateIndex
CREATE INDEX "magnet_links_movies_id_index" ON "magnet_links"("movies_id");

-- CreateIndex
CREATE UNIQUE INDEX "movies_collection_movie_code_key" ON "movies_collection"("movie_code");

-- CreateIndex
CREATE UNIQUE INDEX "movies_tag_tag_name_key" ON "movies_tag"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "movies_video_resource_movie_code_path_key" ON "movies_video_resource"("movie_code", "path");

-- CreateIndex
CREATE UNIQUE INDEX "actress_fav_actress_name_key" ON "actress_fav"("actress_name");

-- CreateIndex
CREATE UNIQUE INDEX "crawl_stat_batch_id_key" ON "crawl_stat"("batch_id");

-- CreateIndex
CREATE INDEX "browsing_history_movie_code_idx" ON "browsing_history"("movie_code");

-- CreateIndex
CREATE UNIQUE INDEX "_tag_on_movie_AB_unique" ON "_tag_on_movie"("A", "B");

-- CreateIndex
CREATE INDEX "_tag_on_movie_B_index" ON "_tag_on_movie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_actress_on_movie_AB_unique" ON "_actress_on_movie"("A", "B");

-- CreateIndex
CREATE INDEX "_actress_on_movie_B_index" ON "_actress_on_movie"("B");

-- AddForeignKey
ALTER TABLE "files_info" ADD CONSTRAINT "files_info_movies_id_fkey" FOREIGN KEY ("movies_id") REFERENCES "movies_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magnet_links" ADD CONSTRAINT "magnet_links_movies_id_fkey" FOREIGN KEY ("movies_id") REFERENCES "movies_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies_collection" ADD CONSTRAINT "movies_collection_movie_code_fkey" FOREIGN KEY ("movie_code") REFERENCES "movies_info"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies_video_resource" ADD CONSTRAINT "movies_video_resource_movie_code_fkey" FOREIGN KEY ("movie_code") REFERENCES "movies_info"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actress_fav" ADD CONSTRAINT "actress_fav_actress_name_fkey" FOREIGN KEY ("actress_name") REFERENCES "actress"("actress_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "browsing_history" ADD CONSTRAINT "browsing_history_movie_code_fkey" FOREIGN KEY ("movie_code") REFERENCES "movies_info"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tag_on_movie" ADD CONSTRAINT "_tag_on_movie_A_fkey" FOREIGN KEY ("A") REFERENCES "movies_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tag_on_movie" ADD CONSTRAINT "_tag_on_movie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_actress_on_movie" ADD CONSTRAINT "_actress_on_movie_A_fkey" FOREIGN KEY ("A") REFERENCES "actress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_actress_on_movie" ADD CONSTRAINT "_actress_on_movie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
