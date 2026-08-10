import os
import glob

directory = r"C:\Users\Mujtaba Hasan\Downloads\Alisha_Mary_Fisheries"
html_files = glob.glob(os.path.join(directory, "*.html"))

footer_addition = """        </div>
        <div class="container text-center" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--clr-accent);">
            <p style="font-size: 0.9rem; color: var(--clr-text-light);">
                Developed by <a href="https://wa.me/971527529598" target="_blank" style="color: var(--clr-primary); text-decoration: underline;">Quartermasters F.Z.C</a>
            </p>
        </div>
    </footer>"""

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add Home to Nav
    if '<a href="index.html">Home</a>' not in content:
        content = content.replace('<a href="shop.html">Shop Gear</a>', '<a href="index.html">Home</a>\n                <a href="shop.html">Shop Gear</a>')
        
    # 2. Add Developer Credit to Footer
    if 'Quartermasters F.Z.C' not in content:
        content = content.replace('        </div>\n    </footer>', footer_addition)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Nav and Footer updated in all HTML files.")
