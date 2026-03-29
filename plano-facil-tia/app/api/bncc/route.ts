import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const AREAS_VALIDAS = ["MA", "LP", "HI", "GE", "CI"]

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const serieStr = searchParams.get("serie")
  const area     = searchParams.get("area")

  const serie = parseInt(serieStr ?? "")
  if (!serieStr || isNaN(serie) || serie < 1 || serie > 5) {
    return Response.json(
      { erro: "Parâmetro 'serie' inválido. Use um inteiro de 1 a 5." },
      { status: 400 }
    )
  }

  if (!area || !AREAS_VALIDAS.includes(area)) {
    return Response.json(
      { erro: "Parâmetro 'area' inválido. Use: MA, LP, HI, GE ou CI." },
      { status: 400 }
    )
  }

  try {
    const habilidades = await prisma.bnccHabilidade.findMany({
      where: { serie, area },
      orderBy: { codigo: "asc" },
    })
    return Response.json(habilidades)
  } catch (err) {
    console.error("[api/bncc] Erro:", err)
    return Response.json({ erro: "Erro interno" }, { status: 500 })
  }
}
