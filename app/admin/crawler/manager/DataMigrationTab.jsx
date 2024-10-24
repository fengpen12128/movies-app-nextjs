import { useState, useEffect } from "react";
import { Button, Card, Text, ScrollArea } from "@radix-ui/themes";
import { Play, StopCircle } from "lucide-react";
import { Progress } from "@nextui-org/react";
import useCrawlStore from "@/store/crawlStore";

const DataMigrationTab = () => {
  const [migrationStatus, setMigrationStatus] = useState("idle");
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationLogs, setMigrationLogs] = useState([]);
  const [migrationTime, setMigrationTime] = useState(0);
  const [migrationTimer, setMigrationTimer] = useState(null);
  const { batchId } = useCrawlStore();

  const startMigration = async () => {
    setMigrationStatus("running");
    setMigrationTime(0);

    const timer = setInterval(() => {
      setMigrationTime((prevTime) => prevTime + 1);
    }, 1000);
    setMigrationTimer(timer);

    // Simulate migration process
  };

  const stopMigration = () => {
    setMigrationStatus("idle");
    clearInterval(migrationTimer);
  };

  useEffect(() => {
    return () => {
      if (migrationTimer) {
        clearInterval(migrationTimer);
      }
    };
  }, [migrationTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <Text size="6" weight="bold">
          Data Migration
        </Text>
        <div className="flex items-center gap-4">
          <Button
            color={migrationStatus === "running" ? "red" : "green"}
            onClick={
              migrationStatus === "running" ? stopMigration : startMigration
            }
            disabled={migrationStatus === "completed"}
          >
            {migrationStatus === "running" ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Migration
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Migration
              </>
            )}
          </Button>
          <Text size="3">
            Status:{" "}
            <span className="font-bold">
              {migrationStatus.charAt(0).toUpperCase() +
                migrationStatus.slice(1)}
            </span>
          </Text>
          <Text size="3">
            Time: <span className="font-bold">{formatTime(migrationTime)}</span>
          </Text>
        </div>
        {/* <Progress
          value={migrationProgress}
          color="success"
          className="max-w-md"
          showValueLabel={true}
        /> */}
        <Text size="4" weight="bold">
          Migration Logs:
        </Text>
        <Card>
          <ScrollArea
            type="always"
            scrollbars="vertical"
            style={{ minHeight: 200, maxHeight: 800 }}
          >
            {migrationLogs.map((log, index) => (
              <Text key={index} size="2" className="mb-1">
                {log}
              </Text>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </Card>
  );
};

export default DataMigrationTab;
