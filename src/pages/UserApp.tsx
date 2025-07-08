import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Mock translation result for demo
const mockResult = {
  harakat: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  transliteration: "Bismillahi ar-rahmani ar-raheem",
  translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
  explanation: "Kalimat Basmalah terdiri dari: بِسْمِ (bi ismi) - dengan nama, اللَّهِ (Allah) - nama Allah, الرَّحْمَن (ar-rahman) - Yang Maha Pengasih, الرَّحِيم (ar-raheem) - Yang Maha Penyayang."
};

const UserApp = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProUser] = useState(false); // Mock user status

  // Simple process function for demo
  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error("Mohon masukkan teks Arab terlebih dahulu");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setResult(mockResult);
      setIsProcessing(false);
      toast.success("Teks berhasil diproses!");
    }, 2000);
  };

  const handleOCRUpload = () => {
    alert("Fitur OCR hanya tersedia untuk pengguna Pro. Upgrade sekarang!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Harakatuna</span> - Analisis Teks Arab
          </h1>
          <p className="text-lg text-muted-foreground">
            Masukkan teks Arab dan dapatkan harakat, transliterasi, dan terjemahan
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <span>📝</span>
                <span>Masukkan Teks Arab</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="مثال: بسم الله الرحمن الرحيم"
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
                {isProcessing ? "Sedang Memproses..." : "🔍 Analisis Teks"}
              </Button>
            </CardContent>
          </Card>

          {/* OCR Option */}
          <Card className="shadow-soft border-dashed border-2 border-muted">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-soft">
                  <span className="text-2xl">📷</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Gambar Teks Arab</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ekstrak teks dari gambar dengan teknologi OCR
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

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground text-center">
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
                      <span>Penjelasan</span>
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

          {/* Upgrade Prompt for Free Users */}
          {!isProUser && (
            <Card className="shadow-soft border-primary/20 bg-gradient-to-r from-primary-soft to-primary-soft/50">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="text-2xl">👑</div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">Upgrade ke Pro</h3>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan fitur OCR, analisis lebih detail, dan akses unlimited
                    </p>
                  </div>
                  <Button variant="premium" asChild>
                    <Link to="/pro">Lihat Paket Pro</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserApp;