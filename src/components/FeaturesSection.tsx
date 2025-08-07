import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Harakat Otomatis",
    description: "AI memberikan harakat (tanda baca) pada teks Arab secara otomatis dengan akurasi tinggi.",
    icon: "📖",
    gradient: "from-primary to-primary-glow"
  },
  {
    title: "Transliterasi Latin",
    description: "Konversi teks Arab ke huruf Latin memudahkan pembelajaran dan pengucapan yang benar.",
    icon: "🔤", 
    gradient: "from-primary-glow to-primary-soft"
  },
  {
    title: "Terjemahan Indonesia",
    description: "Dapatkan terjemahan bahasa Indonesia yang akurat dan kontekstual untuk setiap teks.",
    icon: "🌏",
    gradient: "from-primary to-success"
  },
  {
    title: "Penjelasan Nahwu & Sharaf",
    description: "Pelajari struktur grammatical dan morfologi Arab untuk pemahaman yang mendalam.",
    icon: "📚",
    gradient: "from-success to-primary-glow"
  },
  {
    title: "OCR Gambar (Pro)",
    description: "Upload foto teks Arab dan dapatkan hasil ekstraksi otomatis dengan teknologi OCR canggih.",
    icon: "📷",
    gradient: "from-primary-glow to-primary"
  },
  {
    title: "Histori Cloud (Pro)",
    description: "Simpan dan akses riwayat translasi dari berbagai perangkat dengan sinkronisasi cloud.",
    icon: "☁️",
    gradient: "from-primary-soft to-primary"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Fitur Lengkap untuk 
            <span className="text-primary"> Belajar Arab</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Teknologi AI terdepan dikombinasikan dengan pemahaman mendalam tentang bahasa Arab 
            untuk memberikan pengalaman belajar yang tak tertandingi.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-border hover:border-primary/30 shadow-soft hover:shadow-medium transition-smooth transform hover:-translate-y-1 w-full max-w-sm"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-soft flex items-center justify-center text-2xl mb-4 group-hover:shadow-glow transition-smooth mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-primary-soft px-6 py-3 rounded-full">
            <span>🚀</span>
            <span>Semua fitur dasar <strong>gratis selamanya</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;