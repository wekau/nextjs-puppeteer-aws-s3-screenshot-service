import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function Home() {
  const [websiteURL, setWebsiteURL] = useState("");
  const [endPointAPI, setEndPointAPI] = useState("");
  const [regionName, setRegionName] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [fileExpiry, setFileExpiry] = useState("");
  const [imageURL, setImageURL] = useState("/");

  async function submitWebsiteURL() {
    const res = await fetch("/api/get-screenshot-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: websiteURL,
        api: endPointAPI,
        regionName,
        bucketName,
        folderName,
        fileName,
        imageWidth,
        imageHeight,
        fileExpiry,
      }),
    }).then((res) => res.json());
    const imageURL = res.data;
    setImageURL(imageURL);
    console.log("Image URL: ", imageURL);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Image key={imageURL} src={imageURL} width={1280} height={720} />

      <div className={styles.inputArea}>
        <input type="text" value={websiteURL} onChange={(e) => setWebsiteURL(e.target.value)} placeholder="Enter a website URL (https://www.)" />
        <br />
        <input type="text" value={endPointAPI} onChange={(e) => setEndPointAPI(e.target.value)} placeholder="Enter API KEY" />
        <br />
        <input type="text" value={regionName} onChange={(e) => setRegionName(e.target.value)} placeholder="Region (ap-southeast-2)" />
        <br />
        <input type="text" value={bucketName} onChange={(e) => setBucketName(e.target.value)} placeholder="Enter S3 Bucketname" />
        <br />
        <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Enter Folder Name (Auto create in S3)" />
        <br />
        <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Filename, no file extension needed" />
        <br />
        <input type="number" value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} placeholder="Set image Width" />
        <br />
        <input type="number" value={imageHeight} onChange={(e) => setImageHeight(e.target.value)} placeholder="Set image Height" />
        <br />
        <input type="number" value={fileExpiry} onChange={(e) => setFileExpiry(e.target.value)} placeholder="File Expiry (Days)" />
        <br />
        <button onClick={submitWebsiteURL}>Submit</button>
      </div>
    </div>
  );
}
