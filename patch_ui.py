import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

# Replace empty state check
content = content.replace('{routeData.length === 0 && (', '{displayedRoutes.length === 0 && (')
content = content.replace('{routeData.length > 0 && (', '{displayedRoutes.length > 0 && (')

# Find the start of the map
start_str = """{displayedRoutes.length > 0 && (
              <div className="flex flex-col gap-6 w-full animate-fade-in">"""

end_str = """                  />
                </ReactFlowProvider>
              </div>"""

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    block = content[start_idx:end_idx]
    
    # We want to keep the Theme control bar OUTSIDE the map, or inside?
    # Let's put Theme control bar outside the map, at the top.
    
    # Actually, let's replace the whole block manually in the script.
    
    pass

