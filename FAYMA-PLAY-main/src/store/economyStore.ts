import { create } from 'zustand';
import { ShopItem } from '../types';
import { GARAGE_ITEMS } from '../data/garageCatalog';
import { useProfileStore } from './profileStore';

interface EconomyState {
  catalog: ShopItem[];
  selectedCategory: 'all' | 'avatar_frame' | 'mascot_skin' | 'theme_color' | 'badge';
  previewItem: ShopItem | null;

  setSelectedCategory: (cat: 'all' | 'avatar_frame' | 'mascot_skin' | 'theme_color' | 'badge') => void;
  setPreviewItem: (item: ShopItem | null) => void;
  buyItem: (item: ShopItem) => { success: boolean; message: string };
  isPurchased: (itemId: string) => boolean;
  canAfford: (item: ShopItem) => { canAfford: boolean; deficit: number };
}

export const useEconomyStore = create<EconomyState>((set, get) => ({
  catalog: GARAGE_ITEMS,
  selectedCategory: 'all',
  previewItem: null,

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setPreviewItem: (item) => set({ previewItem: item }),

  isPurchased: (itemId: string) => {
    const activePlayer = useProfileStore.getState().getActivePlayer();
    if (!activePlayer) return false;
    return activePlayer.inventory.includes(itemId);
  },

  canAfford: (item: ShopItem) => {
    const activePlayer = useProfileStore.getState().getActivePlayer();
    if (!activePlayer) return { canAfford: false, deficit: item.price };

    if (item.currency === 'coins') {
      const diff = item.price - activePlayer.coins;
      return { canAfford: diff <= 0, deficit: Math.max(0, diff) };
    } else {
      const diff = item.price - activePlayer.gems;
      return { canAfford: diff <= 0, deficit: Math.max(0, diff) };
    }
  },

  buyItem: (item: ShopItem) => {
    const profileStore = useProfileStore.getState();
    const activePlayer = profileStore.getActivePlayer();

    if (!activePlayer) {
      return { success: false, message: 'No hay jugador activo seleccionado' };
    }

    if (activePlayer.inventory.includes(item.id)) {
      return { success: false, message: '¡Ya posees este artículo!' };
    }

    const { canAfford, deficit } = get().canAfford(item);
    if (!canAfford) {
      const currencyName = item.currency === 'coins' ? 'monedas' : 'gemas';
      return { success: false, message: `Te faltan ${deficit} ${currencyName}` };
    }

    // Deduct and add
    const updatedCoins = item.currency === 'coins' ? activePlayer.coins - item.price : activePlayer.coins;
    const updatedGems = item.currency === 'gems' ? activePlayer.gems - item.price : activePlayer.gems;
    const updatedInventory = [...activePlayer.inventory, item.id];

    // Auto-equip item
    let equippedSkin = activePlayer.equippedSkin;
    let equippedBadge = activePlayer.equippedBadge;
    if (item.category === 'mascot_skin') equippedSkin = item.id;
    if (item.category === 'badge') equippedBadge = item.id;

    profileStore.updateProfile({
      ...activePlayer,
      coins: updatedCoins,
      gems: updatedGems,
      inventory: updatedInventory,
      equippedSkin,
      equippedBadge,
    });

    return { success: true, message: `¡Has adquirido ${item.name}!` };
  },
}));
