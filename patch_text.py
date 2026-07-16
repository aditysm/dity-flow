import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'PENTING: Biaya admin potong dari saldo masuk. Pastikan nominal transfer dilebihkan jika ingin jumlah pas!',
    'PENTING: Biaya admin Rp{new Intl.NumberFormat("id-ID").format(localFee)} dipotong dari saldo tujuan. Pastikan nominal transfer dilebihkan!'
)

content = content.replace(
    'Transfer via Flip wajib menggunakan 3 digit kode unik (misal: Rp50.123). Dana kode unik akan dikembalikan ke saldo Anda.',
    'Transfer wajib menggunakan 3 digit kode unik (misal: Rp50.123). Kode unik akan dikembalikan berupa koin.'
)

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

