import { Card, Text, Box, Button, Avatar } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";
import DeleteAlertDialog from "./DeleteAlertDialog";
import Link from "next/link";
import { zenMaruGothic } from "@/app/fonts";

interface ActressCardProps {
  actressName: string;
  avatarBase64: string;
}

const ActressCard: React.FC<ActressCardProps> = ({
  actressName,
  avatarBase64,
}) => {
  return (
    <Box>
      <Card className={`cursor-pointer `}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar
              src={`data:image/jpeg;base64,${avatarBase64}`}
              fallback={actressName.charAt(0)}
              size="6"
              radius="full"
              className="mr-3"
            />
            <Link
              className="hover:underline"
              href={`/actressMovies?name=${actressName}`}
            >
              <Text
                className={`cursor-pointer ${zenMaruGothic.className}`}
                as="div"
                size="5"
                weight="bold"
              >
                {actressName}
              </Text>
            </Link>
          </div>
          <div className="flex items-center">
            <Text as="div" color="gray" size="2">
              {/* Start building your next project in minutes */}
            </Text>
            <DeleteAlertDialog actressName={actressName}>
              <Button variant="ghost">
                <Trash2 className="h-5 w-5 cursor-pointer text-gray-500" />
              </Button>
            </DeleteAlertDialog>
          </div>
        </div>
      </Card>
    </Box>
  );
};

export default ActressCard;
