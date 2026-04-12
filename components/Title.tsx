import React from "react";
import { twMerge } from "tailwind-merge";

type TitleProps = {
  children: React.ReactNode;
  className?: string
};

const Title = ({ children, className }: TitleProps) => {
  return <h1 className={twMerge("font-bold text-2xl text-theme-dark-blue mb-4",
    className
  )}>{children}</h1>;
};

export default Title;

