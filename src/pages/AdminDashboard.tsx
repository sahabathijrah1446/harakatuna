import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [stats] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    proUsers: 156,
    apiCalls: 45672
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Admin</span> Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Kelola sistem Harakatuna dan monitor penggunaan
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.proUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Pro Users</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.apiCalls.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">API Calls</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* API Configuration */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔑</span>
                <span>Konfigurasi API SumoPod</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showApiKeyInput && apiKey ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary-soft rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span>✅</span>
                      <span className="text-sm font-medium">API Key terkonfigurasi</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowApiKeyInput(true)}
                    >
                      🔧 Ubah
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key SumoPod</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Masukkan SumoPod API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">
                      API key akan disimpan secara lokal untuk keamanan
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>Status Sistem</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API SumoPod</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✅ Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✅ Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">OCR Service</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  ⚠️ Limited
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Load</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  📈 Normal
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-soft mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📈</span>
              <span>Aktivitas Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">User baru mendaftar</span>
                </div>
                <span className="text-xs text-muted-foreground">2 menit lalu</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">API call processed</span>
                </div>
                <span className="text-xs text-muted-foreground">5 menit lalu</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">User upgrade ke Pro</span>
                </div>
                <span className="text-xs text-muted-foreground">10 menit lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;