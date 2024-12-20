import { Card, Inset, Badge } from "@radix-ui/themes";
import Image from "next/image";
import dayjs from "dayjs";

import { Star, Eye, Calendar, Bookmark, Download, Flame } from "lucide-react";

const MoviesCard: React.FC<Movie> = ({
  code,
  rate,
  viewCount = 0,
  releaseDate,
  collected = false,
  downloaded = false,
  coverUrl,
  createdTime,
  tags,
  collectedTime,
  downloadTime,
  onOpenModal,
}) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-md overflow-hidden shadow-lg">
      <div className="relative  cursor-pointer  overflow-hidden">
        <div className="aspect-[4/3]">
          <Image
            src={coverUrl!}
            alt={`images`}
            onClick={() => onOpenModal && onOpenModal(true)}
            fill
            className="transition-transform duration-300 hover:scale-110 object-cover"
          />
        </div>
      </div>

      <div className="p-2 space-y-2">
        <div>
          {collected && collectedTime && (
            <div className="absolute top-0 right-0 flex items-center text-sm text-gray-400">
              <Bookmark
                color="#1E90FF"
                fill="#1E90FF"
                className="mr-1"
                size={14}
              />
              <span>{dayjs(collectedTime).format("YYYY-MM-DD HH:mm")}</span>
            </div>
          )}
          {downloaded && downloadTime && (
            <div className="absolute top-0 right-0 flex items-center text-sm text-gray-400">
              <Download color="orange" className="mr-1" size={14} />
              <span>{dayjs(downloadTime).format("YYYY-MM-DD HH:mm")}</span>
            </div>
          )}
          <h4
            onClick={() => onOpenModal && onOpenModal(true)}
            className=" flex items-center gap-1 text-xl cursor-pointer hover:underline hover:underline-offset-4"
          >
            {dayjs(createdTime).add(6, "day").isAfter(dayjs()) && (
              <Flame className="text-red-400" size={18} />
            )}{" "}
            <span className="font-ibmPlexMono">{code}</span>
          </h4>
        </div>
        <div className="flex items-center w-full justify-between text-sm text-gray-400">
          <div className="flex items-center justify-start flex-grow">
            <Star className="mr-1 text-yellow-400" size={14} />
            <span>{rate}</span>
            <span className="mx-2">•</span>
            <Eye className="mr-1" size={14} />
            <span>{viewCount} views</span>
            <span className="mx-2">•</span>
            <Calendar className="mr-1" size={14} />
            <span>
              {dayjs(releaseDate).format("YYYY-MM-DD") || "2000-01-01"}
            </span>
          </div>
          <div className="flex items-center justify-end ">
            {collected && (
              <Bookmark color="#1E90FF" className="mr-1" size={18} />
            )}
            {downloaded && (
              <Download color="orange" className="mr-1" size={16} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {tags?.map((tag) => (
          <Badge key={tag.id} color="blue">
            {tag.tagName}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MoviesCard;
