interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "gradient" | "secondary" | "outline";
  fullWidth?: boolean;
  large?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // ✅ Add type prop
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  large = false,
  onClick,
  disabled = false,
  type = "button", // ✅ default type
}: ButtonProps) {
  const classes = `btn btn-${variant} ${fullWidth ? "btn-full" : ""} ${large ? "btn-large" : ""}`;

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
