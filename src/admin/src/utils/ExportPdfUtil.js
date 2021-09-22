import "jspdf-autotable";
import moment from "moment";
import config from "./config";

const jsPDF = typeof window !== "undefined" ? require("jspdf").jsPDF : null;

export function exportPdf(columns, data, reportTitle, exportFilename) {
  if (jsPDF !== null) {
    const today = moment(new Date()).format("YYYY-MM-DD");

    const content = {
      columns: columns
        .filter((item) => item.export !== false && !item.hidden && item.field)
        .map((item) => {
          return {
            header: item.title,
            dataKey: item.field,
          };
        }),
      body: data,
      margin: { top: 100 },
      didDrawPage: function (data) {
        doc.addImage(
          `${config.REACT_APP_FRONTEND_BASE_URL}/images/logo-bcparks-positive.png`,
          "PNG",
          50,
          30,
          150,
          50
        );
        doc.setFontSize(40);
        doc.text(reportTitle, 220, 78);
        doc.setFontSize(12);
        doc.text(`Report generated on ${today}`, 1466, 92);
      },
    };

    const unit = "pt";
    const size = "A2";
    const orientation = "landscape";

    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(10);
    doc.autoTable(content);
    doc.save(exportFilename);
  }
}
