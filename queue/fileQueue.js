const { Queue } = require('bullmq');

const fileQueue = new Queue('file-queue', {
    connection: {
        host: '127.0.0.1',
        port: 6379
    }
});

module.exports = fileQueue;