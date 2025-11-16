import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { usePage } from "@inertiajs/react";

export default function TodoStatistics() {
    const { todos } = usePage().props || {};

    const { series, options } = useMemo(() => {
        // Ambil list todo dengan aman
        const list = Array.isArray(todos?.data) ? todos.data : [];

        const finished = list.filter((t) => Boolean(t.is_finished)).length;
        const unfinished = list.length - finished;

        return {
            series: [finished, unfinished],
            options: {
                chart: {
                    type: "donut",
                },
                labels: ["Selesai", "Belum Selesai"],
                colors: ["#10B981", "#EF4444"],
                legend: {
                    position: "bottom",
                },
                tooltip: {
                    y: {
                        formatter: (val) => `${val} todo`,
                    },
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: { width: 240 },
                            legend: { position: "bottom" },
                        },
                    },
                ],
            },
        };
    }, [todos]);

    return (
        <div className="w-full max-w-xs sm:max-w-sm mx-auto mb-8">
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={300}
            />
        </div>
    );
}
