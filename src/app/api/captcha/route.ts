// import axios from "axios";
// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";

// export async function POST(request: Request, response: Response) {
//   console.log('post function...')
//   const postData = await request.json();

//   const { gRecaptchToken } = postData;

//   let res;

//   const formData = `secret=${process.env.PRIVATE_CAPTCHA_KEY}&response=${gRecaptchToken}`;

//   try {
//     console.log('trying post...')
//     res = await axios.post(
//       'https://www.google.com/recaptcha/api/siteverify',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );
//   } catch(error) {
//     console.log('error caoght')
//     return NextResponse.json({ success: false })
//   }

//   if(res && res.data?.success && res.data?.score > 0.5) {
//     console.log("score: ", res.data?.score);
//     return NextResponse.json({
//       success: true,
//       score: res.data.score,
//     });
//   } else {
//     console.log('score: ', res.data?.score)
//     return NextResponse.json({ 
//       success: false,
//       score: res.data.score
//     })
//   }
// }

export async function POST(request: Request) {
  const body = await request.json();

  const { token } = body;

  const secretKey = process.env.PRIVATE_CAPTCHA_KEY;

  const verificationResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    {
      method: 'POST',
    });

  const verification = await verificationResponse.json();

  if(verification.success && verification.score > 0.5) {
    return NextResponse.json({
      success: true,
      score: verification.score
    })
  } else {
    return NextResponse.json({
      success: false,
      score: verification.score
    })
  }
}