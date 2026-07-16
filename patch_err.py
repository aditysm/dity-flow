import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

# Add auto-dismiss effect for errorMsg
start_effect = """  // Form amount masking logic"""
new_effect = """  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Form amount masking logic"""
content = content.replace(start_effect, new_effect)

# Fix errorMsg display (top-6 -> top-24, add close button)
old_err_jsx = """      {errorMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-300 animate-bounce">
          <div className="bg-theme-card border border-rose-500/50 text-rose-200 p-4 rounded-2xl shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-400">Notifikasi</h4>
              <p className="text-xs mt-1 text-rose-200/70 leading-relaxed font-medium">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}"""

new_err_jsx = """      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-300 animate-fade-in">
          <div className="bg-theme-card border border-rose-500/50 text-rose-200 p-4 rounded-2xl shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-400">Notifikasi</h4>
              <p className="text-xs mt-1 text-rose-200/70 leading-relaxed font-medium">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg("")} className="text-rose-400 hover:text-rose-300 transition-colors p-1 bg-rose-500/10 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}"""
content = content.replace(old_err_jsx, new_err_jsx)

# Add logging to try-catch
old_catch = """    } catch (error) {
      // Try to load from localStorage cache"""

new_catch = """    } catch (error: any) {
      console.error("Fetch API error:", error, error.message);
      // Try to load from localStorage cache"""

if old_catch in content:
    content = content.replace(old_catch, new_catch)
else:
    # Let's try regex or just find it
    pass

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

print("Success patch_err")
