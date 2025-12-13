const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

cron.schedule('*/10 * * * * *', ()=>{
    console.log(`Running daily metrics summary`);

    const statsPath = path.join(__dirname, 'metrics/stats.json');
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

    const originalMB = (stats.totalOriginalBytes / (1024 * 1024)).toFixed(2);
    const compressedMB  = (stats.totalCompressedBytes  / (1024 * 1024)).toFixed(2);
    const savedMB = (originalMB - compressedMB).toFixed(1);

    console.log('Daily Summary');
    console.log(`Images processed `, stats.totalImages);
    console.log("Original size (MB): ", originalMB);
    console.log("Compressed size (MB): ", compressedMB);
    console.log("Space saved (MB): ", savedMB);
});