interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};