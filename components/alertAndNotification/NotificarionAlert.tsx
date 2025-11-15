import { AlertCircle } from "lucide-react";
import React from "react";

interface Props {
  message: string;
  style: string;
  iconStyle: string;
  textStyle: string;
}
const NotificarionAlert = ({ message, style, iconStyle, textStyle }: Props) => {
  return (
    <div className="lg:w-[400px] md:w-[300px] w-full  absolute top-5 right-0  ">
      <div className={`p-3  rounded-sm ${style}`}>
        <div className="flex items-center justify-start gap-5">
          <div>
            <AlertCircle size={40} className={`${iconStyle}`} />
          </div>
          <div>
            {/* <h1 className="text-text-primary text-xl">Are you sure!</h1> */}
            <h1 className={`text-[14px] ${textStyle}`}>{message}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificarionAlert;
