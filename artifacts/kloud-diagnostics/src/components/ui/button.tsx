import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ghost-primary' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-[9px] font-sans font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-97";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-[#0F2347] shadow-[0_4px_14px_rgba(27,58,107,0.25)] hover:shadow-[0_6px_20px_rgba(27,58,107,0.35)] hover:scale-[1.03]",
    secondary: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md hover:scale-[1.03]",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "hover:bg-muted text-foreground",
    'ghost-primary': "hover:bg-primary/10 text-primary",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
