
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { GREETING_PRESETS, THEME_PRESETS, MOTIVATIONAL_PRESETS, LOADING_MESSAGES } from './constants';
import { GreetingType, ThemeType, MotivationalType, GenerationParams } from './types';
import { generateImage } from './services/geminiService';
import { 
  Download, 
  Share2, 
  RefreshCw, 
  Heart, 
  MessageCircle, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<GenerationParams>({
    greetingType: 'Bom dia',
    customGreeting: '',
    theme: 'Bebezinhos',
    customTheme: '',
    motivationalType: 'Nenhum',
    customMotivational: '',
    includeText: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cycle through loading messages
  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImage(params);
      setResultImage(imageUrl);
    } catch (err: any) {
      setError("Ops! Algo deu errado ao criar sua fofura. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `mimo-ia-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!resultImage) return;
    try {
      const blob = await (await fetch(resultImage)).blob();
      const file = new File([blob], 'mimo.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Mimo de IA',
          text: 'Veja que mensagem linda eu criei para você!',
        });
      } else {
        alert("Seu navegador não suporta compartilhamento direto. Baixe a imagem e envie manualmente!");
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col items-center">
      <Header />

      <main className="w-full max-w-2xl px-4 space-y-6">
        {/* Step 1: Greeting Selection */}
        <section className="bg-white p-6 rounded-3xl shadow-md space-y-4 border-l-4 border-pink-500">
          <div className="flex items-center gap-2 mb-2 text-pink-600 font-bold">
            <MessageCircle size={20} />
            <h2>O que vamos dizer?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {GREETING_PRESETS.map((type) => (
              <button
                key={type}
                onClick={() => setParams({ ...params, greetingType: type })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  params.greetingType === type
                    ? 'bg-pink-500 text-white shadow-lg scale-105'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {params.greetingType === 'Personalizado' && (
            <div className="mt-4 animate-in slide-in-from-top duration-300">
              <input
                type="text"
                placeholder="Ex: Bom dia, vovó querida!"
                className="w-full p-3 rounded-xl border-2 border-pink-100 focus:border-pink-300 outline-none transition-all"
                value={params.customGreeting}
                onChange={(e) => setParams({ ...params, customGreeting: e.target.value })}
              />
            </div>
          )}
        </section>

        {/* Step 2: Theme Selection */}
        <section className="bg-white p-6 rounded-3xl shadow-md space-y-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold">
            <ImageIcon size={20} />
            <h2>Qual será o tema de fundo?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme}
                onClick={() => setParams({ ...params, theme: theme })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  params.theme === theme
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {params.theme === 'Personalizado' && (
            <div className="mt-4 animate-in slide-in-from-top duration-300">
              <input
                type="text"
                placeholder="Ex: Gatinhos brincando com lã"
                className="w-full p-3 rounded-xl border-2 border-blue-100 focus:border-blue-300 outline-none transition-all"
                value={params.customTheme}
                onChange={(e) => setParams({ ...params, customTheme: e.target.value })}
              />
            </div>
          )}
        </section>

        {/* Step 3: Motivational Message Selection */}
        <section className="bg-white p-6 rounded-3xl shadow-md space-y-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold">
            <Heart size={20} />
            <h2>Deseja uma frase motivacional?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {MOTIVATIONAL_PRESETS.map((type) => (
              <button
                key={type}
                onClick={() => setParams({ ...params, motivationalType: type })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  params.motivationalType === type
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {params.motivationalType === 'Personalizado' && (
            <div className="mt-4 animate-in slide-in-from-top duration-300">
              <textarea
                placeholder="Digite algo positivo ou inspirador aqui..."
                className="w-full p-3 rounded-xl border-2 border-purple-100 focus:border-purple-300 outline-none transition-all resize-none h-24"
                value={params.customMotivational}
                onChange={(e) => setParams({ ...params, customMotivational: e.target.value })}
              />
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all select-none border border-dashed border-gray-200">
              <input 
                type="checkbox" 
                checked={params.includeText} 
                onChange={(e) => setParams({...params, includeText: e.target.checked})}
                className="w-6 h-6 accent-pink-500 cursor-pointer"
              />
              <div>
                <span className="text-gray-700 font-medium text-sm">Gerar texto escrito na imagem</span>
                <p className="text-xs text-gray-400">Desmarque se quiser apenas a foto de fundo</p>
              </div>
            </label>
          </div>
        </section>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl text-xl font-black text-white shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed translate-y-1' 
              : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:opacity-90 hover:-translate-y-1'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" />
              Gerando fofura...
            </>
          ) : (
            <>
              <Sparkles size={24} className="animate-pulse" />
              CRIAR MEU MIMO!
            </>
          )}
        </button>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 border border-red-100 animate-bounce">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {isLoading && (
          <div className="flex flex-col items-center py-12">
            <div className="relative">
              <div className="w-64 h-64 bg-pink-100 rounded-3xl mb-6 flex items-center justify-center animate-pulse overflow-hidden">
                <ImageIcon className="text-pink-300 w-24 h-24" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/50 animate-[shimmer_2s_infinite]"></div>
            </div>
            <p className="text-pink-600 font-bold italic text-center px-4">
              "{LOADING_MESSAGES[loadingMsgIndex]}"
            </p>
          </div>
        )}

        {resultImage && !isLoading && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl border-8 border-white bg-white">
              <img 
                src={resultImage} 
                alt="Mimo gerado" 
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                <CheckCircle2 className="text-green-500 w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 py-4 rounded-2xl shadow-md border-2 border-gray-100 hover:bg-gray-50 transition-all font-bold active:scale-95"
              >
                <Download size={22} />
                Baixar
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-2xl shadow-md hover:bg-green-600 transition-all font-bold active:scale-95"
              >
                <Share2 size={22} />
                WhatsApp
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-400 pb-12">
              Dica: Você pode compartilhar diretamente no WhatsApp ou salvar na galeria!
            </p>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-gray-400 text-sm flex flex-col items-center gap-1">
        <p>Feito com ❤️ por Mimos de IA</p>
        <p className="text-[10px] uppercase tracking-widest opacity-50">Tecnologia Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
