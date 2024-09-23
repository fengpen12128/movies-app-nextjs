import { Card, Text, Box, Button } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";
import DeleteAlertDialog from "./DeleteAlertDialog";
import Link from "next/link";

const ActressCard = ({ actressName }) => {
  const handleDelete = () => {
    // Implement delete logic here
    console.log(`Deleting ${actressName}`);
  };

  return (
    <Box>
      <Card className="cursor-pointer  ">
        <div className="flex justify-between items-center">
          <Link className="hover:underline" href={`/actressMovies?name=${actressName}`}>
            <Text
              className="font-ma cursor-pointer"
              as="div"
              size="4"
              weight="bold"
            >
              {actressName}
            </Text>
          </Link>
          <Text as="div" color="gray" size="2">
            {/* Start building your next project in minutes */}
          </Text>
          <DeleteAlertDialog actressName={actressName}>
            <Button variant="ghost">
              <Trash2 className="h-5 w-5 cursor-pointer text-gray-500" />
            </Button>
          </DeleteAlertDialog>
        </div>
      </Card>
    </Box>
  );
};

export default ActressCard;
