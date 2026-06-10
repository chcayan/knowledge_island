import CommentSkeleton from './comment-skeleton'

export default function CommentListSkeleton() {
  return (
    <>
      <div className="">
        {Array.from({ length: 5 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    </>
  )
}
