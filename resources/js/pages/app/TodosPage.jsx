import React, { useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import TodoCard from "@/components/TodoCard";
import TodoStatistics from "@/components/TodoStatistics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, router, usePage } from "@inertiajs/react";
import { Plus, Search, RotateCcw } from "lucide-react";
import { useTodoFilter } from "@/hooks/useTodoFilter";
import { showSuccess } from "@/lib/swal";

export default function TodosPage() {
    const { todos, stats, filters: initialFilters } = usePage().props;
    const { flash } = usePage().props;
    const { filters, updateFilter, resetFilters } = useTodoFilter(initialFilters);

    // Show success message if exists
    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (value) => {
        updateFilter("search", value);
    };

    const handleFilterChange = (value) => {
        updateFilter("filter", value);
    };

    const handleSortChange = (value) => {
        const [sortBy, sortOrder] = value.split("_");
        updateFilter("sort_by", sortBy);
        updateFilter("sort_order", sortOrder);
    };

    const handleApplyFilters = () => {
        router.get("/todos", filters, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        resetFilters();
        router.get("/todos");
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                📋 Daftar Todo
                            </h1>
                            <p className="text-muted-foreground">
                                Kelola aktivitas dan rencana harian Anda
                            </p>
                        </div>
                        <Link href="/todos/create">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Todo
                            </Button>
                        </Link>
                    </div>

                    {/* Statistics */}
                    <TodoStatistics stats={stats} />

                    {/* Filters */}
                    <div className="bg-card p-4 rounded-lg border mb-6">
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari todo..."
                                    className="pl-10"
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />
                            </div>

                            {/* Filter Status */}
                            <Select value={filters.filter} onValueChange={handleFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="finished">Selesai</SelectItem>
                                    <SelectItem value="unfinished">
                                        Belum Selesai
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select
                                value={`${filters.sort_by}_${filters.sort_order}`}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at_desc">
                                        Terbaru
                                    </SelectItem>
                                    <SelectItem value="created_at_asc">
                                        Terlama
                                    </SelectItem>
                                    <SelectItem value="title_asc">
                                        Nama A-Z
                                    </SelectItem>
                                    <SelectItem value="title_desc">
                                        Nama Z-A
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={handleApplyFilters}
                                >
                                    Filter
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(filters.search || filters.filter) && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-muted-foreground">
                                    Filter aktif:
                                </span>
                                {filters.search && (
                                    <Badge variant="secondary">
                                        Cari: {filters.search}
                                    </Badge>
                                )}
                                {filters.filter && (
                                    <Badge variant="secondary">
                                        Status: {filters.filter}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Todo List */}
                    {todos.data.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {todos.data.map((todo) => (
                                    <TodoCard key={todo.id} todo={todo} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                {todos.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            link.active
                                                ? "bg-primary text-primary-foreground"
                                                : link.url
                                                  ? "hover:bg-muted cursor-pointer"
                                                  : "opacity-50 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                Belum ada todo. Mulai dengan membuat yang baru!
                            </p>
                            <Link href="/todos/create">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Buat Todo Pertama
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}