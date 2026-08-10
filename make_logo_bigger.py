import os
import glob

directory = r"C:\Users\Mujtaba Hasan\Downloads\Alisha_Mary_Fisheries"
html_files = glob.glob(os.path.join(directory, "*.html"))

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('style="height: 60px;', 'style="height: 90px;')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Logo size increased to 90px in all HTML files.")
