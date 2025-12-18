
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4 bg-white shadow-sm rounded-b-3xl mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="text-pink-500 w-8 h-8" />
        <h1 className="text-3xl md:text-4xl font-pacifico text-pink-600">Mimos de IA</h1>
        <Sparkles className="text-pink-500 w-8 h-8" />
      </div>
      <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">
        Crie mensagens encantadoras para alegrar o dia de quem você ama!
      </p>
    </header>
  );
};

export default Header;
