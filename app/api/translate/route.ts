export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json()

    if (!text || !targetLang) {
      return Response.json({ error: "Missing text or targetLang" }, { status: 400 })
    }

    if (targetLang === 'en') {
        return Response.json({ translated: text })
    }

    const encodedText = encodeURIComponent(text)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Translation failed")
    }

    const data = await response.json()
    // data[0] contains the translations blocks (e.g. [[["Hola", "Hello", null, null, 1]], ...])
    let translated = ""
    if (data && data[0]) {
        data[0].forEach((item: any) => {
            if (item[0]) translated += item[0]
        })
    }

    return Response.json({ translated })
  } catch (error: any) {
    console.error("Translation API error:", error)
    return Response.json(
      { error: "Failed to translate text" },
      { status: 500 }
    )
  }
}
