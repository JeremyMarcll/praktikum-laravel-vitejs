import React, { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "@inertiajs/react";
import { showSuccess, showError } from "@/lib/swal";

export default function EditTodoPage() {
    const { todo } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title: todo?.title || "",
        description: todo?.description || "",
        is_finished: todo?.is_finished || false,
        cover: null,
    });

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("cover", file);
            const reader = new FileReader();
            reader.onload = (event) => setPreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    // ...existing code...
const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side guard
    if (!data.title || !data.title.toString().trim()) {
        showError("Judul tidak boleh kosong");
        return;
    }

    // Kirim FormData hanya jika ada file, agar Inertia tetap bisa handle boolean & string
    put(`/todos/${todo.id}`, {
        forceFormData: !!data.cover, // hanya true kalau ada file
        onSuccess: () => showSuccess("Todo berhasil diperbarui!"),
        onError: (errs) => {
            console.error("Validation errors (raw):", errs);
            showError(Object.values(errs).flat().join(", ") || "Gagal menyimpan");
        },
    });
};

// ...existing code...

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/todos" className="flex items-center gap-2 text-primary hover:underline mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-4xl font-bold mb-2">
                            ✏️ Edit Todo
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui detail todo Anda
                        </p>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Todo</CardTitle>
                            <CardDescription>
                                Ubah informasi todo sesuai kebutuhan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="title">
                                            Judul <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="title"
                                            type="text"
                                            placeholder="Masukkan judul todo"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                        />
                                        {errors.title && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {errors.title}
                                            </div>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="description">
                                            Deskripsi
                                        </FieldLabel>
                                        <Textarea
                                            id="description"
                                            placeholder="Masukkan deskripsi todo"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="min-h-[150px]"
                                        />
                                        {errors.description && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {errors.description}
                                            </div>
                                        )}
                                    </Field>

                                    <Field>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_finished"
                                                checked={data.is_finished}
                                                onCheckedChange={(checked) =>
                                                    setData("is_finished", checked)
                                                }
                                            />
                                            <FieldLabel htmlFor="is_finished" className="mb-0">
                                                Tandai sebagai selesai
                                            </FieldLabel>
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="cover">
                                            Cover Image
                                        </FieldLabel>
                                        <div className="space-y-4">
                                            {todo?.cover && !preview && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Gambar saat ini:
                                                    </p>
                                                    <img
                                                        src={`/storage/${todo.cover}`}
                                                        alt={todo.title}
                                                        className="max-h-48 rounded"
                                                    />
                                                </div>
                                            )}
                                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                                <input
                                                    id="cover"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="cover"
                                                    className="cursor-pointer block"
                                                >
                                                    {preview ? (
                                                        <>
                                                            <img
                                                                src={preview}
                                                                alt="Preview"
                                                                className="max-h-48 mx-auto mb-2 rounded"
                                                            />
                                                            <p className="text-sm text-muted-foreground">
                                                                Klik untuk mengubah gambar
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                            <p className="text-sm font-medium mb-1">
                                                                Klik untuk upload gambar baru
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                PNG, JPG, GIF (Max 2MB)
                                                            </p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        {errors.cover && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {errors.cover}
                                            </div>
                                        )}
                                    </Field>
                                </FieldGroup>

                                {/* Buttons */}
                                <div className="flex gap-2 justify-end pt-4">
                                    <Link href="/todos">
                                        <Button variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}