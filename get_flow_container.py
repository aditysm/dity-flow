import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

m = re.search(r'function FlowContainer\(.*?\{.*?(?=\n\n|\Z)', content, re.DOTALL)
if m:
    pass
    # We will print the block containing FlowContainer logic up to the return statement.
