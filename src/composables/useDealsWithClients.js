import { useCRMStore } from "../stores/crm";
import { computed } from "vue";

export function useDealsWithClients() {
  const crm = useCRMStore();

  const dealsWithClients = computed(() => {
    return crm.deals.map((deal) => {
      const client = crm.clients.find((c) => c.id === deal.clientId);
      return {
        ...deal,
        clientName: client?.name || "Неизвестно",
        company: client?.company || "-",
        phone: client?.phone || "-",
      };
    });
  });
  return { dealsWithClients };
}
