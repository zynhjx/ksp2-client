import {ReactNode} from "react";
import Sidebar from  "@/components/Sidebar"

const Layout = ({children}: {children: ReactNode} ) => {
  return (
    <div className="w-screen h-screen flex bg-theme-dark-blue">
      <Sidebar/>
      <main className="bg-green-50 flex-1 p-6 rounded-tl-4xl overflow-y-scroll">{children}</main>
    </div>

  )
}
export default Layout
