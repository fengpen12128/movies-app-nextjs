"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { message } from "react-message-popup";
import { useRequest } from "ahooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 导入 server actions
import {
  getScheduleCrawlUrl,
  addScheduleCrawlUrl,
  deleteScheduleCrawlUrl,
} from "@/app/actions/admin/dashboard";

export function ScheduleCrawlUrlTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<ScheduleCrawlUrl[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState<
    Omit<ScheduleCrawlUrl, "id" | "createdTime">
  >({
    web: "",
    url: "",
    uri: "",
    maxPage: 1,
  });

  const {
    loading,
    error,
    run: fetchData,
  } = useRequest(() => getScheduleCrawlUrl({ page: 1 }), {
    manual: true,
    onSuccess(data) {
      setSchedules(data.data || []);
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  // 添加一个网站列表
  const webOptions = ["Javdb"];

  // 添加新数据
  const handleAdd = async () => {
    try {
      const { code, msg } = await addScheduleCrawlUrl(
        newSchedule as ScheduleCrawlUrl
      );
      if (code !== 200) {
        message.error(msg!);
        return;
      }

      setIsAddModalOpen(false);
      fetchData();
      message.success("添加成功");

      // 重置表单内容
      setNewSchedule({
        web: "",
        url: "",
        uri: "",
        maxPage: 1,
      });
    } catch (error) {
      console.error("Failed to add schedule:", error);
      message.error("添加失败");
    }
  };

  // 删除数据
  const handleDelete = async (ids: string[]) => {
    if (confirm("确定要删除选中的项目吗？")) {
      try {
        await deleteScheduleCrawlUrl(ids.map((id) => parseInt(id)));
        fetchData();
        setSelectedIds([]);
        message.success("删除成功");
      } catch (error) {
        console.error("Failed to delete schedules:", error);
        message.error("删除失败");
      }
    }
  };

  // 选择/取消选择所有项目
  const toggleAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(schedules.map((s) => s.id!.toString()));
    }
  };

  // 选择/取消选择单个项目
  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Button onClick={() => setIsAddModalOpen(true)}>添加</Button>
        <Button
          onClick={() => handleDelete(selectedIds)}
          disabled={selectedIds.length === 0}
        >
          删除选中项
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === schedules.length}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Index</TableHead>
            <TableHead>Web</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>URI</TableHead>
            <TableHead>Max Page</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule, index) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(schedule.id!.toString())}
                  onCheckedChange={() => toggleItem(schedule.id!.toString())}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{schedule.web}</TableCell>
              <TableCell>{schedule.url}</TableCell>
              <TableCell>{schedule.uri}</TableCell>
              <TableCell>{schedule.maxPage}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete([schedule.id!.toString()])}
                >
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新的调度 URL</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="web" className="text-right">
                Web
              </Label>
              <Select
                value={newSchedule.web}
                onValueChange={(value) =>
                  setNewSchedule({ ...newSchedule, web: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择网站" />
                </SelectTrigger>
                <SelectContent>
                  {webOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={newSchedule.url}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, url: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="uri" className="text-right">
                URI
              </Label>
              <Input
                id="uri"
                value={newSchedule.uri}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, uri: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxPage" className="text-right">
                Max Page
              </Label>
              <Input
                id="maxPage"
                type="number"
                value={newSchedule.maxPage}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    maxPage: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAdd}>添加</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
