import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";
  import { PlusCircle } from "lucide-react";
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useState } from "react";

  const formSchema = z.object({
    web: z.string().min(1, "Web is required"),
    urls: z.string().min(1, "URLs are required"),
  });

  const WEB_OPTIONS = [
    { label: "Javdb", value: "Javdb" }
  ] as const;

  interface AddDialogProps {
    onAdd: (data: { web: string, url: string }[]) => Promise<void>;
  }

  export function AddDialog({ onAdd }: AddDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        web: "Javdb",
        urls: "",
      },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      // 将文本框中的URLs拆分成数组（按行分割）
      const urlList = values.urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0)
        .map(url => ({
          web: values.web,
          url: url
        }));

      if (urlList.length === 0) return;

      await onAdd(urlList);
      form.reset({
        web: "Javdb",
        urls: "",
      });
      setOpen(false);
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-green-600"
            title="Add new items"
          >
            <PlusCircle size={20} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>添加新记录</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="web"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Web</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a web" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WEB_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="urls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URLs (每行一个URL)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请输入URLs，每行一个"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">添加</Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
