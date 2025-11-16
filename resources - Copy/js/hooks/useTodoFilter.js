import { useState } from "react";

export const useTodoFilter = (initialFilters = {}) => {
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        filter: initialFilters.filter || "",
        sort_by: initialFilters.sort_by || "created_at",
        sort_order: initialFilters.sort_order || "desc",
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            filter: "",
            sort_by: "created_at",
            sort_order: "desc",
        });
    };

    return { filters, updateFilter, resetFilters };
};