import { useEffect, useState } from "react";
import { filesize } from "filesize";
import { Button, Card } from "@radix-ui/themes";

export default function VideoPlayResource({ videoResource = [] }) {
  const [resources, setResources] = useState(videoResource);
  const fetchVideoSize = async () => {
    const updatedResources = await Promise.all(
      videoResource.map(async (x) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${x.path}`,
            {
              method: "HEAD",
            }
          );
          const size = res.headers.get("Content-Length");
          return { ...x, size: filesize(size) };
        } catch (error) {
          console.error("Error fetching video size:", error);
          return x;
        }
      })
    );
    setResources(updatedResources);
  };

  useEffect(() => {
    fetchVideoSize();
  }, [videoResource]);

  const handleClick = (e, href) => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      e.preventDefault();
      window.open(href, "_blank");
    }
  };

  return (
    <Card className="my-10">
      <div>
        <div className="text-xl font-ma">选择播放</div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3"> */}
        <div className="flex flex-wrap gap-3 mt-3">
          {resources.map((item) => {
            const href =
              typeof window !== "undefined" && window.innerWidth <= 768
                ? "http://127.0.0.1:9000/demo/douying_sample.mp4"
                : "iina://weblink?url=http://127.0.0.1:9000/demo/douying_sample.mp4";
            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => handleClick(e, href)}
              >
                <Button
                  className="cursor-pointer"
                  color="cyan"
                  variant="outline"
                >
                  {item.path} ({item.size})
                </Button>
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
