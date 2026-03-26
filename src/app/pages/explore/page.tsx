import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function Explore() {
    const supabase = await createClient();
    const { data: reports } = await supabase.from('reports').select();

    const data = await fetch(`${process.env.NEXT_PUBLIC_HOME_PAGE}/api/cloudflare`);
    const dataJSON = await data.json()
    const images = dataJSON?.images

  
    const formattedReports = reports?.map((report) => {
      const url = images[report.report_id + '-' + report.report_image]

      return (
        <div key={report.report_id} className="report">
          <h3>{report.report_title}</h3>
          <p>{report.report_description}</p>
          { report.report_image ? 
            <Image 
              src={url}
              alt="usr-img"
              width={100}
              height={100}
            /> : <div className="no-image">Empty</div>}
        </div>
      )
    })
  
    return (
      <div>
        <h1>Reports and complaints</h1>
        { formattedReports?.length == 0 ? <div>no reports yet</div> : formattedReports }
      </div>
    )
}