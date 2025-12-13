const { parentPort, workerData } = require('worker_threads');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

console.log("Worker thread started");
console.log('Processing ',  workerData.filePath);

(async ()=> {
    try {
        const inputPath = workerData.filePath;
        const outputDir = path.join(__dirname, '../processed');

        // checking processed folder exissts
        if(!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        // output fileanme
        const outputFile = `processed-${ Date.now() }.jpg`;
        const outputPath = path.join(outputDir, outputFile);

        
        // image processing using Sharp
        await sharp(inputPath)
            .resize({
                width: 800,
                withoutEnlargement: true
            })
            .jpeg({ quality: 70 })
            .toFile(outputPath);


        // send result abck to Worker
        parentPort.postMessage({
            status: 'completed',
            outputPath
        });


        // 
        const statsPath = path.join(__dirname,  '../metrics/stats.json');

        // read file sizes
        const originalSize = fs.statSync(inputPath).size;
        const compressedSize = fs.statSync(outputPath).size;

        // read existing stats
        const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

        // update stats
        stats.totalImages += 1;
        stats.totalOriginalBytes += originalSize;
        stats.totalCompressedBytes += compressedSize;

        // save bacl
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));



        // daily stats
        const dailyPath = path.join(__dirname, '../metrics/daily.json');

        const today = new Date().toISOString().slice(0, 10);
        const daily = JSON.parse(fs.readFileSync(dailyPath, 'utf-8'));

        if(daily.date !== today){
            daily.date = today;
            daily.images = 0;
            daily.originalBytes = 0;
            daily.compressedBytes = 0;
        }

        daily.images += 1;
        daily.originalBytes += originalSize;
        daily.compressedBytes += compressedSize;
        
        fs.writeFileSync(dailyPath, JSON.stringify(daily, null, 2));
    } catch (err) {
        parentPort.postMessage({
            status: 'error',
            error: err.message
        })
    }
})();