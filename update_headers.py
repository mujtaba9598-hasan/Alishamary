import os
import glob
import re

header_content = """    <header class="main-header">
        <div class="nav-container container">
            <a href="index.html" class="logo">
                <img src="assets/logo.jpg" alt="Alisha Mary Fisheries Logo" style="height: 60px; width: auto; object-fit: contain;">
            </a>
            <nav class="nav-links">
                <a href="shop.html">Shop Gear</a>
                <a href="gallery.html">Gallery</a>
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
                <a href="book.html" class="btn btn-primary btn-sm">Book Consultation</a>
            </nav>
        </div>
    </header>"""

directory = r"C:\Users\Mujtaba Hasan\Downloads\Alisha_Mary_Fisheries"
html_files = glob.glob(os.path.join(directory, "*.html"))

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'    <header class="main-header">.*?</header>', header_content, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Headers updated successfully.")
