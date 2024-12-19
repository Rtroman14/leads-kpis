"use client";

import { useState } from "react";
import DashboardInputs from "@/components/dashboard-inputs";
import ClientTable from "@/components/client-table";
import { fetchLeads } from "@/app/actions";

export default function LeadsReport({ clients }) {
    const [leadsData, setLeadsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchLeads = async ({ selectedClient, dateFrom, dateTo }) => {
        setIsLoading(true);
        try {
            const response = await fetchLeads({
                selectedClient,
                dateFrom,
                dateTo,
            });

            if (response.success) {
                setLeadsData(response.data);
            } else {
                console.error("Failed to fetch leads:", response.message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="sticky top-0 bg-white py-4 z-10 border-b">
                <DashboardInputs
                    clients={clients}
                    onSubmit={handleFetchLeads}
                    isLoading={isLoading}
                />
            </div>
            <div className="flex-1">
                <ClientTable leads={leadsData} />
            </div>
        </div>
    );
}
