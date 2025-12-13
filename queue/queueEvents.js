const { QueueEvents } = require('bullmq');

const queueEvents = new QueueEvents('file-queue', {
    connection: {
        host: '127.0.0.1',
        port: 6379
    }
});

queueEvents.on('waiting', ({ jobId }) =>{
    console.log(`Job ${ jobId } is waiting.`)
});

queueEvents.on("active", ({ jobId }) => {
  console.log(`ob ${ jobId } is now active`);
});

queueEvents.on("completed", ({ jobId }) => {
  console.log(`Job ${ jobId } completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`Job ${ jobId } failed: ${ failedReason }`);
});

queueEvents.on("progress", ({ jobId, data }) => {
  console.log(`Job ${ jobId } progress:`, data);
});

queueEvents.on("stalled", ({ jobId }) => {
  console.log(`Job ${ jobId } stalled`);
});

queueEvents.on("drained", () => {
  console.log(`Queue drained (no jobs left)`);
});

module.exports = queueEvents;