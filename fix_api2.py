import re

with open("shared/js/api.js", "r") as f:
    content = f.read()

handler = """    handleNetworkError: function(err) {
        console.error('[WeDriveAPI] Network/DB Error:', err);
        if (!navigator.onLine || (err && (err.message === 'Failed to fetch' || String(err).toLowerCase().includes('fetch') || String(err).toLowerCase().includes('network')))) {
            var scripts = document.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getAttribute('src');
                if (src && src.includes('shared/js/api.js')) {
                    var errorUrl = src.replace('shared/js/api.js', 'shared/pages/error/404.html');
                    window.location.href = errorUrl;
                    return;
                }
            }
            window.location.href = '/shared/pages/error/404.html';
        }
    },
"""
if "handleNetworkError:" not in content:
    content = content.replace("window.WeDriveAPI = {\n", "window.WeDriveAPI = {\n\n" + handler)

# 1. Replace array returns
content = re.sub(
    r'(?:var|const)\s+data\s*=\s*await\s+_loadDummyData\(\);\s*\n\s*return\s+data\.[a-zA-Z0-9_]+\s*\|\|\s*\[\];',
    r'window.WeDriveAPI.handleNetworkError(err);\n                return [];',
    content
)

# 2. Replace object returns
content = re.sub(
    r'(?:var|const)\s+data\s*=\s*await\s+_loadDummyData\(\);\s*\n\s*return\s+data\.[a-zA-Z0-9_]+\s*\|\|\s*\{\};',
    r'window.WeDriveAPI.handleNetworkError(err);\n                return {};',
    content
)

# 3. Replace direct returns
content = re.sub(
    r'return\s+await\s+_loadDummyData\(\);',
    r'window.WeDriveAPI.handleNetworkError(err);\n                return { success: false, error: err.message || "Network Error" };',
    content
)

# 4. Replace left over data fetches inside catch
content = re.sub(
    r'(?:var|const)\s+data\s*=\s*await\s+_loadDummyData\(\);',
    r'window.WeDriveAPI.handleNetworkError(err);',
    content
)

# Fix methods that don't use _loadDummyData but could also need network error intercept
# Instead of replacing everything, let's just use a second script or sed to inject handleNetworkError before any `console.error('[WeDriveAPI]` inside a catch block if missing.

with open("shared/js/api.js", "w") as f:
    f.write(content)
