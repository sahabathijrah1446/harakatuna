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

  // Token Management State
  const [tokenSettings, setTokenSettings] = useState({
    freeUserModel: "gpt-4.1-mini-2025-04-14",
    proUserModel: "gpt-4.1-2025-04-14",
    freeUserTokenLimit: 1000,
    proUserTokenLimit: 50000,
    currentMonthUsage: {
      freeUsers: 25430,
      proUsers: 156780,
      totalCost: 45.67
    }
  });

  const [showTokenSettings, setShowTokenSettings] = useState(false);

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

  // Save token settings
  const handleSaveTokenSettings = () => {
    localStorage.setItem('harakatuna_token_settings', JSON.stringify(tokenSettings));
    setShowTokenSettings(false);
    toast.success("Pengaturan token berhasil disimpan");
  };

  // Load token settings on mount
  useEffect(() => {
    const savedTokenSettings = localStorage.getItem('harakatuna_token_settings');
    if (savedTokenSettings) {
      setTokenSettings(JSON.parse(savedTokenSettings));
    }
  }, []);

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

        {/* Token Management Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Token Usage Overview */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🪙</span>
                <span>Token Usage Bulan Ini</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Free Users</div>
                    <div className="text-xs text-muted-foreground">Model: {tokenSettings.freeUserModel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {tokenSettings.currentMonthUsage.freeUsers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">tokens</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Pro Users</div>
                    <div className="text-xs text-muted-foreground">Model: {tokenSettings.proUserModel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {tokenSettings.currentMonthUsage.proUsers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium">Total Biaya</div>
                  <div className="text-lg font-bold text-green-600">
                    ${tokenSettings.currentMonthUsage.totalCost}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Configuration */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>Konfigurasi Token & Model</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showTokenSettings ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Free User Limit</span>
                      <span className="font-medium">{tokenSettings.freeUserTokenLimit} tokens</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Pro User Limit</span>
                      <span className="font-medium">{tokenSettings.proUserTokenLimit} tokens</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTokenSettings(true)}
                    className="w-full"
                  >
                    🔧 Ubah Konfigurasi
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Model untuk Free Users</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={tokenSettings.freeUserModel}
                        onChange={(e) => setTokenSettings({...tokenSettings, freeUserModel: e.target.value})}
                      >
                        <option value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini (Cepat & Murah)</option>
                        <option value="gpt-4.1-2025-04-14">GPT-4.1 (Standard)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Model untuk Pro Users</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={tokenSettings.proUserModel}
                        onChange={(e) => setTokenSettings({...tokenSettings, proUserModel: e.target.value})}
                      >
                        <option value="gpt-4.1-2025-04-14">GPT-4.1 (Standard)</option>
                        <option value="o3-2025-04-16">O3 (Reasoning Model)</option>
                        <option value="o4-mini-2025-04-16">O4 Mini (Fast Reasoning)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Token Limit Free Users</Label>
                      <Input
                        type="number"
                        value={tokenSettings.freeUserTokenLimit}
                        onChange={(e) => setTokenSettings({...tokenSettings, freeUserTokenLimit: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Token Limit Pro Users</Label>
                      <Input
                        type="number"
                        value={tokenSettings.proUserTokenLimit}
                        onChange={(e) => setTokenSettings({...tokenSettings, proUserTokenLimit: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSaveTokenSettings} variant="hero">
                      💾 Simpan Konfigurasi
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTokenSettings(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              )}
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