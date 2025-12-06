export interface SiteData {
  id: string;
  company: string;
  siteUrl: string;
  active: boolean;
  nextPayment: string;
  segment: string;
  colors: string;
  objective: string;
  notes: string;
}

export function generateSitePrompt(site: SiteData): string {
  return `Crie um site profissional e moderno para a empresa "${site.company}".

📌 **Informações do Projeto:**
- **Segmento:** ${site.segment}
- **Paleta de Cores:** ${site.colors}
- **Objetivo Principal:** ${site.objective}

🎯 **Requisitos:**
1. Design responsivo e mobile-first
2. Layout limpo e profissional
3. Seções principais: Hero, Sobre, Serviços, Contato
4. Formulário de contato funcional
5. Otimizado para SEO
6. Animações sutis e modernas

📝 **Observações Adicionais:**
${site.notes}

⚡ **Stack Recomendada:**
- React + Tailwind CSS + shadcn/ui
- Design system consistente
- Ícones Lucide React

Gere um site completo, funcional e visualmente impressionante que represente bem a marca "${site.company}".`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
