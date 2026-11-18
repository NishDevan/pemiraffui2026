export default function Template({ children }) {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center animate-fade-in-up">
      {children}
    </div>
  );
}