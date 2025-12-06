import { useState, useEffect } from 'react';
import { SiteData } from '@/utils/promptGenerator';
import sitesData from '@/data/sites.json';

const STORAGE_KEY = 'sites_data';

function loadFromStorage(): SiteData[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToStorage(sites: SiteData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

export function useSites() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSites = () => {
      setTimeout(() => {
        const stored = loadFromStorage();
        setSites(stored || (sitesData as SiteData[]));
        setLoading(false);
      }, 300);
    };
    loadSites();
  }, []);

  useEffect(() => {
    if (!loading && sites.length >= 0) {
      saveToStorage(sites);
    }
  }, [sites, loading]);

  const toggleSiteStatus = (id: string) => {
    setSites(prevSites =>
      prevSites.map(site =>
        site.id === id ? { ...site, active: !site.active } : site
      )
    );
  };

  const addSite = (newSite: Omit<SiteData, 'id'>) => {
    const id = `S-${String(sites.length + 1).padStart(3, '0')}`;
    setSites(prevSites => [...prevSites, { ...newSite, id }]);
  };

  const editSite = (id: string, updatedSite: Partial<SiteData>) => {
    setSites(prevSites =>
      prevSites.map(site =>
        site.id === id ? { ...site, ...updatedSite } : site
      )
    );
  };

  const deleteSite = (id: string) => {
    setSites(prevSites => prevSites.filter(site => site.id !== id));
  };

  const markAsPaid = (id: string) => {
    setSites(prevSites =>
      prevSites.map(site => {
        if (site.id === id) {
          const newPaymentDate = new Date();
          newPaymentDate.setDate(newPaymentDate.getDate() + 30);
          return { 
            ...site, 
            active: true, 
            nextPayment: newPaymentDate.toISOString().split('T')[0] 
          };
        }
        return site;
      })
    );
  };

  const getStats = () => {
    const activeSites = sites.filter(s => s.active).length;
    const inactiveSites = sites.filter(s => !s.active).length;
    const now = new Date();
    const overduePayments = sites.filter(s => new Date(s.nextPayment) < now).length;
    const upcomingPayments = sites.filter(s => {
      const paymentDate = new Date(s.nextPayment);
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return paymentDate >= now && paymentDate <= weekFromNow;
    }).length;
    const estimatedRevenue = activeSites * 299;

    return { activeSites, inactiveSites, overduePayments, upcomingPayments, estimatedRevenue };
  };

  return { sites, loading, toggleSiteStatus, addSite, editSite, deleteSite, markAsPaid, getStats };
}
