
import { twMerge } from "tailwind-merge"

type ListContainerProps = {
  title: string
  onViewAll?: () => void
  viewAllLabel?: string
  className?: string
  children: React.ReactNode
}

const ListContainer = ({
  title,
  onViewAll,
  className,
  children,
  viewAllLabel = "View all",
}: ListContainerProps) => {
  return (
    <section className={twMerge("flex flex-col bg-theme-card-white shadow-sm rounded-2xl p-5",
      className
    )}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-theme-blue">{title}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-medium text-theme-blue hover:underline hover:cursor-pointer"
        >
          {viewAllLabel}
        </button>
      </div>
      {children}
    </section>
  )
}

export default ListContainer
