import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import OpenAI from "openai";

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
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('sumopod_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // Save API key to localStorage
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Mohon masukkan API key yang valid");
      return;
    }
    localStorage.setItem('sumopod_api_key', apiKey);
    setShowApiKeyInput(false);
    toast.success("API key berhasil disimpan");
  };

  // Process Arabic text using SumoPod API
  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error("Mohon masukkan teks Arab terlebih dahulu");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Mohon masukkan SumoPod API key terlebih dahulu");
      setShowApiKeyInput(true);
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

      const prompt = `Analisis teks Arab berikut dan berikan:
1. Teks dengan harakat lengkap
2. Transliterasi Latin
3. Terjemahan dalam Bahasa Indonesia  
4. Penjelasan grammatical (Nahwu & Sharaf)

Teks Arab: ${inputText}

Format response dalam JSON dengan struktur:
{
  "harakat": "teks dengan harakat",
  "transliteration": "transliterasi latin", 
  "translation": "terjemahan indonesia",
  "explanation": "penjelasan nahwu sharaf"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Anda adalah ahli bahasa Arab yang membantu menganalisis teks Arab dengan memberikan harakat, transliterasi, terjemahan, dan penjelasan grammatical.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      
      try {
        // Try to parse JSON response
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResult = JSON.parse(jsonMatch[0]);
          setResult(parsedResult);
          toast.success("Teks berhasil dianalisis!");
        } else {
          // Fallback if response is not in JSON format  
          setResult({
            harakat: inputText, // Keep original if no harakat provided
            transliteration: "Transliterasi tidak tersedia",
            translation: content || "Terjemahan tidak tersedia", 
            explanation: "Penjelasan grammatical tidak tersedia"
          });
          toast.success("Teks berhasil diproses!");
        }
      } catch (parseError) {
        // If JSON parsing fails, use the raw response
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
      toast.error(`Error: ${error.message || 'Gagal memproses teks. Periksa API key dan koneksi internet.'}`);
    } finally {
      setIsProcessing(false);
    }
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

        {/* API Key Configuration */}
        {showApiKeyInput && (
          <Card className="shadow-soft mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔑</span>
                <span>Konfigurasi SumoPod API</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key SumoPod</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Masukkan SumoPod API key Anda..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  API key akan disimpan secara lokal di browser Anda untuk keamanan
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveApiKey} variant="hero">
                  💾 Simpan API Key
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApiKeyInput(false)}
                  disabled={!localStorage.getItem('sumopod_api_key')}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Key Status */}
        {!showApiKeyInput && apiKey && (
          <Card className="shadow-soft mb-8 bg-primary-soft/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span className="text-sm font-medium">SumoPod API terkonfigurasi</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowApiKeyInput(true)}
                >
                  🔧 Ubah API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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