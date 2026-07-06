/**
 * components/Spinner.jsx
 * Loading indicator shown while async operations are in progress.
 */

const Spinner = ({ fullPage = false, message = "Loading..." }) => {
  if (fullPage) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{message}</p>
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  );
};

export default Spinner;
