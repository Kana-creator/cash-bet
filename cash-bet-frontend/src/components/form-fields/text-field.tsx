import React from "react";

interface Props {
  span: string;
  className: string;
  label: string;
  type: string;
  id: string;
  value: string;
  autoFocus: boolean;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<Props> = ({
  span,
  className,
  label,
  type,
  id,
  value,
  autoFocus,
  placeholder,
  onChange,
  onKeyUp,
}) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={id}>
        {label} <span>{span}</span>
      </label>
      <input
        type={type}
        className="form-control"
        id={id}
        defaultValue={value}
        autoComplete="true"
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={onChange}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyUp(e)}
      />
      <small className="fs-6"></small>
    </div>
  );
};

export default TextField;
