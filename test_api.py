import requests
import base64
import json

# Create a small blank image
from PIL import Image
import io

img = Image.new('RGB', (224, 224), color = 'red')
buffer = io.BytesIO()
img.save(buffer, format="JPEG")
img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
data_uri = f"data:image/jpeg;base64,{img_str}"

try:
    print("Testing Next.js API...")
    res = requests.post("http://127.0.0.1:3000/api/analyze", json={"image": data_uri})
    print("Status:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print("Error:", e)
