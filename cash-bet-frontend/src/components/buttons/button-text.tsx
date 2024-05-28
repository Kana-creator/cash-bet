import React, { memo } from "react";

interface Props {
  className: string;
  value: string;
  id: string;
  action: (e: React.FormEvent) => void;
}

const ButtonText: React.FC<Props> = memo(({ className, value, id, action }) => {
  return (
    <div className={className}>
      <input
        type="submit"
        value={value}
        className="form-control btn btn-text"
        id={id}
        onClick={action}
      />
    </div>
  );
});

export default ButtonText;
