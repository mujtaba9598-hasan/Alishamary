import os
import glob
import re

directory = r"C:\Users\Mujtaba Hasan\Downloads\Alisha_Mary_Fisheries"
html_files = glob.glob(os.path.join(directory, "*.html"))

new_footer_logo = '<img src="assets/logo.jpg" alt="Alisha Mary Fisheries Logo" style="height: 60px; width: auto; object-fit: contain; margin-bottom: 1rem;">'

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the text logo with the image
    new_content = re.sub(r'<h2 class="logo-footer">.*?</h2>', new_footer_logo, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Footer logo updated in all HTML files.")
