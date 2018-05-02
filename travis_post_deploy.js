if(!process.env.TRAVIS){
    console.error("Error: not running in travis-CI");
    process.exit(1);
} else {
    console.log("CloudFront invalidation running...");
}

const aws = require('aws-sdk')
const distribID = process.env.CLOUDFRONT_DISTRIBUTION

const cloudfront = new aws.CloudFront()

const timestamp = new Date().toISOString();

const params = {
    DistributionId: distribID,
    InvalidationBatch: {
        CallerReference: timestamp,
        Paths: {
            Quantity: 1,
            Items: ['/*']
        }
    }
}

cloudfront.createInvalidation(params, (e, d)=>{
    console.log("...complete.")
    if (e) {
        console.log("Error invalidating CloudFront Cache: " + JSON.stringify(e));
        process.exit(1);
    } else {
        console.log(JSON.stringify(d));
        console.log("AWS CloudFront: Invalidation success.");
        process.exit(0);
    }
})