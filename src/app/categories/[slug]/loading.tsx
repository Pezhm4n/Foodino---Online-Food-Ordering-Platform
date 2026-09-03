export default function CategoryLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
        minHeight: '60vh',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid #ffedd5',
          borderTopColor: '#ff5a00',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>در حال بارگذاری دسته‌بندی…</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
