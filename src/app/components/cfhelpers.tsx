/*--------------------------------
postImage

  function for posting an image to Cloudflare
  - input: name of the image as type STRING
  - output: JSON package confirming success or failure
  WORK IN PROGRESS
--------------------------------*/
export async function postImage(image: string) {
    if(!image) {
        // error
    } 
    // post image
}


/*--------------------------------
getImages() 
** only works with null for now, call using getImages(null)

  function for getting image(s) from Cloudflare
  - input: name of the image as a type STRING, or null
  - output:  
    - (null): upon success, returns array of all images in 'cora-image-database'
    - (image-name): upon success, returns the requested image
    - upon failure, returns an array with the error message as the first value
--------------------------------*/
export async function getImages(image: string | null) {
  if(!image) {
    // get all images
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOME_PAGE}/api/cloudflare`);
      const data = await res.json();
      if(data?.success)
        return data?.images;
      else 
        return [`${data?.message}`]
    } catch(err) {
      return [`${err}`]
    }
  } else {
    // get requested image (WORK IN PROGRESS, gonna use it for getting user pfps)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOME_PAGE}/api/cloudflare`, {
        method: 'GET',
        body: image
      })
      const data = await res.json();
      if(data?.success) {

      } else {
        
      }
    } catch(err) {
      return err
    }
  }
}

/*--------------------------------
deleteImage()
  function for deleting an image from Cloudflare
  - input: name of the image as a type STRING, or null
  - output: JSON package confirming success or failure
--------------------------------*/
export async function deleteImage(image: string) {
  if(!image) { return 500 }
  try {
    const formData = new FormData();
    formData.append('image', image)
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOME_PAGE}/api/cloudflare`, {
      method: 'DELETE', 
      body: formData
    })

    const data = await res.json();
    if(data.success) {
      return 200;
    } else {
      console.log('data received a status 500: ', data?.message)
      return 500;
    }
  } catch(err) { return 500 }

}
