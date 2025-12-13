const { Worker } = require('bullmq');
const path = require('path');

// worker for processing files
const fileWorker = new Worker(
    'file-queue',
    async job =>{
        console.log(`Running job: ${ job.id }`);
        console.log(`File path`, job.data.filePath);
     
        // send job to worker thread
        const workerPath = path.join(__dirname, '../workers/imageProcessor.js');

        return new Promise((resolve, reject) =>{
            const { Worker: ThreadWorker } = require('worker_threads');

            const thread = new ThreadWorker(workerPath, {
                workerData: job.data        // send file and other details
            });

            // thread returns the procesosed file path
            thread.on('message', result =>{
                console.log(`Job ${ job.id } completed by thread`);

                resolve(result);
            });
            
            thread.on("error", err => {
                console.log(`Job ${ job.id } failed in thread`);
                reject(err);
            });

            thread.on("exit", code => {
                if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${ code }`));
                }
            });
        });
    },
    {
        connection: {
            host: '127.0.0.1',
            port: 6379
        }
    }
);

module.exports = fileWorker;