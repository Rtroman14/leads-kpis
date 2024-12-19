"use client";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ClientTable({ leads = [] }) {
    const [selectedClients, setSelectedClients] = React.useState([]);

    const toggleClient = (clientName) => {
        setSelectedClients((prev) =>
            prev.includes(clientName)
                ? prev.filter((name) => name !== clientName)
                : [...prev, clientName]
        );
    };

    const toggleAll = () => {
        setSelectedClients((prev) =>
            prev.length === leads.length ? [] : leads.map((lead) => lead.client)
        );
    };

    const totals = leads.reduce(
        (acc, lead) => ({
            numContacts: acc.numContacts + lead.numContacts,
            numResponse: acc.numResponse + lead.numResponse,
            numHotLeads: acc.numHotLeads + lead.numHotLeads,
        }),
        { numContacts: 0, numResponse: 0, numHotLeads: 0 }
    );

    if (leads.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Select a client and date range to view leads data
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* <TableHead className="w-[50px]">
                            <Checkbox
                                checked={selectedClients.length === leads.length}
                                onCheckedChange={toggleAll}
                                aria-label="Select all"
                            />
                        </TableHead> */}
                        <TableHead>Client</TableHead>
                        <TableHead>Contacts</TableHead>
                        <TableHead>Responses</TableHead>
                        <TableHead>Hot Leads</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead.client}>
                            {/* <TableCell>
                                <Checkbox
                                    checked={selectedClients.includes(lead.client)}
                                    onCheckedChange={() => toggleClient(lead.client)}
                                    aria-label={`Select ${lead.client}`}
                                />
                            </TableCell> */}
                            <TableCell className="font-medium">{lead.client}</TableCell>
                            <TableCell>{lead.numContacts}</TableCell>
                            <TableCell>
                                {lead.numResponse}
                                <span className="text-xs text-muted-foreground">
                                    {"  "}
                                    {(lead.numResponse / lead.numContacts).toFixed(2)}%
                                </span>
                            </TableCell>
                            <TableCell>
                                {lead.numHotLeads}

                                <span className="text-xs text-muted-foreground">
                                    {"  "}
                                    {(lead.numHotLeads / lead.numResponse).toFixed(2)}%
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}

                    {leads.length > 1 && (
                        <TableRow className="bg-muted/50 font-medium">
                            <TableCell>TOTAL</TableCell>
                            <TableCell>{totals.numContacts}</TableCell>
                            <TableCell>
                                {totals.numResponse}

                                <span className="text-xs text-muted-foreground">
                                    {"  "}
                                    {(totals.numResponse / totals.numContacts).toFixed(2)}%
                                </span>
                            </TableCell>
                            <TableCell>
                                {totals.numHotLeads}

                                <span className="text-xs text-muted-foreground">
                                    {"  "}
                                    {(totals.numHotLeads / totals.numResponse).toFixed(2)}%
                                </span>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
