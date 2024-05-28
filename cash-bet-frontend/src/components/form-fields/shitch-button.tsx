import React, { useEffect, useState } from "react";

interface Props {
  onClick: () => any;
  status: number;
}

const SwitchButton: React.FC<Props> = ({ onClick, status }) => {
  const [buttonStatus, setButtonStatus] = useState<number>(status);

  const changeButtonStatus = () => {
    buttonStatus === 0 ? setButtonStatus(1) : setButtonStatus(0);
  };

  // useEffect(() => {
  //   setButtonStatus(status);
  // }, []);

  return (
    <div className="col-6 d-flex justify-content-center ">
      <div
        className={`switch-button ${buttonStatus === 1 ? "on" : "off"}`}
        onClick={() => {
          changeButtonStatus();
          onClick();
        }}
      >
        <div className="switch fs-12">{buttonStatus === 1 ? "On" : "Off"}</div>
      </div>
    </div>
  );
};

export default SwitchButton;
