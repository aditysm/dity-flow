import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

old_msg = 'setErrorMsg("Terjadi kegagalan komunikasi dengan basis data rute. Silakan coba sesaat lagi.");'
new_msg = 'setErrorMsg(`Terjadi kegagalan komunikasi dengan basis data rute. ${error?.message || "Silakan coba sesaat lagi."}`);'

content = content.replace(old_msg, new_msg)

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

