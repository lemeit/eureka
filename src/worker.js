export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { question, system, max_tokens } = await request.json();

      const systemPrompt = system ||
        "Sos STAY, un tutor experto en Física y Química. Respondé paso a paso y en español.";

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: max_tokens || 1024,   // dinámico por materia
          temperature: 0.4,
          stream: true,
          stream_options: { include_usage: true },
          stream_options: { include_usage: true }, // devuelve usage en el stream
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user",   content: question }
          ]
        })
      });

      if (!groqRes.ok) {
        const err = await groqRes.json();
        return new Response(JSON.stringify(err), {
          status: groqRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(groqRes.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: { message: error.message } }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};