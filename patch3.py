import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

# Fix the empty state text
content = content.replace(
    'Silakan isi formulir di samping untuk menemukan rute transfer terbaik.',
    'Silakan isi formulir <span className="md:hidden">di atas</span><span className="hidden md:inline">di samping</span> untuk menemukan rute transfer terbaik.'
)

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

