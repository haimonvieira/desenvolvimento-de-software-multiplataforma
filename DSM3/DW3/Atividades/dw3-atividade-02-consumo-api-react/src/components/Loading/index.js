const Loading = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-[var(--rotulo)]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--filete)] border-t-[var(--dourado)]"></div>
      <p className="font-[family-name:var(--fonte-serif)] text-sm tracking-wide">
        Consultando registro…
      </p>
    </div>
  );
};

export default Loading;
