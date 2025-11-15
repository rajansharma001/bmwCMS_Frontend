import React from "react";

type Props = {
  btnTitle: string;
  clickEvent?: () => void;
  btnStyle: string;
};
const Button = ({ btnTitle, clickEvent, btnStyle }: Props) => {
  return (
    <button
      onClick={clickEvent}
      className={`${btnStyle}  text-white h-10 flex items-center justify-center rounded-sm  py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm `}
    >
      {btnTitle}
    </button>
  );
};

export default Button;
