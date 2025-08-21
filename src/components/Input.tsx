import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // চাইলে এখানে কাস্টম props যোগ করতে পারো
}

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={`input ${className ?? ""}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props} // <-- required, disabled, name, ইত্যাদি সব support হবে
    />
  );
}
