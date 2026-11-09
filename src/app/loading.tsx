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
          width: '42px',
          height: '42px',
          border: '3px solid #E6DDD0',
          borderTopColor: '#D9381E',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#6E6055', fontSize: '0.95rem', fontWeight: 700 }}>در حال بارگذاری اطلاعات…</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
