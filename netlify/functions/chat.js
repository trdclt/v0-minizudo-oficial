// Netlify Function para o chat
// Converte a API route do Next.js para Netlify Function

exports.handler = async (event, context) => {
  console.log("[v0] Netlify Function chat.js invoked")
  console.log("[v0] Event method:", event.httpMethod)
  console.log("[v0] Event path:", event.path)

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    console.log("[v0] Method not allowed:", event.httpMethod)
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body)
    const { message, timestamp, sessionId } = body

    console.log("[v0] Received message:", message)
    console.log("[v0] Session ID:", sessionId)
    console.log("[v0] Timestamp:", timestamp)

    // Get webhook URL from environment variable
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error("[v0] Webhook URL not configured")
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Webhook URL não configurada" }),
      }
    }

    console.log("[v0] Sending to webhook:", webhookUrl)

    // Forward to n8n webhook
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

    console.log("[v0] Webhook response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Webhook returned error status:", response.status)
      throw new Error(`Webhook returned status ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    console.log("[v0] Webhook response content-type:", contentType)

    let responseMessage = "Mensagem recebida!"

    if (contentType?.includes("application/json")) {
      // Parse as JSON
      const data = await response.json()
      console.log("[v0] Webhook JSON response:", data)
      responseMessage = data.response || data.message || data.output || data.text || "Mensagem recebida!"
    } else {
      // Parse as plain text
      const textResponse = await response.text()
      console.log("[v0] Webhook text response:", textResponse)
      responseMessage = textResponse || "Mensagem recebida!"
    }

    console.log("[v0] Returning response:", responseMessage)

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: responseMessage,
        success: true,
      }),
    }
  } catch (error) {
    console.error("[v0] Error in chat function:", error)
    console.error("[v0] Error stack:", error.stack)

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Erro ao processar mensagem",
        response: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        success: false,
      }),
    }
  }
}
