
export type GreetingType = 'Bom dia' | 'Boa noite' | 'Feliz Natal' | 'Feliz Aniversário' | 'Personalizado' | 'Nenhum';

export type ThemeType = 'Bebezinhos' | 'Praias bonitas' | 'Paisagens' | 'Animais fofinhos' | 'Jardins floridos' | 'Aleatório' | 'Personalizado';

export type MotivationalType = 'Nenhum' | 'Aleatório' | 'Personalizado';

export interface GenerationParams {
  greetingType: GreetingType;
  customGreeting: string;
  theme: ThemeType;
  customTheme: string;
  motivationalType: MotivationalType;
  customMotivational: string;
  includeText: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
