import os
import glob
import subprocess

directory = r"C:\Users\Mujtaba Hasan\Downloads\Alisha_Mary_Fisheries"
html_files = glob.glob(os.path.join(directory, "*.html"))

floating_menu_html = """
    <!-- Floating Contact Menu -->
    <div class="floating-contact-menu">
        <a href="mailto:info@alishamaryfisheries.com" class="floating-btn email-btn" title="Email Us">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
        <a href="tel:+353000000000" class="floating-btn call-btn" title="Call Us">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
        <a href="https://wa.me/971527529598" class="floating-btn wa-btn" title="WhatsApp Us" target="_blank">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>
    </div>

</body>"""

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Inject before </body> if not already there
    if 'floating-contact-menu' not in content:
        content = content.replace('</body>', floating_menu_html)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

# Append CSS
css_path = os.path.join(directory, "styles.css")
with open(css_path, "a", encoding="utf-8") as f:
    f.write('''
/* Floating Contact Menu */
.floating-contact-menu {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 9999;
}

.floating-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--clr-primary);
    color: white;
    text-decoration: none;
    transition: transform 0.3s ease, background 0.3s ease;
    border-radius: 4px 0 0 4px;
    box-shadow: -2px 2px 10px rgba(0,0,0,0.1);
}

.floating-btn svg {
    width: 24px;
    height: 24px;
}

.floating-btn:hover {
    transform: translateX(-10px);
    background: var(--clr-accent);
    color: white;
}

.wa-btn {
    background: #25D366; /* WhatsApp Green */
}
.wa-btn:hover {
    background: #128C7E;
}
''')

print("Floating menu and CSS injected.")
