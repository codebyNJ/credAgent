export async function GET() {
  return Response.json({
    message: "Chat API is working",
    timestamp: new Date().toISOString(),
    status: "ok"
  })
}

export async function POST(req: Request) {
  try {
    // Parse the request body directly as JSON
    let body: any = {}
    
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return Response.json(
        {
          error: true,
          response: "Invalid JSON in request body",
          session_id: "",
          intent: "error",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    // Validate that message field exists
    if (!body.message || typeof body.message !== 'string') {
      return Response.json(
        {
          error: true,
          response: "Missing or invalid 'message' field in request body",
          session_id: "",
          intent: "error",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    console.log("Sending request to upstream with body:", body)

    const upstream = await fetch("https://credagent-backend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const contentType = upstream.headers.get("content-type") || ""
    
    if (!upstream.ok) {
      const errText = await upstream.text()
      console.error("Upstream error:", upstream.status, errText)
      return new Response(
        JSON.stringify({
          error: true,
          status: upstream.status,
          response: errText || "Upstream error",
          session_id: "",
          intent: "error",
          timestamp: new Date().toISOString(),
        }),
        { status: upstream.status, headers: { "content-type": "application/json" } },
      )
    }

    if (contentType.includes("application/json")) {
      const data = await upstream.json()
      console.log("Upstream response:", data)
      return Response.json(data)
    } else {
      const text = await upstream.text()
      console.log("Upstream text response:", text)
      // Normalize non-JSON replies into the expected shape
      return Response.json({
        response: text,
        session_id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
        intent: "general",
        timestamp: new Date().toISOString(),
      })
    }
  } catch (e) {
    console.error("API route error:", e)
    return Response.json(
      {
        error: true,
        response: "Network error. Please try again.",
        session_id: "",
        intent: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
