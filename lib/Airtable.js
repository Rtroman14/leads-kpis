import Airtable from "airtable";
import axios from "axios";

class AirtableApi {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Using Airtable requires an API key.");
        }

        this.apiKey = apiKey;
    }

    async config(baseID) {
        try {
            return new Airtable({ apiKey: this.apiKey }).base(baseID);
        } catch (error) {
            console.log("NO API KEY PROVIDED ---", error);
        }
    }

    headers = {
        headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
            "Content-Type": "application/json",
        },
    };

    async getRecord(baseID, table, recordID) {
        try {
            const base = await this.config(baseID);
            const res = await base(table).find(recordID);
            return { success: true, data: { ...res.fields, recordID } };
        } catch (error) {
            console.log("Airtable.getRecord() ---", error);
            return { success: false, data: null, message: error.message };
        }
    }

    async getRecordsByView(baseID, table, view) {
        try {
            const base = await this.config(baseID);
            const res = await base(table).select({ view }).all();
            const contacts = res.map((contact) => ({
                ...contact.fields,
                recordID: contact.getId(),
            }));
            return { success: true, data: contacts };
        } catch (error) {
            console.log("ERROR - getRecordsByView() ---", error);
            return { success: false, data: null, message: error.message };
        }
    }

    async getFilteredRecords(baseID, filterByFormula) {
        try {
            const base = await this.config(baseID);
            const res = await base("Prospects").select({ filterByFormula }).all();
            const contacts = res.map((contact) => ({
                ...contact.fields,
                recordID: contact.getId(),
            }));
            return { success: true, data: contacts.length ? contacts : [] };
        } catch (error) {
            console.log("ERROR - getFilteredRecords() ---", error);
            return { success: false, data: [], message: error.message };
        }
    }

    async getHotLeads(baseID, client) {
        try {
            const base = await this.config(baseID);
            const res = await base("Prospects")
                .select({
                    filterByFormula: `OR({Status} = "Hot")`,
                })
                .all();
            const contacts = res.map((contact) => ({
                ...contact.fields,
                client,
                recordID: contact.getId(),
            }));
            return { success: true, data: contacts.length ? contacts : [] };
        } catch (error) {
            console.log("ERROR getHotLeads() ---", error);
            return { success: false, data: null, message: error.message };
        }
    }

    async filteredProspects(baseID, filterByFormula) {
        try {
            const base = await this.config(baseID);
            const res = await base("Prospects").select({ filterByFormula }).all();
            const contacts = res.map((contact) => ({
                ...contact.fields,
                recordID: contact.getId(),
            }));
            return { success: true, data: contacts.length ? contacts : [] };
        } catch (error) {
            console.log("ERROR filteredProspects() ---", error);
            return { success: false, data: null, message: error.message };
        }
    }

    async fetchFilteredRecords(baseID, table, filterByFormula) {
        try {
            const base = await this.config(baseID);
            const res = await base(table).select({ filterByFormula }).all();
            const contacts = res.map((contact) => ({
                ...contact.fields,
                recordID: contact.getId(),
            }));
            return { success: true, data: contacts.length ? contacts : [] };
        } catch (error) {
            console.log("ERROR fetchFilteredRecords() ---", error);
            return { success: false, data: null, message: error.message };
        }
    }

    async updateRecord(baseID, table, recordID, updatedFields) {
        try {
            const base = await this.config(baseID);

            const record = await base(table).update(recordID, updatedFields);

            return { ...record.fields, id: record.id };
        } catch (error) {
            console.log("Airtable.updateRecord() ---", error.message);
            return false;
        }
    }

    async updateRecords(baseID, table, records) {
        try {
            const base = await this.config(baseID);

            const record = await base(table).update(records);

            return { ...record.fields, id: record.id };
        } catch (error) {
            console.log("Airtable.updateRecords() ---", error.message);
            return false;
        }
    }

    async createRecord(baseID, table, record) {
        try {
            const base = await this.config(baseID);

            const res = await base(table).create(record);

            return res;
        } catch (error) {
            console.log("Airtable.createRecord() ---", error);
            return false;
        }
    }

    async deleteRecord(baseID, table, recordID) {
        try {
            const base = await this.config(baseID);

            const res = await base(table).destroy(recordID);

            return res;
        } catch (error) {
            console.log("Airtable.deleteRecord() ---", error);
            return false;
        }
    }

    async createRecords(records, baseID) {
        try {
            const base = await this.config(baseID);

            const res = await base("Prospects").create(records);

            return res;
        } catch (error) {
            console.log("ERROR CREATERECORDS() ---", error);
            return false;
        }
    }

    async batchUpload(prospects, baseID) {
        try {
            const batchAmount = 10;
            const batchesOfTen = Math.ceil(prospects.length / batchAmount);

            for (let batch = 1; batch <= batchesOfTen; batch++) {
                let tenProspects = prospects.slice(0, batchAmount);
                prospects = prospects.slice(batchAmount);
                const createdRecords = await this.createRecords(tenProspects, baseID);
                if (!createdRecords.success)
                    return { success: false, data: null, message: "Batch creation failed" };
            }

            return { success: true, data: true };
        } catch (error) {
            console.log("ERROR BATCHUPLOAD() ---", error);
            return { success: false, data: null, message: error.message };
        }
    }

    async batchUpdate(baseID, table, prospects) {
        try {
            const batchAmount = 10;
            const batchesOfTen = Math.ceil(prospects.length / batchAmount);

            for (let batch = 1; batch <= batchesOfTen; batch++) {
                // get first 10 contacts
                let tenProspects = prospects.slice(0, batchAmount);
                // remove first 10 contacts from array
                prospects = prospects.slice(batchAmount);

                const udpatedRecords = await this.updateRecords(baseID, table, tenProspects);

                // code for errors
                if (!udpatedRecords) return false;
            }

            return true;
        } catch (error) {
            console.log("ERROR BATCHUPLOAD() ---", error);
            return false;
        }
    }

    getBaseSchema = async (baseId) => {
        try {
            const { data } = await axios.get(
                `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
                this.headers
            );

            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error("getBaseSchema() -->", error.message);
            return { success: false };
        }
    };

    listBases = async () => {
        try {
            const { data } = await axios.get(
                `https://api.airtable.com/v0/meta/bases`,
                this.headers
            );

            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error("Airtable.listBases() -->", error.response.data);
            return { success: false };
        }
    };

    baseName = async (baseID) => {
        try {
            const res = await this.listBases();
            if (!res.success) {
                return { success: false };
            }

            const foundBase = res.data.bases.find((base) => base.id === baseID);
            return foundBase.name;
        } catch (error) {
            console.error("Airtable.listBases() -->", error.response.data);
            return { success: false };
        }
    };

    formatAirtableContacts = (contacts) => contacts.map((contact) => ({ fields: { ...contact } }));
}

export default new AirtableApi(process.env.AIRTABLE_TOKEN);
