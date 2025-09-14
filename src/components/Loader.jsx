export function Loader({ isLoading }) {
  return (
    isLoading && (
        <div className="bg-50 fixed top-1/2 left-1/2 z-100">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>  
        </div>
    )
  );
}
