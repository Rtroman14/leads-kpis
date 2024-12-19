"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";

export default function DashboardInputs({ clients, onSubmit, isLoading }) {
    const [selectedClient, setSelectedClient] = useState("");
    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedClient || !dateRange.from || !dateRange.to) {
            alert("Please select both a client and date range");
            return;
        }

        onSubmit({
            selectedClient,
            dateFrom: dateRange.from,
            dateTo: dateRange.to,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end justify-center">
                <div>
                    <label
                        htmlFor="client-select"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Select Client
                    </label>
                    <Select onValueChange={setSelectedClient} value={selectedClient} required>
                        <SelectTrigger id="client-select" className="w-full">
                            <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Clients">All Clients</SelectItem>
                            {clients.map((client) => (
                                <SelectItem key={client["Base ID"]} value={client["Base ID"]}>
                                    {client.Client}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date Range (added to campaign)
                    </label>
                    <DateRangePicker onDateChange={setDateRange} />
                </div>
                <div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Submit"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
