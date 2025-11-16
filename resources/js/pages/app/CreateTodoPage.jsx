import React, { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useForm } from "@inertiajs/react";
import { showError } from "@/lib/swal";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function CreateTodoPage() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        cover: null,
    });

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("cover", file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.cover) {
            formData.append("cover", data.cover);
        }

        post("/todos", {
            data: formData,
            forceFormData: true,
        });
    };

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
                            ✨ Buat Todo Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Tambahkan aktivitas atau rencana baru Anda
                        </p>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Todo</CardTitle>
                            <CardDescription>
                                Isi form di bawah untuk membuat todo baru
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
                                            placeholder="Masukkan deskripsi todo (opsional)"
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
                                        <FieldLabel htmlFor="cover">
                                            Cover Image
                                        </FieldLabel>
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
                                                            Klik untuk upload gambar
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            PNG, JPG, GIF (Max 2MB)
                                                        </p>
                                                    </>
                                                )}
                                            </label>
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
                                            : "Simpan Todo"}
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