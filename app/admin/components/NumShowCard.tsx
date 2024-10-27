import React, { FC, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Film, User, Tag, List } from "lucide-react";

interface NumShowCardProps {
  num?: string;
  title?: string;
  icon?: ReactNode;
  progressValue?: number;
  progressLabel?: string;
  additionalInfo?: string;
}

const NumShowCard: FC<NumShowCardProps> = ({ num, title, additionalInfo }) => {
  const getIcon = () => {
    switch (title) {
      case "Movies Num":
        return <Film className="mr-2 h-4 w-4" />;
      case "Actress Num":
        return <User className="mr-2 h-4 w-4" />;
      case "Prefix Num":
        return <Tag className="mr-2 h-4 w-4" />;
      case "Crawl Schedule Num":
        return <List className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center">
          {getIcon()}
          {title}
        </CardDescription>
        <CardTitle className="text-4xl">{num}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{additionalInfo}</div>
      </CardContent>
    </Card>
  );
};

export default NumShowCard;
