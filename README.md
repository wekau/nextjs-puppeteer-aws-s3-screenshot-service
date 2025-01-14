This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Rename SAMPLE.env to .env and enter your configurations

Run the development server:

```bash
npm install
npm run dev
```

## Make API Call

```
  async function submitWebsiteURL() {
    const res = await fetch("http://localhost:3000/api/get-screenshot-image", {
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
```

### JSON Post Request

```
{
        "url": "https://www.google.com/",
        "api": "xxxxx",
        "regionName": "ap-southeast-2",
        "bucketName": "xxxx",
        "folderName": "postman",
        "fileName": "pokemon",
        "imageWidth": "1200",
        "imageHeight": "700",
        "fileExpiry": "10"
        }
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
