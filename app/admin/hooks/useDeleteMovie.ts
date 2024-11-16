import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMovies } from "@/app/actions/admin/movies/deleteMovies";
import { message } from "react-message-popup";


export function useDeleteMovie(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const { mutate: handleDelete, isPending } = useMutation({
        mutationFn: async (id: number | number[]) => {
            const response = await deleteMovies(id);
            if (response.code !== 200) {
                throw new Error(response.msg);
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["moviesList"] });
            message.success("删除成功");
            onSuccess?.();
        },
        onError: (error: any) => {
            console.error("Delete failed:", error);
            message.error(error.message || "删除失败");
        },
    });

    return {
        handleDelete,
        isPending,
    };
}
