"use client"

import { useRef, useState } from "react"
import { useWizardStore } from "@/store/wizardStore"

const MAX_MB = 20
const MAX_BYTES = MAX_MB * 1024 * 1024

export default function PassoUpload() {
  const { pdfFile, setPdf, avancar, voltar } = useWizardStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [erro, setErro] = useState<string | null>(null)

  function handleFile(file: File | null) {
    if (!file) return
    setErro(null)

    if (file.type !== "application/pdf") {
      setErro("Apenas arquivos PDF são aceitos.")
      return
    }
    if (file.size > MAX_BYTES) {
      setErro(`Arquivo muito grande, tia. Use um PDF de até ${MAX_MB}MB.`)
      return
    }

    setPdf(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0] ?? null)
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">
        Envie o PDF do livro didático
      </h2>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer transition mb-4"
        style={{
          border: `2px dashed ${pdfFile ? "#ff8c00" : "#f0ddd0"}`,
          backgroundColor: pdfFile ? "#fff1ea" : "#fff8f5",
          minHeight: 160,
          padding: "2rem",
        }}
      >
        {pdfFile ? (
          <>
            <span className="text-4xl">✅</span>
            <p className="text-[15px] font-600 text-[#2f1402] text-center break-all">
              {pdfFile.name}
            </p>
            <p className="text-[13px] text-[#7c4a2d]">
              {(pdfFile.size / 1024 / 1024).toFixed(1)} MB — clique para trocar
            </p>
          </>
        ) : (
          <>
            <span className="text-4xl">📄</span>
            <p className="text-[15px] font-500 text-[#564334] text-center">
              Clique para escolher ou arraste o PDF aqui
            </p>
            <p className="text-[13px] text-[#a87b5e]">Máximo {MAX_MB}MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {erro && (
        <p className="text-sm text-[#ba1a1a] mb-4">{erro}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] text-[#7c4a2d] font-medium"
          style={{ backgroundColor: "#fff1ea" }}
        >
          Voltar
        </button>
        <button
          disabled={!pdfFile}
          onClick={avancar}
          className="flex-1 h-14 rounded-[14px] text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
