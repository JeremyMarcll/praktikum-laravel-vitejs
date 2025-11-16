import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, router } from "@inertiajs/react";
import { Trash2, Edit, CheckCircle2, Circle } from "lucide-react";
import { showConfirm, showSuccess, showError } from "@/lib/swal";

export default function TodoCard({ todo }) {
    const handleDelete = async () => {
        const result = await showConfirm(
            "Apakah Anda yakin ingin menghapus todo ini?",
            "Hapus Todo"
        );

        if (result.isConfirmed) {
            router.delete(`/todos/${todo.id}`, {
                onSuccess: () => showSuccess("Todo berhasil dihapus!"),
                onError: () => showError("Gagal menghapus todo"),
            });
        }
    };

    const handleToggleStatus = () => {
        router.patch(`/todos/${todo.id}/toggle-status`, {}, {
            onSuccess: () => {
                showSuccess(
                    todo.is_finished
                        ? "Todo ditandai belum selesai"
                        : "Todo ditandai selesai"
                );
            },
            onError: () => showError("Gagal mengubah status todo"),
        });
    };

    return (
        <Card className={`flex flex-col transition-all ${todo.is_finished ? "opacity-70" : ""}`}>
            {/* Cover Image */}
            {todo.cover && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg bg-gray-200">
                    <img
                        src={`/storage/${todo.cover}`}
                        alt={todo.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className={`flex-1 ${todo.is_finished ? "line-through text-gray-500" : ""}`}>
                        {todo.title}
                    </CardTitle>
                    <Badge variant={todo.is_finished ? "default" : "secondary"}>
                        {todo.is_finished ? "Selesai" : "Belum"}
                    </Badge>
                </div>
            </CardHeader>

            {/* Description */}
            {todo.description && (
                <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {todo.description.replace(/<[^>]*>/g, "")}
                    </p>
                </CardContent>
            )}

            {/* Footer */}
            <CardFooter className="mt-auto flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleToggleStatus}
                >
                    {todo.is_finished ? (
                        <>
                            <Circle className="w-4 h-4 mr-2" />
                            Aktifkan
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Selesaikan
                        </>
                    )}
                </Button>
                <Link href={`/todos/${todo.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </Link>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}