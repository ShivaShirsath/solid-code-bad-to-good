export default function OrderForm({
  user,
  item,
  qty,
  payment,
  onUserChange,
  onItemChange,
  onQtyChange,
  onPaymentChange,
  onBuy,
  onExport
}) {
  return (
    <div className="card">
      <h2>Create Order</h2>
      <label>User</label>
      <input value={user} onChange={(e) => onUserChange(e.target.value)} />

      <label>Item</label>
      <select value={item} onChange={(e) => onItemChange(e.target.value)}>
        {items.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label>Qty</label>
      <input type="number" value={qty} onChange={(e) => onQtyChange(e.target.value)} />

      <label>Payment</label>
      <select value={payment} onChange={(e) => onPaymentChange(e.target.value)}>
        {paymentMethods.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button onClick={onBuy}>Buy</button>
      <button onClick={onExport}>Export CSV + Revenue</button>
    </div>
  );
}

