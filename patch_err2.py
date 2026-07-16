import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

old_err = """      if (!response.ok) {
        throw new Error("Gagal mengambil data rute dari server.");
      }"""

new_err = """      if (!response.ok) {
        const errText = await response.text();
        console.error("Supabase error response:", response.status, errText);
        throw new Error(`Gagal (Status: ${response.status}). ${errText}`);
      }"""

content = content.replace(old_err, new_err)

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

print("patched response error")
