const {createInvoice,generateHeader,generateFooter,generateCustomerInformation,generateTableRow,generateInvoiceTable} = require("./options")
const path = require("path")
exports.createPdf=(data)=>{
    const invoice = createInvoice(data)
    const fs = require('fs');
    const PDFDocument = require('pdfkit');
        let doc = new PDFDocument({ margin: 50 });
      
        generateHeader(doc);
        generateCustomerInformation(doc, invoice);
        generateInvoiceTable(doc, invoice);
        generateFooter(doc);
        doc.pipe(fs.createWriteStream(path.join(__dirname,"./Docs",`${data.id}.pdf`)));
        doc.end();
        return path.join(__dirname,"./Docs",`${data.id}.pdf`) 
}
