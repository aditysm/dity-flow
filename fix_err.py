import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'setErrorMsg(`Terjadi kegagalan komunikasi dengan basis data rute. ${error?.message || "Silakan coba sesaat lagi."}`);',
    'setErrorMsg(`Terjadi kegagalan komunikasi dengan basis data rute. ${err?.message || "Silakan coba sesaat lagi."}`);'
)

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

