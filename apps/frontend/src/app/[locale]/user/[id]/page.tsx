export default async function UserPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  console.log('userId: ' + params.id)
  return (
    <>
      <div>{params.id}</div>
    </>
  )
}
