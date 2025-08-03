import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/AuthModal";

// Type for Free analysis result
interface FreeAnalysisResult {
  harakat: string;
  transliteration: string;
  translation: string;
  explanation: string;
}

const FreeUserApp = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<FreeAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dailyUsage, setDailyUsage] = useState({ used: 0, limit: 25 });

  // Check daily usage for authenticated users
  useEffect(() => {
    const checkUsage = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.rpc('check_daily_usage', { 
            user_uuid: user.id 
          });
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            setDailyUsage({
              used: data[0].usage_count,
              limit: data[0].limit_count
            });
          }
        } catch (error) {
          console.error('Error checking usage:', error);
        }
      }
    };
    
    checkUsage();
  }, [user, profile]);

  // Process Arabic text with authentication check
  const handleProcess = async () => {
    if (!user) {
      setAuthModalOpen(true);
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (!inputText.trim()) {
      toast.error("Mohon masukkan teks Arab terlebih dahulu");
      return;
    }

    if (dailyUsage.used >= dailyUsage.limit) {
      toast.error("Batas harian tercapai. Upgrade ke Pro untuk unlimited akses!");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simple mock analysis for demo purposes
      // In real implementation, this would call an AI service
      const mockResult = {
        harakat: inputText + " (مع الحركات)",
        transliteration: "Transliterasi: " + inputText.split('').reverse().join(''),
        translation: "Terjemahan: Contoh terjemahan untuk " + inputText,
        explanation: "Ini adalah penjelasan dasar untuk pengguna free."
      };
      
      // Save to analysis history
      const { error: historyError } = await supabase
        .from('analysis_history')
        .insert({
          user_id: user.id,
          input_text: inputText,
          harakat_result: mockResult.harakat,
          transliteration: mockResult.transliteration,
          translation: mockResult.translation,
          explanation: mockResult.explanation,
          analysis_type: 'manual'
        });

      if (historyError) {
        console.error('Error saving history:', historyError);
      }

      // Update daily usage
      const { error: usageError } = await supabase
        .from('profiles')
        .update({ 
          daily_usage: dailyUsage.used + 1 
        })
        .eq('user_id', user.id);

      if (usageError) {
        console.error('Error updating usage:', usageError);
      }

      setResult(mockResult);
      setDailyUsage(prev => ({ ...prev, used: prev.used + 1 }));
      await refreshProfile();
      toast.success("Analisis berhasil!");
      
    } catch (error: any) {
      console.error('Analysis Error:', error);
      toast.error(`Error: ${error.message || 'Gagal memproses teks.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOCRUpload = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    toast.error("Fitur OCR hanya tersedia untuk pengguna Pro. Upgrade sekarang!");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {user ? (profile?.plan_type === 'pro' ? '👑 Pro User' : '🆓 Free User') : '👤 Guest'}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Harakatuna</span> - Analisis Teks Arab
          </h1>
          <p className="text-lg text-muted-foreground">
            {user ? `Analisis teks Arab dengan batasan ${dailyUsage.limit} kali per hari` : 'Silakan login untuk menggunakan fitur analisis'}
          </p>
        </div>

        {/* Usage Limit - Only show for authenticated users */}
        {user && (
          <div className="max-w-md mx-auto mb-8">
            <Card className="shadow-soft border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Penggunaan Hari Ini</span>
                  <span className="text-sm font-bold text-orange-600">
                    {dailyUsage.used}/{dailyUsage.limit}
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(dailyUsage.used / dailyUsage.limit) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                disabled={!inputText.trim() || isProcessing || (user && dailyUsage.used >= dailyUsage.limit)}
                variant="hero"
                size="lg"
                className="w-full"
              >
                {!user ? "Login untuk Analisis" :
                 isProcessing ? "Sedang Memproses..." : 
                 dailyUsage.used >= dailyUsage.limit ? "Batas Harian Tercapai" :
                 "🔍 Analisis Teks"}
              </Button>
            </CardContent>
          </Card>

          {/* OCR Disabled for Free */}
          <Card className="shadow-soft border-dashed border-2 border-gray-300 opacity-75">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">📷</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Upload Gambar Teks Arab</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Fitur tidak tersedia untuk pengguna Free
                  </p>
                </div>
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                  🔒 Fitur Pro
                </Badge>
                <Button 
                  onClick={handleOCRUpload}
                  variant="outline"
                  disabled
                >
                  Upload Gambar
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

                {/* Limited Explanation for Free */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📚</span>
                      <span>Penjelasan Dasar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm leading-relaxed p-4 bg-muted rounded-lg">
                      {result.explanation ? result.explanation.substring(0, 100) + "..." : "Penjelasan tidak tersedia"}
                      <div className="mt-2 text-xs text-muted-foreground">
                        💡 Penjelasan lengkap tersedia untuk pengguna Pro
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Upgrade Prompt */}
          <Card className="shadow-soft border-primary/20 bg-gradient-to-r from-primary-soft to-primary-soft/50">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="text-2xl">👑</div>
                <div>
                  <h3 className="font-bold text-lg text-primary">Upgrade ke Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    • Unlimited analisis teks<br/>
                    • Fitur OCR untuk gambar<br/>
                    • Penjelasan nahwu lengkap<br/>
                    • Priority support
                  </p>
                </div>
                <Button variant="premium" asChild>
                  <Link to="/pro">Upgrade Sekarang</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default FreeUserApp;