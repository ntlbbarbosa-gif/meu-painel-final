import { useState } from 'react';
import { ExternalLink, Sparkles, MoreHorizontal, Power, PowerOff, Pencil, Trash2, CreditCard } from 'lucide-react';
import { SiteData, generateSitePrompt, copyToClipboard } from '@/utils/promptGenerator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SitesTableProps {
  sites: SiteData[];
  onToggleStatus: (id: string) => void;
  onEditSite?: (id: string, data: Partial<SiteData>) => void;
  onDeleteSite?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
}

export function SitesTable({ sites, onToggleStatus, onEditSite, onDeleteSite, onMarkAsPaid }: SitesTableProps) {
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<SiteData>>({});
  const { toast } = useToast();

  const handleGeneratePrompt = (site: SiteData) => {
    const prompt = generateSitePrompt(site);
    setSelectedPrompt(prompt);
    setSelectedSite(site);
    setPromptDialogOpen(true);
  };

  const handleCopyPrompt = async () => {
    await copyToClipboard(selectedPrompt);
    toast({ title: "Prompt copiado!", description: "O prompt foi copiado para a área de transferência." });
  };

  const handleEditClick = (site: SiteData) => {
    setSelectedSite(site);
    setEditFormData(site);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSite && onEditSite) {
      onEditSite(selectedSite.id, editFormData);
      toast({ title: "Site atualizado!", description: `O site ${editFormData.company} foi atualizado.` });
      setEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (site: SiteData) => {
    setSelectedSite(site);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSite && onDeleteSite) {
      onDeleteSite(selectedSite.id);
      toast({ title: "Site excluído!", description: `O site ${selectedSite.company} foi removido.`, variant: "destructive" });
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isPaymentOverdue = (dateString: string) => new Date(dateString) < new Date();

  const getPaymentStatus = (site: SiteData) => {
    const overdue = isPaymentOverdue(site.nextPayment);
    if (overdue && !site.active) {
      return { label: 'Atrasado + Desativado', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' };
    }
    if (overdue) {
      return { label: 'Atrasado', variant: 'destructive' as const, className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
    }
    if (site.active) {
      return { label: 'Ativo', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20' };
    }
    return { label: 'Desativado', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' };
  };

  const handleMarkAsPaid = (site: SiteData) => {
    if (onMarkAsPaid) {
      onMarkAsPaid(site.id);
      toast({ 
        title: "Pagamento registrado!", 
        description: `${site.company} agora tem +30 dias de uso.`,
      });
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Empresa</TableHead>
              <TableHead className="font-semibold">URL do Site</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Próximo Pagamento</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site, index) => (
              <TableRow key={site.id} className={cn("transition-colors animate-fade-in", !site.active && "opacity-60")} style={{ animationDelay: `${index * 50}ms` }}>
                <TableCell className="font-mono text-sm text-muted-foreground">{site.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{site.company}</div>
                  <div className="text-xs text-muted-foreground">{site.segment}</div>
                </TableCell>
                <TableCell>
                  <a href={site.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <span className="truncate max-w-[200px]">{site.siteUrl}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </TableCell>
                <TableCell>
                  {(() => {
                    const status = getPaymentStatus(site);
                    return (
                      <Badge variant="outline" className={cn("font-medium", status.className)}>
                        {status.label}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <div className={cn("text-sm", isPaymentOverdue(site.nextPayment) && "text-destructive font-medium")}>
                    {formatDate(site.nextPayment)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleGeneratePrompt(site)} className="gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Gerar Prompt</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(site)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar Site
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(site)}>
                          <CreditCard className="mr-2 h-4 w-4 text-success" /> Marcar como Pago
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(site.id)}>
                          {site.active ? <><PowerOff className="mr-2 h-4 w-4 text-destructive" /> Desativar Site</> : <><Power className="mr-2 h-4 w-4 text-success" /> Ativar Site</>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(site)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir Site
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Prompt Dialog */}
      <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Prompt Gerado - {selectedSite?.company}</DialogTitle>
            <DialogDescription>Use este prompt no Lovable.dev para criar um novo site</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <div className="rounded-lg bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap border border-border">{selectedPrompt}</div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setPromptDialogOpen(false)}>Fechar</Button>
            <Button onClick={handleCopyPrompt} className="gap-2"><Sparkles className="h-4 w-4" /> Copiar Prompt</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Site</DialogTitle>
            <DialogDescription>Atualize os dados do site.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Nome da Empresa</Label>
              <Input id="edit-company" value={editFormData.company || ''} onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-siteUrl">URL do Site</Label>
              <Input id="edit-siteUrl" value={editFormData.siteUrl || ''} onChange={(e) => setEditFormData({ ...editFormData, siteUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-nextPayment">Próximo Pagamento</Label>
              <Input id="edit-nextPayment" type="date" value={editFormData.nextPayment || ''} onChange={(e) => setEditFormData({ ...editFormData, nextPayment: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-segment">Segmento</Label>
              <Input id="edit-segment" value={editFormData.segment || ''} onChange={(e) => setEditFormData({ ...editFormData, segment: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-colors">Cores</Label>
              <Input id="edit-colors" value={editFormData.colors || ''} onChange={(e) => setEditFormData({ ...editFormData, colors: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-objective">Objetivo</Label>
              <Input id="edit-objective" value={editFormData.objective || ''} onChange={(e) => setEditFormData({ ...editFormData, objective: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea id="edit-notes" value={editFormData.notes || ''} onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Site Ativo</Label>
              <Switch id="edit-active" checked={editFormData.active || false} onCheckedChange={(checked) => setEditFormData({ ...editFormData, active: checked })} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Site</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir o site "{selectedSite?.company}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
