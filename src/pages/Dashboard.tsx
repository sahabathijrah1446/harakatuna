import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

// Mock translation result for demo
const mockResult = {
  harakat: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  transliteration: "Bismillahi ar-rahmani ar-raheem",
  translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
  explanation: "Kalimat Basmalah terdiri dari: بِسْمِ (bi ismi) - dengan nama, اللَّهِ (Allah) - nama Allah, الرَّحْمَن (ar-rahman) - Yang Maha Pengasih, الرَّحِيم (ar-raheem) - Yang Maha Penyayang. Struktur nahwu: بِسْمِ adalah jar majrur dengan huruf jar ب, اللَّه adalah mudhaf ilaih majrur."
};

const Dashboard = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProUser] = useState(false); // Mock user status

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult(mockResult);
    setIsProcessing(false);
  };

  const handleOCRUpload = () => {
    // Mock OCR functionality for demo
    alert("Fitur OCR hanya tersedia untuk pengguna Pro. Upgrade sekarang!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Dashboard</span> Harakatuna
          </h1>
          <p className="text-lg text-muted-foreground">
            Masukkan teks Arab dan dapatkan harakat, transliterasi, terjemahan, serta penjelasan grammatical
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📝</span>
                  <span>Input Teks Arab</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Masukkan teks Arab di sini... مثال: بسم الله الرحمن الرحيم"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] text-right text-lg font-arabic resize-none focus:ring-primary"
                  dir="rtl"
                />
                <Button 
                  onClick={handleProcess}
                  disabled={!inputText.trim() || isProcessing}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {isProcessing ? "Sedang Memproses..." : "🔍 Proses Teks"}
                </Button>
              </CardContent>
            </Card>

            {/* OCR Input */}
            <Card className="shadow-soft border-dashed border-2 border-muted">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-soft">
                    <span className="text-2xl">📷</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Upload Gambar Teks Arab</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ekstrak teks Arab dari gambar dengan teknologi OCR
                    </p>
                  </div>
                  {!isProUser && (
                    <Badge variant="outline" className="bg-primary-soft text-primary border-primary/30">
                      Fitur Pro
                    </Badge>
                  )}
                  <Button 
                    onClick={handleOCRUpload}
                    variant={isProUser ? "islamic" : "outline"}
                    disabled={!isProUser}
                  >
                    {isProUser ? "📷 Upload Gambar" : "🔒 Upgrade ke Pro"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-center">Status Akun</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-soft rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">{isProUser ? "👑" : "🆓"}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{isProUser ? "Pro User" : "Free User"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isProUser 
                      ? "Akses semua fitur premium" 
                      : "Input manual & fitur dasar"
                    }
                  </p>
                </div>
                {!isProUser && (
                  <Button variant="premium" size="sm" asChild>
                    <Link to="/pro">Upgrade ke Pro</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Guide */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm">Panduan Cepat</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-primary">1.</span>
                  <span>Masukkan atau tempel teks Arab</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary">2.</span>
                  <span>Klik tombol "Proses Teks"</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary">3.</span>
                  <span>Dapatkan hasil lengkap dengan penjelasan</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              ✨ Hasil Analisis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Harakat */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📖</span>
                    <span>Teks dengan Harakat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-right font-arabic leading-relaxed p-4 bg-primary-soft rounded-lg">
                    {result.harakat}
                  </div>
                </CardContent>
              </Card>

              {/* Transliteration */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🔤</span>
                    <span>Transliterasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg italic p-4 bg-secondary rounded-lg">
                    {result.transliteration}
                  </div>
                </CardContent>
              </Card>

              {/* Translation */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🌏</span>
                    <span>Terjemahan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg p-4 bg-accent rounded-lg">
                    {result.translation}
                  </div>
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📚</span>
                    <span>Penjelasan Nahwu & Sharaf</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm leading-relaxed p-4 bg-muted rounded-lg">
                    {result.explanation}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;