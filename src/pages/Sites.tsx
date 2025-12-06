import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { SitesTable } from '@/components/sites/SitesTable';
import { AddSiteDialog } from '@/components/sites/AddSiteDialog';
import { useSites } from '@/hooks/useSites';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function Sites() {
  const { sites, loading, toggleSiteStatus, addSite, editSite, deleteSite, markAsPaid } = useSites();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.company.toLowerCase().includes(search.toLowerCase()) ||
                          site.siteUrl.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'active' && site.active) ||
                          (statusFilter === 'inactive' && !site.active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sites</h1>
          <p className="text-muted-foreground">Gerencie todos os sites alugados</p>
        </div>
        <AddSiteDialog onAddSite={addSite} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por empresa ou URL..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Desativados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Exibindo {filteredSites.length} de {sites.length} sites
      </div>

      {/* Sites Table */}
      <SitesTable 
        sites={filteredSites} 
        onToggleStatus={toggleSiteStatus} 
        onEditSite={editSite}
        onDeleteSite={deleteSite}
        onMarkAsPaid={markAsPaid}
      />
    </div>
  );
}
