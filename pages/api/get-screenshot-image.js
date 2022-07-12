import chromium from "chrome-aws-lambda";
import AWS from "aws-sdk";

const S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
});

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    // running locally
    const puppeteer = require("puppeteer");
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export default async (req, res) => {
  const url = req.body.url;
  const endpointAPIKey = req.body.api;
  const bucketName = process.env.S3_BUCKET_NAME;
  const folderName = req.body.folderName;
  const fileName = req.body.fileName;
  const fileExpiry = req.body.fileExpiry;
  const urlRegex = /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi;
  const urlTest = urlRegex.test(url);
  console.log("S3: : ", S3);

  // Perform URL validation
  if (!urlTest || endpointAPIKey !== process.env.ENDPOINT_API_KEY) {
    res.json({
      status: "error",
      error: "Enter a valid URL and API KEY",
    });

    return;
  }

  let browser = null;

  try {
    browser = await getBrowserInstance();
    let urlMatch = url.match(urlRegex)[0];
    console.log("URL found: ", urlMatch);
    let page = await browser.newPage();
    await page.goto(urlMatch);
    const imageBuffer = await page.screenshot();
    const Bucket = `${folderName != "" ? bucketName + "/" + folderName : bucketName}`;

    const params = {
      Bucket,
      Key: fileName + Date.now() + ".jpg",
      Body: imageBuffer,
      Conditions: [["acl", "public-read"]],
      ACL: "public-read",
    };

    S3.upload(params, (error, data) => {
      console.log(error, data);
      if (error) {
        return res.json({
          status: "error",
          error: error.message || "Something went wrong",
        });
      }

      const params = {
        Bucket,
        Key: fileName + Date.now() + ".jpg",
        Expires: Number(fileExpiry),
      };

      const signedURL = S3.getSignedUrl("getObject", params);
      console.log("Bucket Location: ", data.Location);

      res.json({
        status: "ok",
        data: data.Location,
      });
    });

    // upload this buffer on AWS S3
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      data: error.message || "Something went wrong",
    });
    // return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
