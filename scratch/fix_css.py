import sys

with open(r'c:\antigravity\oryzo-clone\src\index.css', 'r') as f:
    content = f.read()

content = content.replace('0%%, 100%% { transform: translate(-50%%, -50%%); }', '0%, 100% { transform: translate(-50%, -50%); }')
content = content.replace('50%% { transform: translate(-50%%, -60%%); }', '50% { transform: translate(-50%, -60%); }')

with open(r'c:\antigravity\oryzo-clone\src\index.css', 'w') as f:
    f.write(content)
