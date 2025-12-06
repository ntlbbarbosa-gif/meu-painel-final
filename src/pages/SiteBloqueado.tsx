import { AlertTriangle, Mail, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

export default function SiteBloqueado() {
  const [searchParams] = useSearchParams();
  const company = searchParams.get('empresa') || 'Este site';
  const reason = searchParams.get('motivo') || 'pagamento pendente';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Warning Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-amber-500/30 rounded-full" />
            <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-full shadow-2xl shadow-amber-500/20">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-8 pb-10 px-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-3">
              Site Temporariamente Indisponível
            </h1>
            
            <p className="text-slate-300 text-lg mb-6">
              <span className="font-semibold text-white">{company}</span> está fora do ar devido a{' '}
              <span className="text-amber-400 font-medium">{reason}</span>.
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
              <div className="flex items-center justify-center gap-2 text-amber-400 mb-3">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Ação Necessária</span>
              </div>
              <p className="text-slate-300 text-sm">
                Para restaurar o acesso ao site, entre em contato com nossa equipe de suporte 
                ou regularize a situação financeira.
              </p>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <p className="text-slate-400 text-sm uppercase tracking-wider font-medium">
                Entre em contato
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  suporte@empresa.com
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  (11) 99999-9999
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Sistema de Gestão de Sites © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
