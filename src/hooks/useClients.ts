import { useState, useEffect } from 'react';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  sites: number;
  status: 'Ativo' | 'Inativo';
}

const STORAGE_KEY = 'clients_data';

const initialClients: Client[] = [
  { id: 1, name: 'João Silva', email: 'joao@techstore.com', phone: '(11) 99999-1234', sites: 1, status: 'Ativo' },
];

function loadFromStorage(): Client[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToStorage(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const stored = loadFromStorage();
      setClients(stored || initialClients);
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!loading && clients.length >= 0) {
      saveToStorage(clients);
    }
  }, [clients, loading]);

  const addClient = (newClient: Omit<Client, 'id'>) => {
    const id = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    setClients(prev => [...prev, { ...newClient, id }]);
  };

  const editClient = (id: number, updatedClient: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, ...updatedClient } : client
      )
    );
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const getStats = () => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'Ativo').length;
    const avgSites = total > 0 ? clients.reduce((acc, c) => acc + c.sites, 0) / total : 0;
    return { total, active, avgSites };
  };

  return { clients, loading, addClient, editClient, deleteClient, getStats };
}
