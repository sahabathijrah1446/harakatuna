import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold">Harakatuna</span>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              Membantu umat Islam dan pembelajar bahasa Arab untuk memahami teks Arab 
              dengan lebih mudah melalui teknologi AI terdepan.
            </p>
            <p className="text-sm text-background/60">
              Dibuat dengan ❤️ oleh Daril & Cha Cha
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-background/80 hover:text-background transition-smooth">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-background/80 hover:text-background transition-smooth">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pro" className="text-background/80 hover:text-background transition-smooth">
                  Upgrade Pro
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-background/80 hover:text-background transition-smooth">
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="text-background/80 hover:text-background transition-smooth">
                  Kontak Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-background/80 hover:text-background transition-smooth">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-background/80 hover:text-background transition-smooth">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-sm text-background/60">
            © 2025 Harakatuna. Semua hak dilindungi. 
            <span className="mx-2">•</span>
            Barakallahu fiikum
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;