"use server";

import Airtable from "@/lib/Airtable";
import { format } from "date-fns";

export const fetchLeads = async ({ selectedClient, dateFrom, dateTo }) => {
    let basedIDs = [];

    try {
        const workflows = await Airtable.getRecordsByView(
            "appGB7S9Wknu6MiQb",
            "Campaigns",
            "Text - workflow"
        );

        if (selectedClient === "All Clients") {
            basedIDs = [...new Set(workflows.data.map((workflow) => workflow["Base ID"]))];
        } else {
            basedIDs = [selectedClient];
        }

        const formattedDateTo = format(dateTo, "yyyy-MM-dd");
        const formattedDateFrom = format(dateFrom, "yyyy-MM-dd");

        const filterByFormula = `AND(
                                    {Outreach} = 'Text',
                                    AND(
                                        IS_AFTER(
                                            {Upload Date},
                                            DATETIME_PARSE('${formattedDateFrom}')
                                        ),
                                        IS_BEFORE(
                                            {Upload Date},
                                            DATETIME_PARSE('${formattedDateTo}')
                                        )
                                    )
                                )`;

        // const filterByFormula = `AND(
        //                             {Status} = 'Hot',
        //                             AND(
        //                                 IS_AFTER(
        //                                     {Upload Date},
        //                                     DATETIME_PARSE('${formattedDateFrom}')
        //                                 ),
        //                                 IS_BEFORE(
        //                                     {Upload Date},
        //                                     DATETIME_PARSE('${formattedDateTo}')
        //                                 )
        //                             )
        //                         )`;

        // * hot leads between dates
        const hoteLeadsBetweenDatesReq = basedIDs.map(async (baseID) => {
            const filteredRecords = await Airtable.getFilteredRecords(baseID, filterByFormula);

            return {
                baseID,
                records: filteredRecords,
            };
        });
        const hoteLeadsBetweenDatesRes = await Promise.all(hoteLeadsBetweenDatesReq);

        const clientLeads = hoteLeadsBetweenDatesRes.map((result) => {
            const client =
                workflows.data.find((workflow) => workflow["Base ID"] === result.baseID)?.Client ||
                "Unknown";

            return {
                client,
                numContacts: result.records.data.length,
                numResponse: result.records.data.filter((record) => record.Responded === true)
                    .length,
                numHotLeads: result.records.data.filter(
                    (record) => record.Status === "Hot" || record.Status === "Booked inspection"
                ).length,
            };
        });

        return {
            success: true,
            data: clientLeads,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};
