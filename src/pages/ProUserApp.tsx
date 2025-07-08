import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import OpenAI from "openai";

// Mock translation result for demo
const mockResult = {
  harakat: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  transliteration: "Bismillahi ar-rahmani ar-raheem",
  translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
  explanation: "Kalimat Basmalah terdiri dari: بِسْمِ (bi ismi) - dengan nama, اللَّهِ (Allah) - nama Allah, الرَّحْمَن (ar-rahman) - Yang Maha Pengasih, الرَّحِيم (ar-raheem) - Yang Maha Penyayang. Struktur nahwu: بِسْمِ adalah jar majrur dengan huruf jar ب, اللَّه adalah mudhaf ilaih majrur. Kalimat ini merupakan kalimat nominal (jumlah ismiyyah) yang diawali dengan jar majrur yang berfungsi sebagai khabar muqaddam."
};

const ProUserApp = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [monthlyUsage] = useState({ used: 847, limit: 10000 });
  const [apiKey, setApiKey] = useState("");

  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('sumopod_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Process Arabic text using SumoPod API (Pro version with full features)
  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error("Mohon masukkan teks Arab terlebih dahulu");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("API key tidak ditemukan. Hubungi admin.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Initialize OpenAI client with SumoPod configuration
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://ai.sumopod.com/v1',
        dangerouslyAllowBrowser: true
      });

      const prompt = `Analisis lengkap teks Arab berikut dan berikan:
1. Teks dengan harakat lengkap dan akurat
2. Transliterasi Latin yang presisi
3. Terjemahan dalam Bahasa Indonesia yang natural
4. Penjelasan grammatical lengkap (Nahwu & Sharaf) termasuk:
   - Analisis i'rab setiap kata
   - Struktur kalimat (jumlah ismiyyah/fi'liyyah)
   - Kaidah nahwu yang berlaku
   - Fungsi gramatikal setiap unsur

Teks Arab: ${inputText}

Format response dalam JSON dengan struktur:
{
  "harakat": "teks dengan harakat",
  "transliteration": "transliterasi latin", 
  "translation": "terjemahan indonesia",
  "explanation": "penjelasan nahwu sharaf lengkap"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Anda adalah ahli bahasa Arab tingkat tinggi yang memberikan analisis gramatikal lengkap dan mendalam untuk pengguna Pro.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.2
      });

      const content = response.choices[0].message.content;
      
      try {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResult = JSON.parse(jsonMatch[0]);
          setResult(parsedResult);
          toast.success("Analisis lengkap berhasil!");
        } else {
          setResult({
            harakat: inputText,
            transliteration: "Transliterasi tidak tersedia",
            translation: content || "Terjemahan tidak tersedia", 
            explanation: "Penjelasan grammatical tidak tersedia"
          });
          toast.success("Teks berhasil diproses!");
        }
      } catch (parseError) {
        setResult({
          harakat: inputText,
          transliteration: "Transliterasi tidak tersedia", 
          translation: content || "Terjemahan tidak tersedia",
          explanation: "Penjelasan grammatical tidak tersedia"
        });
        toast.success("Teks berhasil diproses!");
      }
      
    } catch (error: any) {
      console.error('SumoPod API Error:', error);
      toast.error(`Error: ${error.message || 'Gagal memproses teks.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOCRUpload = () => {
    // Mock OCR functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.loading("Memproses gambar...");
        setTimeout(() => {
          setInputText("بسم الله الرحمن الرحيم");
          toast.success("Teks berhasil diekstrak dari gambar!");
        }, 2000);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              👑 Pro User
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Harakatuna</span> Pro - Analisis Lengkap
          </h1>
          <p className="text-lg text-muted-foreground">
            Analisis mendalam dengan fitur OCR dan penjelasan grammatical lengkap
          </p>
        </div>

        {/* Usage Stats */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="shadow-soft border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Penggunaan Bulan Ini</span>
                <span className="text-sm font-bold text-green-600">
                  {monthlyUsage.used.toLocaleString()}/{monthlyUsage.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(monthlyUsage.used / monthlyUsage.limit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600 mt-1">
                ∞ Unlimited daily usage
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
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
                    {isProcessing ? "Memproses Analisis Lengkap..." : "🔍 Analisis Lengkap"}
                  </Button>
                </CardContent>
              </Card>

              {/* OCR Input - Pro Feature */}
              <Card className="shadow-soft border-2 border-primary/20 bg-gradient-to-br from-primary-soft/30 to-primary-soft/10">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-soft">
                      <span className="text-2xl">📷</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Upload Gambar Teks Arab</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ekstrak teks Arab dari gambar dengan teknologi OCR canggih
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary-soft text-primary border-primary/30">
                      ✨ Pro Feature Active
                    </Badge>
                    <Button 
                      onClick={handleOCRUpload}
                      variant="islamic"
                    >
                      📷 Upload & Extract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Pro Features */}
            <div className="space-y-6">
              {/* Pro Features List */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm">✨ Fitur Pro Aktif</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Unlimited analisis harian</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Teknologi OCR canggih</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Analisis nahwu lengkap</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>I'rab detail per kata</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Priority support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground text-center">
                ✨ Hasil Analisis Lengkap
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

                {/* Full Explanation - Pro Feature */}
                <Card className="shadow-soft border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📚</span>
                      <span>Analisis Nahwu & Sharaf Lengkap</span>
                      <Badge variant="outline" className="bg-primary-soft text-primary text-xs">
                        Pro
                      </Badge>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProUserApp;