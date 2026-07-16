import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

m = re.search(r'function FlowContainer\(.*?\{.*?(return\s+\(\s+<div.*?);\s+\}\s+// Global Main Page Component', content, re.DOTALL)
if m:
    with open('flow_jsx.txt', 'w') as f2:
        f2.write(m.group(1))
    print("Found JSX")
else:
    print("Could not find FlowContainer JSX")
