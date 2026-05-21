import re

with open("shared/js/api.js", "r") as f:
    content = f.read()

# Add handleNetworkError to WeDriveAPI
handler = """    handleNetworkError: function(err) {
        console.error('[WeDriveAPI] Network/DB Error:', err);
        if (!navigator.onLine || (err && (err.message === 'Failed to fetch' || String(err).includes('fetch') || String(err).includes('network')))) {
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
content = content.replace("window.WeDriveAPI = {\n", "window.WeDriveAPI = {\n\n" + handler)

# Remove _loadDummyData definitions
content = re.sub(r'async function _loadDummyData\(\) \{.*?\n\}\n', '', content, flags=re.DOTALL)

# Replace all occurrences of:
# if (!window.AppConfig.USE_REAL_DB) { ... } else {
# With just the content of else block.
# Actually, it's safer to just replace `_loadDummyData()` calls inside catch blocks with `window.WeDriveAPI.handleNetworkError(err);`
# Because `_loadDummyData` is only used inside dummy mode checks or catch blocks.

# Replace catch (err) { ... var data = await _loadDummyData(); ... return data... }
# Since the format varies slightly, I'll just regex replace any line containing `_loadDummyData`
# Wait, if I just replace `.*_loadDummyData.*` with `window.WeDriveAPI.handleNetworkError(err);` ?
content = re.sub(r'\s*const data = await _loadDummyData\(\);\n\s*return data\.[^;]+;', '', content)
content = re.sub(r'\s*var data = await _loadDummyData\(\);\n\s*return data\.[^;]+;', '', content)
content = re.sub(r'\s*return await _loadDummyData\(\);', '', content)
content = re.sub(r'\s*var data = await _loadDummyData\(\);', '', content)

with open("shared/js/api.js", "w") as f:
    f.write(content)
