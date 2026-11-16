
const { connectToDatabase, getDatabase, closeDatabase } = require("./config/db");

async function testConnection() {
    try {
        await connectToDatabase();

        const db = getDatabase();

        const collections = await db.listCollections().toArray();

        console.log("\nAvailable GameTracker collections:");

        collections.forEach((collection) => {
            console.log("- " + collection.name);
        });

    } catch (error) {
        console.error("Connection test failed:", error);
    } finally {
        await closeDatabase();
    }
}

testConnection();
