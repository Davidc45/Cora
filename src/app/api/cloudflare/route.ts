import { NextResponse, NextRequest } from "next/server";
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: 'auto',
  endpoint: `${process.env.S3_ENDPOINT}`,
  credentials: {
      accessKeyId: `${process.env.S3_KEY_ID}`,
      secretAccessKey: `${process.env.S3_SECRET_KEY}`
  }
})

/*-------------------
POST  
  how to use: 
    - call using fetch('homepage/api/cloudflare', { method: POST, body: formData })
    - where formData is of type FormData
    - AND formData has values for 'rid' and 'image'
    - save the response from fetch in 
        const response = fetch(...)
        const receivedData = response.json()
      check to see if it was successful
        if(receivedData.success) ...
  what it does:
    - if formData is invalid or does not have the required values, will return a JSON throwing an error
    - otherwise, it will upload the user's image to Cloudflare, with its name being the image name + the RID
    ^ upon success, it will return a JSON with the success details 
---------------------*/

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  if(!formData) {
    return NextResponse.json({
      success: false,
      message: 'must input valid formData',
      status: 500,
    })
  }

  const userImage: File = formData.get('image') as File
  const RID = formData.get('rid')
  if(!userImage || !RID) {
    return NextResponse.json({
      success: false,
      message: 'error getting user image or RID',
      status: 500,
    })
  }

  const bytes = await userImage.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const putObjectCommand = new PutObjectCommand({
    Bucket: 'cora-image-database',
    Key: RID + '-' + userImage.name,
    Body: buffer
  })

  try {
    const res = await r2.send(putObjectCommand)
    return NextResponse.json({
      success: true,
      message: res,
      status: 200
    })
  } catch(err) {
    return NextResponse.json({
      success: false,
      message: err,
      status: 500
    })
  }
}

/*-------------------
GET
  how to use: 
    call using fetch('homepage/api/cloudflare')
  what it does: 
    returns a set of key: value pairs 
    - key: the <image-name>-<report-id>
    - value: image url, used in Image component (<Image src={url} .../>)
---------------------*/

export async function GET() {
  const images = new Map<string, string>();
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: 'cora-image-database'
    })

    const list = await r2.send(listCommand);
    const objects  = list.Contents ?? [];
    for(let i = 0; i < objects.length; i++) {
      const key = objects[i].Key;
      const command = new GetObjectCommand({
        Bucket: 'cora-image-database',
        Key: key
      });
      const url = await getSignedUrl(r2, command);
      images.set(key!, url)
    }
    
    // this was working before, now it doesn't, idek what's going on anymore
    // objects.map(async (obj) => {
    //   const command = new GetObjectCommand({
    //     Bucket: 'cora-image-database',
    //     Key: obj.Key!
    //   })
    //   const url = await getSignedUrl(r2, command);
    //   images.set(`${obj.Key!}`, `${url}`)
    // })

    const serializedImages = Object.fromEntries(images)
    console.log('serialized: ', serializedImages)
    return NextResponse.json({
      success: true, 
      status: 200, 
      images: serializedImages
    })
  } catch (err) {
      return NextResponse.json({
        success: false,
        status: 500,
        images: []
      })
  }
}