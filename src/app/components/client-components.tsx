'use client'

import { report } from "process"
import { useState } from "react"
import { deleteImage, getImages } from "./cfhelpers"
import Image from "next/image"
import { deleteReport } from "./actions"

/**
 * Small dismissible error banner component.
 *
 * Props:
 * - `message`: string to display; when falsy, nothing is rendered.
 *
 * Note: state is local only. If an error is passed via query string and the
 * page reloads with the same URL, the banner will reappear (by design).
 */
export function Err({ message }: any) {
  const [show, setShow] = useState(true)
  const dismiss = () => {
    setShow(false)
  }

  return (
    <> { 
      message && show ?
        <div className="error">
          Error: {message}
          <div onClick={dismiss}>X</div>
        </div> :
        <></>
      } </>
  )
}

/*---------------------
<Reports /> 
displays a set of given reports (with images)

Input
- reports: an array of reports to display (can get from supabase and pass directly)
- images: an array of the reports' images (can get from cloudflare and pass directly)
- inAccount: boolean value, if true, will display a delete button with each report
---------------------*/
export function Reports({ reports, images, inAccount }: any | null) {
  if(reports.length <= 0) {
    return <div className="report-container">No reports</div>
  } else if(!reports || !images) {
    return <div className="report-container">Error getting reports or images</div>
  } else {
    const formattedReports = reports?.map((report: any) => {
      const url = images[report.report_id + '-' + report.report_image];
      return (
        <div key={report.report_id} className="report">
          <h3 className="report-title">{report.report_title}</h3>
          <p className="report-desc">{report.report_description}</p>
          {
            report.report_image ? 
            <Image 
              src={url}
              alt="usr-img"
              width={100}
              height={100}
              className="report-image"
            /> : 
            <div className="no-image">Empty</div>
          }
          {
            inAccount ? 
            <form>
              <input type="hidden" name="rid" value={report.report_id}/>
              <button formAction={(e) => {
                const confirm = window.confirm('delete post?');
                if(confirm) { 
                  console.log('e: ', e)
                  deleteReport(e) 
                } 
              }} className="report-delete">
                delete
              </button>
            </form>
             : <></>
          }
        </div>
      )
    });
    return (
      <div className="report-container">
        {formattedReports}
      </div>
    );
  }
}