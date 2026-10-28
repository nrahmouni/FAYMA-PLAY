import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Coins, Gem, Sparkles, Check, Lock, ArrowLeft } from 'lucide-react';
import { useEconomyStore } from '../store/economyStore';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { ShopItem } from '../types';

export const GarageShop: React.FC = () => {
  const catalog = useEconomyStore(s => s.catalog);
  const selectedCategory = useEconomyStore(s => s.selectedCategory);
  const setSelectedCategory = useEconomyStore(s => s.setSelectedCategory);
  const previewItem = useEconomyStore(s => s.previewItem);
  const setPreviewItem = useEconomyStore(s => s.setPreviewItem);
  const buyItem = useEconomyStore(s => s.buyItem);
  const isPurchased = useEconomyStore(s => s.isPurchased);
  const canAfford = useEconomyStore(s => s.canAfford);

  const activePlayer = useProfileStore(s => s.getActivePlayer());
  const equipItem = useProfileStore(s => s.equipItem);
  const setScreen = useGameStore(s => s.setScreen);
  const { playCoin, playSuccess, playError } = useSound();

  const [notification, setNotification] = useState<{ message: string; success: boolean } | null>(null);

  const categories: { id: 'all' | 'avatar_frame' | 'mascot_skin' | 'theme_color' | 'badge'; label: string; icon: string }[] = [
    { id: 'all', label: 'Todos', icon: '✨' },
    { id: 'avatar_frame', label: 'Marcos de Avatar', icon: '👑' },
    { id: 'mascot_skin', label: 'Skins de Mascota', icon: '🦊' },
    { id: 'theme_color', label: 'Temas Neón', icon: '🎨' },
    { id: 'badge', label: 'Insignias', icon: '💎' },
  ];

  const filteredItems = catalog.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleBuyOrEquip = (item: ShopItem) => {
    if (!activePlayer) return;

    if (isPurchased(item.id)) {
      // Equip item
      if (item.category === 'mascot_skin' || item.category === 'badge') {
        equipItem(activePlayer.uid, item.category, item.id);
        playSuccess();
        setNotification({ message: `¡Equipado: ${item.name}!`, success: true });
      } else {
        setNotification({ message: `¡Ya posees este artículo!`, success: true });
      }
      return;
    }

    // Try purchase
    const result = buyItem(item);
    if (result.success) {
      playCoin();
      playSuccess();
      setNotification({ message: result.message, success: true });
    } else {
      playError();
      setNotification({ message: result.message, success: false });
    }

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-amber-300 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl border border-amber-300">
            🛍️
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span>El Garaje Cosmético</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Personaliza tu avatar y tu mascota con recompensas de tus victorias.
            </p>
          </div>
        </div>

        {/* Player Balances */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-amber-300 text-amber-800 font-extrabold text-sm">
            <Coins className="w-4 h-4" />
            <span className="tabular-nums">{activePlayer?.coins ?? 0} monedas</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-blue-200 text-blue-800 font-extrabold text-sm">
            <Gem className="w-4 h-4" />
            <span className="tabular-nums">{activePlayer?.gems ?? 0} gemas</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-2xl text-center text-xs sm:text-sm font-extrabold border shadow-xl ${
            notification.success
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
              : 'bg-rose-500/20 border-rose-500 text-rose-200'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md'
                : 'glass-card text-slate-400 hover:text-white border-white/5'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => {
          const owned = isPurchased(item.id);
          const { canAfford: affordable, deficit } = canAfford(item);
          const isCoins = item.currency === 'coins';
          const isEquipped =
            activePlayer?.equippedSkin === item.id || activePlayer?.equippedBadge === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-3xl glass-card border-2 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden ${
                isEquipped
                  ? 'border-emerald-500 bg-emerald-50'
                  : owned
                  ? 'border-sky-300 bg-sky-50'
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              <div>
                {/* Rarity & Emoji */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${
                      item.rarity === 'legendary'
                        ? 'bg-violet-100 text-violet-800 border-violet-300'
                        : item.rarity === 'epic'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : item.rarity === 'rare'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.rarity}
                  </span>

                  {owned && (
                    <span className="text-[10px] uppercase font-black text-emerald-700 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Adquirido
                    </span>
                  )}
                </div>

                {/* Preview Icon */}
                <div className="w-16 h-16 mx-auto my-2 rounded-2xl glass-panel flex items-center justify-center text-3xl shadow-inner border border-white/10 select-none">
                  {item.previewImage
                    ? <img src={item.previewImage} alt="" className="h-full w-full rounded-2xl object-contain" />
                    : item.previewEmoji}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base text-center mt-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 text-center line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-white/5">
                {owned ? (
                  <button
                    type="button"
                    onClick={() => handleBuyOrEquip(item)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isEquipped
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-sky-100 text-sky-800 border border-sky-300 hover:bg-sky-200'
                    }`}
                  >
                    {isEquipped ? 'Equipado Actualmente' : 'Equipar'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!affordable}
                    onClick={() => handleBuyOrEquip(item)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                      affordable
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 active:scale-95 cursor-pointer shadow-md shadow-orange-500/20'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? (
                      <>
                        <span>Comprar por {item.price}</span>
                        {isCoins ? (
                          <Coins className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Gem className="w-3.5 h-3.5 fill-current" />
                        )}
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Faltan {deficit} {isCoins ? 'monedas' : 'gemas'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
