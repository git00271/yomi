import os

def generate_catalog():
    assets_dir = 'assets'
    html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>요미카야 이미지 자산 카탈로그</title>
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; background: #121214; color: #e1e1e6; padding: 30px; margin: 0; }
        h1 { text-align: center; color: #a855f7; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .card { background: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); border-color: #a855f7; }
        img, gif { width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 10px; background: #27272a; }
        .filename { font-weight: bold; color: #f4f4f5; font-size: 14px; margin-bottom: 5px; }
        .size { color: #71717a; font-size: 12px; }
    </style>
</head>
<body>
    <h1>요미카야 이미지 자산 카탈로그</h1>
    <div class="grid">
"""

    if os.path.exists(assets_dir):
        files = sorted(os.listdir(assets_dir))
        for file in files:
            file_path = os.path.join(assets_dir, file)
            if os.path.isfile(file_path):
                size_kb = os.path.getsize(file_path) / 1024
                ext = file.split('.')[-1].upper()

                # mp3는 제외하거나 오디오 태그로 처리할 수 있으나 이미지 카탈로그이므로 제외
                if ext in ['MP3']:
                    continue

                html_content += f"""        <div class="card">
            <img src="assets/{file}" alt="{file}" loading="lazy"></img>
            <div class="filename">{file}</div>
            <div class="size">{size_kb:.1f} KB ({ext})</div>
        </div>
"""

    html_content += """    </div>
</body>
</html>"""

    with open('catalog.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

generate_catalog()
