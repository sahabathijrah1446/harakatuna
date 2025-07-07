import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const features = [
  {
    category: "Input & OCR",
    items: [
      { name: "Input teks manual unlimited", free: true, pro: true },
      { name: "OCR gambar teks Arab", free: false, pro: true },
      { name: "Batch processing multiple images", free: false, pro: true },
    ]
  },
  {
    category: "Penyimpanan & Histori", 
    items: [
      { name: "Riwayat lokal (tersimpan di perangkat)", free: true, pro: true },
      { name: "Histori cloud unlimited", free: false, pro: true },
      { name: "Sinkronisasi multi-perangkat", free: false, pro: true },
      { name: "Export hasil ke PDF", free: false, pro: true },
    ]
  },
  {
    category: "AI & Analisis",
    items: [
      { name: "Harakat otomatis basic", free: true, pro: true },
      { name: "Harakat dengan akurasi premium", free: false, pro: true },
      { name: "Analisis Nahwu & Sharaf lengkap", free: false, pro: true },
      { name: "Penjelasan kontekstual mendalam", free: false, pro: true },
    ]
  },
  {
    category: "Dukungan & Fitur",
    items: [
      { name: "Dukungan email standar", free: true, pro: true },
      { name: "Dukungan prioritas 24/7", free: false, pro: true },
      { name: "Akses fitur beta terbaru", free: false, pro: true },
      { name: "Konsultasi pembelajaran Arab", free: false, pro: true },
    ]
  }
];

const testimonials = [
  {
    name: "Ustadz Ahmad Hidayat",
    role: "Pengajar Bahasa Arab",
    content: "Harakatuna Pro sangat membantu dalam menyiapkan materi pembelajaran. Fitur OCR-nya luar biasa akurat!",
    avatar: "👨‍🏫"
  },
  {
    name: "Siti Aminah",
    role: "Mahasiswa Sastra Arab",
    content: "Penjelasan Nahwu & Sharaf yang lengkap membantu saya memahami struktur kalimat Arab dengan mudah.",
    avatar: "👩‍🎓"
  },
  {
    name: "Muhammad Farid",
    role: "Santri Pondok Pesantren",
    content: "Histori cloud memungkinkan saya belajar di mana saja. Sangat praktis untuk kajian kitab kuning.",
    avatar: "📖"
  }
];

const ProPlan = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
                Upgrade ke <span className="text-yellow-200">Harakatuna Pro</span>
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Buka semua fitur premium untuk pengalaman belajar Arab yang tak terbatas
              </p>
              
              {/* Pricing */}
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-foreground">Rp 50.000</div>
                    <div className="text-primary-foreground/70">/bulan</div>
                  </div>
                  <div className="text-primary-foreground/50 text-2xl">atau</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-foreground">Rp 500.000</div>
                    <div className="text-primary-foreground/70">/tahun</div>
                    <Badge className="bg-yellow-200 text-yellow-800 mt-1">Hemat 2 bulan</Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    🚀 Mulai Langganan Bulanan
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    💎 Hemat dengan Tahunan
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-primary-foreground/80">
                ✨ Coba gratis 7 hari • Bisa dibatalkan kapan saja • Garansi uang kembali 30 hari
              </p>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Bandingkan Fitur <span className="text-primary">Free vs Pro</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Lihat semua yang Anda dapatkan dengan upgrade ke Pro
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {features.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-6 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-primary">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="grid grid-cols-5 gap-4 items-center py-2">
                          <div className="col-span-3 text-sm text-foreground">{item.name}</div>
                          <div className="text-center">
                            {item.free ? (
                              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mx-auto">
                              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-soft">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Apa Kata <span className="text-primary">Pengguna Pro</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Bergabunglah dengan ribuan pembelajar Arab yang sudah merasakan manfaatnya
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                        {testimonial.avatar}
                      </div>
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                    </div>
                    <blockquote className="text-sm text-muted-foreground italic text-center">
                      "{testimonial.content}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Siap untuk Menguasai Bahasa Arab?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Bergabung dengan ribuan pembelajar Arab yang telah mempercayai Harakatuna Pro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                🚀 Mulai Sekarang
              </Button>
              <Button variant="outline" size="lg" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/dashboard">
                  ← Kembali ke Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProPlan;