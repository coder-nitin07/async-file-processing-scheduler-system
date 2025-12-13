const { parentPort, workerData } = require('worker_threads');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// // recieve data from fileWorker
// const { filePath } = workerData;

console.log("🧵 Worker thread started");
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
    } catch (err) {
        parentPort.postMessage({
            status: 'error',
            error: err.message
        })
    }
})();