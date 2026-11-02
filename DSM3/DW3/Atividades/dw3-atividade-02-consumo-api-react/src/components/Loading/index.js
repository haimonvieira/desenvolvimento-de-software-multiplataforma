const Loading = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-600">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      <p>Carregando...</p>
    </div>
  );
};

export default Loading;
