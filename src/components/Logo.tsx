interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`font-bold text-2xl ${className}`}>
      <span className="text-white">N</span>
      <span className="text-blue-400">G</span>
    </div>
  );
};
