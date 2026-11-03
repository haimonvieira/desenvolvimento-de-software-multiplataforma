const Container = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--papel)] p-4 sm:p-6 lg:p-8">
      <div
        className="relative mx-auto min-h-[calc(100vh-2rem)] border border-[var(--dourado)] p-5 outline outline-1 outline-[var(--dourado)] outline-offset-4 sm:min-h-[calc(100vh-3rem)] sm:p-7 lg:p-10"
        style={{ maxWidth: "1440px" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
