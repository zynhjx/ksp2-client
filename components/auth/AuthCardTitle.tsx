import React from "react";


const AuthCardTitle = ({title, subtitle}: {title: string, subtitle?: string}) => {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-4xl md:text-3xl font-black text-theme-blue mb-2">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  )
}
export default AuthCardTitle
