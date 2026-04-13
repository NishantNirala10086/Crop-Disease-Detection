// We map generic plant keywords or known PlantVillage classes to rich responses
const DISEASE_DATABASE = [
  {
    keywords: ["pepper", "bell", "spot", "bacterial"],
    disease: "Pepper Bell Bacterial Spot",
    treatment: "Apply copper-based bactericide (Kocide 3000). Remove infected leaves immediately. Use streptomycin sprays in early stages.",
    watering: "Avoid overhead watering. Use drip irrigation to keep foliage dry. Water at the base of plants early in the morning.",
    prevention: "Use disease-resistant varieties. Practice crop rotation every 2-3 years. Sanitize garden tools between plants.",
  },
  {
    keywords: ["tomato", "blight", "late"],
    disease: "Tomato Late Blight",
    treatment: "Apply chlorothalonil or mancozeb fungicide immediately. Remove and destroy all infected plant parts. Consider copper sprays for organic treatment.",
    watering: "Reduce watering frequency. Ensure good drainage. Avoid wetting leaves. Water deeply but less often at soil level.",
    prevention: "Plant resistant varieties (e.g., Mountain Magic). Ensure good air circulation with proper spacing. Avoid planting near potatoes.",
  },
  {
    keywords: ["potato", "blight", "early"],
    disease: "Potato Early Blight",
    treatment: "Apply mancozeb or chlorothalonil fungicide. Remove lower infected leaves. Maintain proper plant nutrition with balanced fertilizer.",
    watering: "Water at the base of plants. Use mulch to prevent soil splash onto leaves. Maintain consistent moisture without overwatering.",
    prevention: "Rotate crops on a 3-year cycle. Remove plant debris after harvest. Use certified disease-free seed potatoes. Space plants for good air flow.",
  },
  {
    keywords: ["apple", "scab"],
    disease: "Apple Scab",
    treatment: "Apply captan or myclobutanil fungicide. Prune affected branches. Apply sulfur-based sprays during early infection stages.",
    watering: "Avoid overhead irrigation. Water at the root zone. Ensure proper drainage around trees.",
    prevention: "Plant scab-resistant cultivars (e.g., Liberty, Enterprise). Rake and destroy fallen leaves in autumn. Prune to improve air circulation.",
  },
  {
    keywords: ["corn", "rust", "maize"],
    disease: "Corn Common Rust",
    treatment: "Apply triazole fungicide (propiconazole). Consider foliar fungicide application if infection is severe. Monitor and reapply as needed.",
    watering: "Maintain regular irrigation schedule. Avoid water stress which increases susceptibility. Use furrow irrigation over sprinklers.",
    prevention: "Plant rust-resistant hybrids. Avoid late planting. Scout fields regularly after tasseling. Remove volunteer corn plants.",
  },
  {
    keywords: ["grape", "leaf", "blight"],
    disease: "Grape Leaf Blight (Isariopsis)",
    treatment: "Apply mancozeb or captan fungicide. Remove heavily infected leaves. Use Bordeaux mixture for organic treatment.",
    watering: "Implement drip irrigation. Avoid overhead watering especially in humid conditions. Water early morning only.",
    prevention: "Train vines for good air circulation. Remove leaf litter from vineyard floor. Use disease-free planting material.",
  },
  {
    keywords: ["tomato", "mold", "leaf"],
    disease: "Tomato Leaf Mold",
    treatment: "Apply chlorothalonil fungicide. Increase ventilation in greenhouses. Remove infected lower leaves to slow spread.",
    watering: "Reduce humidity by improving airflow. Water at plant base only. Avoid evening watering that increases overnight humidity.",
    prevention: "Use resistant varieties (e.g., Geronimo, Bella Rosa). Space plants adequately. Maintain greenhouse humidity below 85%. Sterilize greenhouse between seasons.",
  },
  {
    keywords: ["strawberry", "scorch", "leaf"],
    disease: "Strawberry Leaf Scorch",
    treatment: "Apply myclobutanil fungicide. Remove severely affected leaves. Ensure balanced potassium fertilization to strengthen plants.",
    watering: "Use drip irrigation. Avoid splashing water on foliage. Maintain consistent soil moisture without waterlogging.",
    prevention: "Plant disease-free transplants. Rotate strawberry beds every 3-4 years. Remove old leaves after harvest. Maintain proper plant spacing.",
  },
  {
    keywords: ["rice", "blast"],
    disease: "Rice Blast",
    treatment: "Apply tricyclazole or isoprothiolane. Drain fields periodically. Use silicon-based fertilizers to strengthen cell walls.",
    watering: "Maintain shallow flooding (2-3 cm). Alternate wetting and drying method. Avoid prolonged deep flooding during infection.",
    prevention: "Use blast-resistant varieties. Avoid excessive nitrogen fertilization. Space plants properly. Burn or remove crop residue after harvest.",
  },
  {
    keywords: ["citrus", "canker"],
    disease: "Citrus Canker",
    treatment: "Apply copper hydroxide sprays. Prune infected branches at least 15cm below symptoms. Disinfect tools between cuts.",
    watering: "Use drip irrigation exclusively. Avoid any overhead watering. Protect from wind-driven rain during rainy season.",
    prevention: "Use disease-free nursery stock. Implement windbreaks. Quarantine new plants for 2 weeks. Apply preventive copper sprays monthly.",
  },
]

const HEALTHY_RESULT = {
  disease: "Healthy Plant",
  treatment: "No treatment needed. Continue regular plant care routine.",
  watering: "Maintain consistent watering schedule. Water deeply 2-3 times per week depending on climate and soil type.",
  prevention: "Continue monitoring for early signs of disease. Practice crop rotation and maintain proper spacing between plants.",
  isHealthy: true,
}

const FALLBACK_DISEASE_RESULT = (label: string) => ({
  disease: label.replace(/[_]/g, ' ').replace('   ', ' - ').trim(),
  treatment: "Consult specialized agricultural extension services for targeted fungicide/pesticide recommendations.",
  watering: "Ensure proper drainage and avoid overhead watering to minimize leaf wetness.",
  prevention: "Practice crop rotation, remove infected plant debris, and ensure adequate plant spacing for airflow.",
  isHealthy: false,
})

export async function POST(req: Request) {
  try {
    let file: Blob | null = null;
    
    // First try parsing as formData (the new approach)
    try {
      const formDataReq = await req.formData();
      file = formDataReq.get("file") as Blob | null;
    } catch (e) {
      // Fallback for json if somehow the old client is still cached
      try {
        const { image } = await req.json();
        if (image) {
          const rawData = image.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(rawData, "base64");
          file = new Blob([buffer], { type: "image/jpeg" });
        }
      } catch (err) {}
    }

    if (!file) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    // Construct Form Data to send to our Custom FastApi Backend
    const formData = new FormData()
    formData.append("file", file, "crop_upload.jpg")

    // Contact LOCAL PYTHON AI ENGINE
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Local AI Server Error: ${errorText || "Could not reach python script."}`);
    }

    const result = await response.json()
    
    if (result.error) {
      throw new Error(result.error);
    }

    // Example exact class output from model: 'Tomato___healthy'
    const rawLabel = result.label.toLowerCase()
    let confidence = parseFloat((result.confidence * 100).toFixed(1))

    // Handle healthy plants
    if (rawLabel.includes("healthy") || rawLabel.includes("background")) {
      return Response.json({
        ...HEALTHY_RESULT,
        confidence,
      })
    }

    // Try to match the Local Python model prediction with our rich database
    let matchedDisease = null
    for (const dbDisease of DISEASE_DATABASE) {
      const isMatch = dbDisease.keywords.every(kw => rawLabel.includes(kw))
      if (isMatch) {
        matchedDisease = dbDisease
        break
      }
    }

    if (matchedDisease) {
      return Response.json({
        disease: matchedDisease.disease,
        confidence,
        treatment: matchedDisease.treatment,
        watering: matchedDisease.watering,
        prevention: matchedDisease.prevention,
        isHealthy: false,
      })
    }

    // Fallback if not specifically mapped
    const fallbackData = FALLBACK_DISEASE_RESULT(result.label)
    
    return Response.json({
      ...fallbackData,
      confidence,
    })

  } catch (error: any) {
    console.error("[v0] Analysis error:", error)
    
    // If it's a fetch error due to python server not running
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return Response.json(
        { error: "AI Backend is offline! Did you remember to run 'uvicorn app:app' in the backend folder?" },
        { status: 503 }
      )
    }

    return Response.json(
      { error: error?.message || String(error) || "Failed to analyze image with the AI model." },
      { status: 500 }
    )
  }
}
