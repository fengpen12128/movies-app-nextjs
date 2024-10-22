import React, { FC, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NumShowCardProps {
  num?: string;
  title?: string;
  icon?: ReactNode;
  progressValue?: number;
  progressLabel?: string;
  additionalInfo?: string;
}

const NumShowCard: FC<NumShowCardProps> = ({
  num,
  title,
  icon,

  additionalInfo,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
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
