export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '1rem',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #fed7aa',
          borderTopColor: '#ff5a00',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>در حال بارگذاری اطلاعات…</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
