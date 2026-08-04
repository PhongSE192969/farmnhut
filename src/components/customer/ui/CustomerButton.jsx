import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "bg-customer-primary text-white hover:bg-customer-primaryDark shadow-sm",
  accent:
    "bg-customer-accent text-customer-primaryDark hover:brightness-95 shadow-sm",
  outline:
    "border border-customer-primary text-customer-primary hover:bg-customer-light",
  ghost: "text-customer-primary hover:bg-customer-light",
};

const SIZES = {
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

/**
 * Shared button for the customer-facing storefront only.
 * Renders a <Link> when `to` is provided, otherwise a native <button>.
 */
export default function CustomerButton({
  children,
  variant = "primary",
  size = "md",
  to,
  className = "",
  icon: Icon,
  ...props
}) {
  const classes = `font-customer inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {Icon && <Icon size={18} />}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
