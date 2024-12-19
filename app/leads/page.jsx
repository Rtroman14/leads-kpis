import Airtable from "@/lib/Airtable";
import _ from "@/lib/Helpers";
import LeadsReport from "@/components/leads-report";

export default async function Leads() {
    const workflows = await Airtable.getRecordsByView(
        "appGB7S9Wknu6MiQb",
        "Campaigns",
        "Text - workflow"
    );
    if (!workflows.success) throw new Error(workflows.message);

    const clients = _.removeDuplicateKey(workflows.data, "Base ID");

    return (
        <div className="container mx-auto py-8 px-4 min-h-screen">
            <LeadsReport clients={clients} />
        </div>
    );
}
