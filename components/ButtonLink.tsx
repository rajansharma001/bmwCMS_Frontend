import Link from "next/link";
import React from "react";

type Props = {
  btnTitle: string;
  btnLink: string;
  btnStyle: string;
};
const ButtonLink = ({ btnTitle, btnLink, btnStyle }: Props) => {
  return (
    <Link
      href={`${btnLink}`}
      className={`${btnStyle} py-4 lg:px-7 px-4 bg-primary hover:bg-text-primary hover:text-white cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm `}
    >
      {btnTitle}
    </Link>
  );
};

export default ButtonLink;
