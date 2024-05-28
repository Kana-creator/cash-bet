import React from "react";

const ScreenPreloader = () => {
  return (
    <div className="col-6 h-50">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 30 200 150">
        <circle
          fill="none"
          strokeOpacity="1"
          stroke="#CFCFCF"
          strokeWidth=".5"
          cx="100"
          cy="100"
          r="5"
        >
          <animate
            attributeName="r"
            calcMode="spline"
            dur="2"
            values="0;50"
            keyTimes="0;1"
            keySplines="0 .2 .5 1"
            repeatCount="indefinite"
          >
            Loading...
          </animate>
          <animate
            attributeName="stroke-width"
            calcMode="spline"
            dur="2"
            values="0;25"
            keyTimes="0;1"
            keySplines="0 .2 .5 1"
            repeatCount="indefinite"
          >
            Loading...
          </animate>
          <animate
            attributeName="stroke-opacity"
            calcMode="spline"
            dur="2"
            values="1;0"
            keyTimes="0;1"
            keySplines="0 .2 .5 1"
            repeatCount="indefinite"
          >
            Loading...
          </animate>
        </circle>
      </svg>
    </div>
  );
};

export default ScreenPreloader;
