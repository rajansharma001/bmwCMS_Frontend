import { AlertCircle } from "lucide-react";
import React from "react";
import Button from "../Button";

interface Props {
  desc: string;
  confirm: () => void;
  cancel: () => void;
}
const Alert = ({ desc, cancel, confirm }: Props) => {
  return (
    <div className=" flex items-center justify-center ">
      <div className="p-5 bg-white rounded-sm ">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertCircle size={50} className="text-primary" />
          <h1 className="text-text-primary text-2xl">Are you sure!</h1>
          <h1 className="text-text-primary text-[14px]">{desc}</h1>
          <div className="w-full flex gap-5 items-center justify-center">
            <Button
              btnStyle="text-text-primary font-semibold"
              btnTitle="Yes, Confirm"
              clickEvent={confirm}
            />
            <Button
              btnStyle="bg-red-500 text-text-primary font-semibold"
              btnTitle="Cancel"
              clickEvent={cancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
