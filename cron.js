const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROCESSED_DIR = path.join(__dirname, 'processed');
const DAILY_PATH = path.join(__dirname, 'metrics/daily.json');

const DAYS_TO_KEEP = 0.0001;

// daily clearnup
cron.schedule('*/10 * * * * *', ()=>{
    console.log('Running daily clearnup & Summary');


    cleanupOldFiles(UPLOADS_DIR);
    cleanupOldFiles(PROCESSED_DIR)

    generateDailySummary();
});


// For testing (comment in prod)
// cron.schedule('*/30 * * * * *', () => {
//   console.log('Cron test running');
// });


function cleanupOldFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const now = Date.now();
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const ageDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

    if (ageDays > DAYS_TO_KEEP) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${ file }`);
    }
  });
}



function generateDailySummary() {
  if (!fs.existsSync(DAILY_PATH)) return;

  const daily = JSON.parse(fs.readFileSync(DAILY_PATH, 'utf-8'));

  const originalMB = (daily.originalBytes / 1024 / 1024).toFixed(2);
  const compressedMB = (daily.compressedBytes / 1024 / 1024).toFixed(2);
  const savedMB = (originalMB - compressedMB).toFixed(2);

  console.log('📊 Daily Summary');
  console.log('Date:', daily.date);
  console.log('Images processed:', daily.images);
  console.log('Original size (MB):', originalMB);
  console.log('Compressed size (MB):', compressedMB);
  console.log('Space saved (MB):', savedMB);

  // Reset daily stats
  fs.writeFileSync(
    DAILY_PATH,
    JSON.stringify(
      {
        date: '',
        images: 0,
        originalBytes: 0,
        compressedBytes: 0
      },
      null,
      2
    )
  );
}





// cron.schedule('*/10 * * * * *', ()=>{
//     console.log(`Running daily metrics summary`);

//     const statsPath = path.join(__dirname, 'metrics/stats.json');
//     const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

//     const originalMB = (stats.totalOriginalBytes / (1024 * 1024)).toFixed(2);
//     const compressedMB  = (stats.totalCompressedBytes  / (1024 * 1024)).toFixed(2);
//     const savedMB = (originalMB - compressedMB).toFixed(1);

//     console.log('Daily Summary');
//     console.log(`Images processed `, stats.totalImages);
//     console.log("Original size (MB): ", originalMB);
//     console.log("Compressed size (MB): ", compressedMB);
//     console.log("Space saved (MB): ", savedMB);
// });