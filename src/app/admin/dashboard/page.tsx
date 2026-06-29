
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TradeBridgeTerminal } from '@/components/TradeBridgeTerminal';
import FollowersDashboard from '@/components/dashboard/FollowersDashboard';
import {
  LayoutDashboard,
  LogOut,
  Save,
  Image as ImageIcon,
  Type,
  Package,
  Users,
  Loader2,
  AlertCircle,
  Globe,
  Shield,
  TrendingUp,
  Terminal,
  Settings,
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dbError, setDbError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [content, setContent] = useState({
    branding: {
      logoUrl: "/igrow_logo footer - Copy.png",
      siteName: "iGrow Finance"
    },
    hero: {
      title: "Institutional Global Liquidity Network",
      description: "Connect to the world's most robust trading ecosystem. Precision execution across crypto and forex, powered by Orng's high-fidelity backbone.",
      imageUrl: "/Group 2.png"
    },
    wealth: {
      title: "Built for wealth, made for everyone",
      description: "Trusted by institutional and retail investors around the world since 2016."
    },
    copyTrading: {
      title: "Precision Copy Trading",
      description: "Mirror the performance of the world's most successful traders. Precision execution for Forex and Crypto markets.",
      videoUrl: "/Untitled design.mp4"
    },
    packages: {
      instituteName: "IGROW LEARNING INSTITUTE",
      subtitle: "Course & Admission Programs"
    },
    referral: {
      title: "iGrow Referral Benefits",
      description: "Scale your network and unlock exponential rewards. Our unique referral structure is designed to reward active ecosystem participants.",
      imageUrl: "/commiso.png"
    },
    trading: {
      activeTrades: [
        { id: '1', pair: 'BTC/USD', type: 'LONG', entry: '64,200', current: '65,800', pnl: '+2.49%', status: 'Active' },
        { id: '2', pair: 'EUR/USD', type: 'SHORT', entry: '1.0920', current: '1.0840', pnl: '+0.73%', status: 'Active' }
      ],
      traders: [
        { name: 'Elite Alpha', yield: '32.1%', followers: '1,240', risk: 'Low' },
        { name: 'Forex Master', yield: '18.5%', followers: '850', risk: 'Medium' }
      ]
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('igrow_admin_token');
    if (token !== 'authenticated') {
      router.push('/admin');
      return;
    }

    const loadContent = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.success && data.content) {
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setDbError(true);
      } finally {
        setFetching(false);
      }
    };

    loadContent();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('igrow_admin_token');
    router.push('/admin');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Content save failed');
      }

      toast({ title: 'Success', description: 'All configurations updated live across the ecosystem.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Update Failed', description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#080D1B] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D1B] flex flex-col">
      <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Command Center</h1>
            <p className="text-white/40 text-xs font-medium">Institutional Dashboard v2.0</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => router.push('/terminal')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Terminal
          </Button>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <Button className="bg-primary text-black font-bold" onClick={handleSave} disabled={loading || dbError}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Deploy Updates
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-12 px-6 flex-1 max-w-6xl">
        {dbError && (
          <Alert variant="destructive" className="mb-8 bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription>
              Firebase connection inactive. Fill your <code className="bg-black/20 px-1 rounded">.env</code> keys to enable live synchronization.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="trading" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-14 w-full justify-start overflow-x-auto overflow-y-hidden no-scrollbar">
            <TabsTrigger value="trading" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg h-full flex items-center gap-2 px-6">
              <Terminal className="w-4 h-4" /> Trading Terminal
            </TabsTrigger>
            <TabsTrigger value="branding" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg h-full flex items-center gap-2 px-6">
              <Settings className="w-4 h-4" /> Branding
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg h-full flex items-center gap-2 px-6">
              <Type className="w-4 h-4" /> Sections
            </TabsTrigger>
            <TabsTrigger value="packages" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg h-full flex items-center gap-2 px-6">
              <Package className="w-4 h-4" /> Programs
            </TabsTrigger>
            <TabsTrigger value="referral" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg h-full flex items-center gap-2 px-6">
              <Users className="w-4 h-4" /> Affiliate
            </TabsTrigger>
          </TabsList>

          {/* TRADING TERMINAL */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/5 border border-white/10 text-white rounded-[32px] shadow-xl shadow-black/20 overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-black/10 backdrop-blur-xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-2xl font-headline">Live Mirror Status</CardTitle>
                    <Badge className="bg-orange-500/15 text-orange-300 border-none">Execution Engine Online</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-black/10">
                  <TradeBridgeTerminal showFollowerTerminal={false} />
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10 text-white rounded-[32px] shadow-xl shadow-black/20">
                <CardHeader className="p-8 border-b border-white/5">
                  <CardTitle className="text-2xl font-headline">Master Traders</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-4">
                  {content.trading.traders.map((trader, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between gap-4 transition-all hover:border-orange-400/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-300">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{trader.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{trader.followers} Followers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-300 font-bold">{trader.yield}</p>
                        <p className="text-[10px] text-white/40">Yield</p>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-4 bg-orange-500/15 border border-orange-400/20 text-orange-100 hover:bg-orange-500/10 h-12 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add Master Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            <FollowersDashboard />
          </TabsContent>

          {/* BRANDING */}
          <TabsContent value="branding" className="space-y-6">
            <Card className="bg-white/5 border-white/10 text-white p-8 rounded-[32px]">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-headline">Institutional Identity</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Logo URL (Dynamic Sync)</Label>
                    <Input 
                      value={content.branding.logoUrl}
                      onChange={(e) => setContent({ ...content, branding: { ...content.branding, logoUrl: e.target.value }})}
                      className="bg-black/40 border-white/10 h-12"
                      placeholder="/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Portal Name</Label>
                    <Input 
                      value={content.branding.siteName}
                      onChange={(e) => setContent({ ...content, branding: { ...content.branding, siteName: e.target.value }})}
                      className="bg-black/40 border-white/10 h-12"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-white/40 text-xs">Recommended logo size: 400x120px, PNG with transparency.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SECTIONS EDITOR */}
          <TabsContent value="hero" className="space-y-6">
            <div className="grid grid-cols-1 gap-8">
              {/* Hero Section */}
              <Card className="bg-white/5 border-white/10 text-white p-8 rounded-[32px]">
                <CardHeader className="px-0 pt-0">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    <CardTitle className="text-2xl font-headline">Hero Content</CardTitle>
                  </div>
                </CardHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Main Headline</Label>
                    <Textarea 
                      value={content.hero.title}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value }})}
                      className="bg-black/40 border-white/10 min-h-[100px] text-lg font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Dashboard Image URL</Label>
                      <Input 
                        value={content.hero.imageUrl}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, imageUrl: e.target.value }})}
                        className="bg-black/40 border-white/10 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Description</Label>
                      <Textarea 
                        value={content.hero.description}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value }})}
                        className="bg-black/40 border-white/10 h-12"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Copy Trading Section */}
              <Card className="bg-white/5 border-white/10 text-white p-8 rounded-[32px]">
                <CardHeader className="px-0 pt-0">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <CardTitle className="text-2xl font-headline">Copy Trading Landing</CardTitle>
                  </div>
                </CardHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Section Title</Label>
                      <Input 
                        value={content.copyTrading.title}
                        onChange={(e) => setContent({ ...content, copyTrading: { ...content.copyTrading, title: e.target.value }})}
                        className="bg-black/40 border-white/10 h-12 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Video URL</Label>
                      <Input 
                        value={content.copyTrading.videoUrl}
                        onChange={(e) => setContent({ ...content, copyTrading: { ...content.copyTrading, videoUrl: e.target.value }})}
                        className="bg-black/40 border-white/10 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Marketing Description</Label>
                    <Textarea 
                      value={content.copyTrading.description}
                      onChange={(e) => setContent({ ...content, copyTrading: { ...content.copyTrading, description: e.target.value }})}
                      className="bg-black/40 border-white/10 min-h-[80px]"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* PACKAGES */}
          <TabsContent value="packages" className="space-y-6">
             <Card className="bg-white/5 border-white/10 text-white p-8 rounded-[32px]">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-headline">Academy Header</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Institute Name</Label>
                  <Input 
                    value={content.packages.instituteName}
                    onChange={(e) => setContent({ ...content, packages: { ...content.packages, instituteName: e.target.value }})}
                    className="bg-black/40 border-white/10 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Subtitle</Label>
                  <Input 
                    value={content.packages.subtitle}
                    onChange={(e) => setContent({ ...content, packages: { ...content.packages, subtitle: e.target.value }})}
                    className="bg-black/40 border-white/10 h-12"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* REFERRAL */}
          <TabsContent value="referral" className="space-y-6">
            <Card className="bg-white/5 border-white/10 text-white p-8 rounded-[32px]">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-headline">Affiliate Marketing</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Section Heading</Label>
                  <Input 
                    value={content.referral.title}
                    onChange={(e) => setContent({ ...content, referral: { ...content.referral, title: e.target.value }})}
                    className="bg-black/40 border-white/10 h-12"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Structure Image URL</Label>
                    <Input 
                      value={content.referral.imageUrl}
                      onChange={(e) => setContent({ ...content, referral: { ...content.referral, imageUrl: e.target.value }})}
                      className="bg-black/40 border-white/10 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/40 text-xs uppercase tracking-widest font-bold">Description</Label>
                    <Textarea 
                      value={content.referral.description}
                      onChange={(e) => setContent({ ...content, referral: { ...content.referral, description: e.target.value }})}
                      className="bg-black/40 border-white/10 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

