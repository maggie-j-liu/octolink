const LoadingSkeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`${className} animate-pulse bg-gray-300`} />;
};
export default LoadingSkeleton;
