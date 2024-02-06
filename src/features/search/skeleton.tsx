import { Skeleton } from '@/components/shadcn/skeleton'

const SearchSkeleton = () => {
  return (
    <div className={'flex flex-col'} aria-busy={'true'} aria-live={'polite'}>
      <div className={'*:h-[60px] *:w-full *:rounded-md *:mt-1'}>
        <Skeleton className={'bg-gray'} />
      </div>
      <div className={'*:h-[60px] *:w-full *:rounded-md *:mt-1 opacity-70'}>
        <Skeleton className={'bg-gray'} />
      </div>
      <div className={'*:h-[60px] *:w-full *:rounded-md *:mt-1 opacity-40'}>
        <Skeleton className={'bg-gray'} />
      </div>
      <div className={'*:h-[60px] *:w-full *:rounded-md *:mt-1 opacity-20'}>
        <Skeleton className={'bg-gray'} />
      </div>
      <div className={'*:h-[60px] *:w-full *:rounded-md *:mt-1 opacity-10'}>
        <Skeleton className={'bg-gray'} />
      </div>
    </div>
  )
}

export default SearchSkeleton
