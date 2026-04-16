import  {NextRequest} from "next/server"
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params  

  return Response.json({ ok: true })
}