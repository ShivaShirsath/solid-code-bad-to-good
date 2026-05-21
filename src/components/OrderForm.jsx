// Presentational component only: it renders the order form and emits events upward.
// SOLID: Single Responsibility - no business logic here, only UI concerns.
export default function OrderForm({
  user,
  item,
  qty,
  paymentMethod,
  onUserChange,
  onItemChange,
  onQtyChange,
  onPaymentMethodChange,
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
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <label>Qty</label>
      <input type="number" value={qty} onChange={(e) => onQtyChange(e.target.value)} />

      <label>Payment</label>
      <select value={paymentMethod} onChange={(e) => onPaymentMethodChange(e.target.value)}>
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>

      <button onClick={onBuy}>Buy</button>
      <button onClick={onExport}>Export CSV + Revenue</button>
    </div>
  );
}