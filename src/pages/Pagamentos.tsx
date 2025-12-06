import { CreditCard, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const payments = [
  { id: 'PAY-001', client: 'Loja TechStore', amount: 299, date: '2025-01-20', status: 'Pendente' },
  { id: 'PAY-002', client: 'Escritório Jurídico Silva', amount: 299, date: '2025-01-15', status: 'Pendente' },
  { id: 'PAY-003', client: 'Clínica Odonto Plus', amount: 299, date: '2024-12-01', status: 'Atrasado' },
  { id: 'PAY-004', client: 'Restaurante Sabor Caseiro', amount: 499, date: '2024-12-10', status: 'Pago' },
  { id: 'PAY-005', client: 'Imobiliária Casa Nova', amount: 299, date: '2024-12-05', status: 'Pago' },
  { id: 'PAY-006', client: 'Academia FitLife', amount: 299, date: '2024-11-20', status: 'Cancelado' },
  { id: 'PAY-007', client: 'Agência Criativa Design', amount: 599, date: '2024-12-30', status: 'Pago' },
  { id: 'PAY-008', client: 'Pet Shop Amigo Fiel', amount: 299, date: '2025-02-05', status: 'Pendente' },
];

const statusConfig = {
  'Pago': { icon: CheckCircle, className: 'bg-success/10 text-success border-success/20' },
  'Pendente': { icon: Clock, className: 'bg-warning/10 text-warning border-warning/20' },
  'Atrasado': { icon: AlertCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
  'Cancelado': { icon: AlertCircle, className: 'bg-muted text-muted-foreground border-border' },
};

export default function Pagamentos() {
  const totalReceived = payments.filter(p => p.status === 'Pago').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pendente').reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'Atrasado').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Pagamentos</h1>
        <p className="text-muted-foreground">Acompanhe todos os pagamentos do sistema</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">R$ {totalReceived.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">R$ {totalPending.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Atrasado</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R$ {totalOverdue.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round((payments.filter(p => p.status === 'Pago').length / payments.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => {
                const StatusIcon = statusConfig[payment.status as keyof typeof statusConfig].icon;
                return (
                  <TableRow 
                    key={payment.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-sm text-muted-foreground">{payment.id}</TableCell>
                    <TableCell className="font-medium">{payment.client}</TableCell>
                    <TableCell>R$ {payment.amount.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "gap-1",
                          statusConfig[payment.status as keyof typeof statusConfig].className
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
