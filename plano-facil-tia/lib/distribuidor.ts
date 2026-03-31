export interface AulaItem {
  aula: string
  data: string           // "DD/MM/AAAA"
  conteudo: string
  objetivo: string
  recursos: string[]
  metodologia: string
  video_url: string | null
  referencia_url: string | null
}

export interface MesReferencia {
  mes: number   // 1-12
  ano: number
}

const DATA_REGEX = /^\d{2}\/\d{2}\/\d{4}$/

/**
 * Valida se uma string está no formato DD/MM/AAAA e representa uma data real.
 */
export function validarFormatoData(data: string): boolean {
  if (!DATA_REGEX.test(data)) return false
  const [dia, mes, ano] = data.split("/").map(Number)
  const d = new Date(ano, mes - 1, dia)
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia
}

/**
 * Formata um objeto Date para a string "DD/MM/AAAA".
 */
export function formatarData(date: Date): string {
  const dia = String(date.getDate()).padStart(2, "0")
  const mes = String(date.getMonth() + 1).padStart(2, "0")
  const ano = date.getFullYear()
  return `${dia}/${mes}/${ano}`
}

/**
 * Retorna todos os dias úteis (segunda a sexta) do mês de referência,
 * ordenados cronologicamente.
 */
export function diasUteisDoMes(ref: MesReferencia): Date[] {
  const dias: Date[] = []
  const totalDias = new Date(ref.ano, ref.mes, 0).getDate()

  for (let d = 1; d <= totalDias; d++) {
    const date = new Date(ref.ano, ref.mes - 1, d)
    const diaSemana = date.getDay() // 0=dom, 1=seg, ..., 5=sex, 6=sab
    if (diaSemana >= 1 && diaSemana <= 5) {
      dias.push(date)
    }
  }

  return dias
}

/**
 * Distribui N aulas pelos dias úteis do mês de referência.
 * - Uma aula por dia útil, começando pela primeira segunda-feira do mês.
 * - Aulas extras (quando N não é divisível pelo número de semanas) vão para as primeiras semanas.
 * - Quando N excede os dias úteis disponíveis, aulas excedentes recebem `data: ""` e emitem console.warn.
 */
export function distribuirAulas(
  aulas: Omit<AulaItem, "data">[],
  ref: MesReferencia
): AulaItem[] {
  const diasUteis = diasUteisDoMes(ref)

  // Agrupar dias úteis por semana ISO (seg-dom)
  // Usamos o número da semana dentro do mês para agrupar
  const semanas: Date[][] = []
  let semanaAtual: Date[] = []

  for (const dia of diasUteis) {
    // Semana muda quando encontramos uma segunda-feira (início de nova semana)
    const diaSemana = dia.getDay() // 1=seg, 5=sex
    if (diaSemana === 1 && semanaAtual.length > 0) {
      semanas.push(semanaAtual)
      semanaAtual = []
    }
    semanaAtual.push(dia)
  }
  if (semanaAtual.length > 0) {
    semanas.push(semanaAtual)
  }

  const numSemanas = semanas.length
  const numAulas = aulas.length

  // Calcular quantas aulas por semana
  // Aulas extras vão para as primeiras semanas (diferença máxima de 1)
  const aulasPorSemana: number[] = []
  if (numSemanas > 0) {
    const base = Math.floor(numAulas / numSemanas)
    const extras = numAulas % numSemanas
    for (let i = 0; i < numSemanas; i++) {
      aulasPorSemana.push(base + (i < extras ? 1 : 0))
    }
  }

  // Coletar todos os dias úteis disponíveis em ordem (limitado ao total de dias úteis)
  const datasDisponiveis: string[] = diasUteis.map(formatarData)

  // Verificar excedentes antes de montar o resultado
  const totalDiasUteis = diasUteis.length
  if (numAulas > totalDiasUteis) {
    const excedentes = numAulas - totalDiasUteis
    console.warn(
      `[distribuirAulas] ${excedentes} aula(s) não foram alocadas por falta de dias úteis no mês ${ref.mes}/${ref.ano}.`
    )
  }

  // Montar datas distribuídas por semana (aulas extras nas primeiras semanas)
  const datasAtribuidas: string[] = []
  let diaIdx = 0

  for (let s = 0; s < semanas.length; s++) {
    const qtd = aulasPorSemana[s]
    for (let i = 0; i < qtd; i++) {
      if (diaIdx < datasDisponiveis.length) {
        datasAtribuidas.push(datasDisponiveis[diaIdx++])
      }
    }
  }

  // Preencher resultado
  const resultado: AulaItem[] = aulas.map((aula, idx) => {
    if (idx < datasAtribuidas.length) {
      return { ...aula, data: datasAtribuidas[idx] }
    }
    return { ...aula, data: "" }
  })

  return resultado
}
