import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMoviesByCondition } from "@/app/actions/admin/movies/deleteMoviesByCondition";
import { message } from "react-message-popup";

export function useDeleteMoviesByCondition(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const { mutate: handleConditionDelete, isPending } = useMutation({
        mutationFn: async (params: Omit<MovieQueryParams, 'page' | 'pageSize' | 'order'>) => {
            const response = await deleteMoviesByCondition(params);
            if (response.code !== 200) {
                throw new Error(response.msg);
            }
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["moviesList"] });
            message.success(`删除成功，共删除 ${response.data} 条记录`);
            onSuccess?.();
        },
        onError: (error: any) => {
            console.error("Delete by condition failed:", error);
            message.error(error.message || "批量删除失败");
        },
    });

    return {
        handleConditionDelete,
        isPending,
    };
}
