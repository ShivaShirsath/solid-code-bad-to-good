export default function MessageBar({ message, type = "info" }) {
  if (!message) return null;

  const styles = {
    info: {
      background: "#e8f4fd",
      color: "#0c5460",
      border: "1px solid #bee5eb"
    },

    success: {
      background: "#e6ffed",
      color: "#155724",
      border: "1px solid #c3e6cb"
    },

    error: {
      background: "#ffe6e6",
      color: "#721c24",
      border: "1px solid #f5c6cb"
    }
  };

  return (
    <div
      style={{
        padding: "12px",
        marginTop: "16px",
        borderRadius: "8px",
        fontWeight: "500",
        ...styles[type]
      }}
    >
      {message}
    </div>
  );
}