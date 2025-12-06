import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { SiteData } from '@/utils/promptGenerator';

interface AddSiteDialogProps {
  onAddSite: (site: Omit<SiteData, 'id'>) => void;
}

export function AddSiteDialog({ onAddSite }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: '',
    siteUrl: '',
    active: true,
    nextPayment: '',
    segment: '',
    colors: '',
    objective: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.siteUrl || !formData.nextPayment) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onAddSite(formData);
    toast({
      title: "Site cadastrado!",
      description: `O site ${formData.company} foi adicionado com sucesso.`,
    });
    setFormData({
      company: '',
      siteUrl: '',
      active: true,
      nextPayment: '',
      segment: '',
      colors: '',
      objective: '',
      notes: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-fit">
          <Plus className="h-4 w-4" />
          Novo Site
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Site</DialogTitle>
          <DialogDescription>
            Preencha os dados do site para cadastrá-lo no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Nome da Empresa *</Label>
            <Input
              id="company"
              placeholder="Ex: Loja TechStore"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteUrl">URL do Site *</Label>
            <Input
              id="siteUrl"
              placeholder="https://exemplo.lovable.app"
              value={formData.siteUrl}
              onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextPayment">Próximo Pagamento *</Label>
            <Input
              id="nextPayment"
              type="date"
              value={formData.nextPayment}
              onChange={(e) => setFormData({ ...formData, nextPayment: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="segment">Segmento</Label>
            <Input
              id="segment"
              placeholder="Ex: E-commerce, Advocacia, Saúde..."
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="colors">Cores do Site</Label>
            <Input
              id="colors"
              placeholder="Ex: Azul e Branco"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo do Site</Label>
            <Input
              id="objective"
              placeholder="Ex: Venda de produtos, Captação de clientes..."
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Notas adicionais sobre o cliente ou site..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="active">Site Ativo</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Cadastrar Site
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
