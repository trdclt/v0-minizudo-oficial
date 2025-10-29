import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, timestamp, sessionId } = body

    // Get webhook URL from environment variable
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL não configurada" }, { status: 500 })
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        timestamp,
        sessionId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    let responseMessage = "Mensagem recebida!"

    if (contentType?.includes("application/json")) {
      // Parse as JSON
      const data = await response.json()
      responseMessage = data.response || data.message || data.output || data.text || "Mensagem recebida!"
    } else {
      // Parse as plain text
      const textResponse = await response.text()
      responseMessage = textResponse || "Mensagem recebida!"
    }

    return NextResponse.json({
      response: responseMessage,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error in chat API route:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar mensagem",
        response: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        success: false,
      },
      { status: 500 },
    )
  }
}
