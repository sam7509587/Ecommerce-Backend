function createInvoice  (data){
    let invoice = {paid: 0,
        invoice_nr: data.id,}
    invoice.shipping = {
        name: data.userId.fullName,
        address: data.addressId.houseNo + " " + data.addressId.street,
        city: data.addressId.city,
        state: data.addressId.state,
        country: data.addressId.country,
        postal_code: data.addressId.pinCode,
    }
    invoice.items = []
    invoice.subtotal= 0
    data.products.map((i) => {
        obj = {
            item: i.productId.productName,
            // description: 'Toner Cartridge',
            quantity: i.quantity,
            amount: i.productId.price * i.quantity,
        }
        invoice.subtotal += i.productId.price * i.quantity
        invoice.items.push(obj)
    })
    return invoice
};

function generateHeader(doc) {
	doc
    // .image('logo.png', 50, 45, { width: 50 })
		.fillColor('#000')
		.fontSize(20)
		.text('E-commerce Backend.', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('Indore, MP', 200, 80, { align: 'right' })
		.moveDown();
}

function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}
function generateCustomerInformation(doc, invoice) {
	const shipping = invoice.shipping;

	doc.text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
		.text(`Invoice Date: ${new Date()}`, 50, 215)
		.text(`Total Amount: ${invoice.subtotal - invoice.paid}`, 50, 130)
        .moveDown()
		.text(`${shipping.name}`, 50, 250)
		.text(shipping.address,50, 265)
		.text(
			`${shipping.city}, ${shipping.state}, ${shipping.country}`,
			50,
			280,
		)
		.moveDown();
}
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 150, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}
function generateInvoiceTable(doc, invoice) {
    const y=330 + 0 * 30
    doc.fontSize(10)
    .text("Product Name", 50, y)
    .text("Description", 150, y)
    .text("Amount per Item", 280, y, { width: 90, align: 'right' })
    .text("Quantity", 370, y, { width: 90, align: 'right' })
    .text("Sub total", 0, y, { align: 'right' });
	let i,
    invoiceTableTop = 330;

	for (i = 0; i < invoice.items.length; i++) {
		const item = invoice.items[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.item,
			item.description,
			item.amount / item.quantity,
			item.quantity,
			item.amount,
		);
	}
}
module.exports = {
    generateInvoiceTable,generateHeader,generateFooter,generateCustomerInformation,createInvoice
}
