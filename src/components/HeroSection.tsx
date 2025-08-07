import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-arabic-book.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-soft py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="text-primary">Harakatuna</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Membaca Arab
              </span>
              <br />
              Lebih Mudah & Bermakna
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-center">
              Teknologi AI terdepan membantu Anda membaca teks Arab dengan harakat otomatis, 
              transliterasi yang akurat, terjemahan bahasa Indonesia, dan penjelasan Nahwu & Sharaf.
            </p>
            
            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm justify-center lg:justify-start">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Harakat Otomatis</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Transliterasi Latin</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Terjemahan Indonesia</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Penjelasan Nahwu</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" asChild className="text-base">
                <Link to="/dashboard">
                  Mulai Gratis Sekarang
                </Link>
              </Button>
              <Button variant="premium" size="lg" asChild className="text-base">
                <Link to="/pro">
                  Upgrade ke Pro
                </Link>
              </Button>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              ✨ Gratis selamanya untuk input manual • Pro untuk fitur OCR & histori cloud
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Arabic Book with Islamic Calligraphy" 
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full shadow-glow opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-glow rounded-full shadow-medium opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;