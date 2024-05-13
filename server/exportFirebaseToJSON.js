const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
    credential: admin.credential.cert("./Collectors_Hangout_Firebase_Admin.json")
});

const db = admin.firestore();

async function exportCollectionToJson(collectionName, outputFilename) {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    fs.writeFile(outputFilename, JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log('Data has been written to JSON file');
    });
}

exportCollectionToJson('waitlist', 'emails.json');
