import React from "react";
import { SelectOptionsModule } from "../modules/select-options-module";

interface Props {
  className: string;
  label: string;
  span: string;
  id: string;
  options: SelectOptionsModule[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectOption: React.FC<Props> = ({
  className,
  label,
  span,
  id,
  options,
  onChange,
}) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={id}>
        {label} <span>{span}</span>
      </label>
      <select
        className="form-control"
        id={id}
        autoComplete="true"
        onChange={onChange}
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <small className="fs-6"></small>
    </div>
  );
};

export default SelectOption;
