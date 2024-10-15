import React, { FC } from "react";
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
  progressValue?: number;
  progressLabel?: string;
  additionalInfo?: string;
}

const NumShowCard: FC<NumShowCardProps> = ({
  num,
  title,
  progressValue,
  progressLabel,
  additionalInfo,
}) => {
  return (
    <Card >
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">{num}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{additionalInfo}</div>
      </CardContent>
      <CardFooter>
        <Progress value={progressValue} aria-label={progressLabel} />
      </CardFooter>
    </Card>
  );
};

export default NumShowCard;
