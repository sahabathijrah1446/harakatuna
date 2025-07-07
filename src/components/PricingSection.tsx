import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "Gratis",
    period: "Selamanya",
    description: "Perfect untuk memulai belajar Arab",
    features: [
      "Input teks manual tanpa batas",
      "Harakat otomatis dengan AI",
      "Transliterasi Latin",
      "Terjemahan bahasa Indonesia",
      "Penjelasan Nahwu & Sharaf dasar",
      "Riwayat lokal (tersimpan di perangkat)"
    ],
    notIncluded: [
      "OCR gambar",
      "Histori cloud",
      "Dukungan prioritas"
    ],
    popular: false,
    cta: "Mulai Gratis",
    ctaLink: "/dashboard"
  },
  {
    name: "Pro",
    price: "Rp 50.000",
    period: "/bulan",
    description: "Untuk pembelajaran yang lebih serius",
    features: [
      "Semua fitur Free",
      "OCR gambar teks Arab",
      "Histori cloud unlimited",
      "Sinkronisasi multi-perangkat",
      "Penjelasan Nahwu & Sharaf lengkap",
      "Dukungan prioritas 24/7",
      "Export hasil ke PDF",
      "Akses beta fitur terbaru"
    ],
    notIncluded: [],
    popular: true,
    cta: "Upgrade ke Pro",
    ctaLink: "/pro"
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pilih Paket yang 
            <span className="text-primary"> Tepat untuk Anda</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mulai gratis dan upgrade kapan saja. Tidak ada kontrak, bisa dibatalkan kapan saja.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative border-2 shadow-medium hover:shadow-strong transition-smooth transform hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-glow' 
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-soft">
                    ⭐ Paling Populer
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div key={`not-${featureIndex}`} className="flex items-start space-x-3 opacity-50">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground line-through">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Button 
                  variant={plan.popular ? "hero" : "islamic"} 
                  size="lg" 
                  className="w-full" 
                  asChild
                >
                  <Link to={plan.ctaLink}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            💳 Pembayaran aman dengan berbagai metode • 🔒 Data Anda terlindungi • 🎯 Garansi uang kembali 30 hari
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;