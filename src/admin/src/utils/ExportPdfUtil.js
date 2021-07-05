import "jspdf-autotable";
import moment from "moment";
const jsPDF = typeof window !== "undefined" ? require("jspdf").jsPDF : null;

export function exportPdf(columns, data, reportTitle) {
  if (jsPDF !== null) {
    const today = moment(new Date()).format("YYYY-MM-DD");
    const content = {
      columns: columns
        .filter((item) => item.export !== false)
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
          `${process.env.PUBLIC_URL}/images/bcid-logo-rgb-pos.jpg`,
          "JPEG",
          36,
          12,
          88,
          88
        );
        doc.setFontSize(30);
        doc.text(reportTitle, 130, 64);
        doc.setFontSize(14);
        doc.text(`Report Generated On: ${today}`, 130, 80);
      },
    };

    const unit = "pt";
    const size = "A2";
    const orientation = "landscape";

    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(10);
    doc.autoTable(content);
    doc.save("bc-park-status.pdf");
  }
}
