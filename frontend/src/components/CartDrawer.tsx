import { useState } from 'react';
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { formatCurrency } from '../lib/format.ts';
import { buttonClass } from '../lib/buttonClass.ts';
import { inputClass } from './ui.tsx';

export function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    total: number;
    itemsCount: number;
    table: string;
  } | null>(null);

  if (!isCartOpen) return null;

  function handleCheckout() {
    const randomId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    setOrderSuccess({
      orderId: randomId,
      total: totalPrice,
      itemsCount: totalCount,
      table: tableNumber.trim() || 'Langsung ambil di kasir',
    });
    clearCart();
    setTableNumber('');
    setNote('');
  }

  function handleClose() {
    setIsCartOpen(false);
    setOrderSuccess(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl border-l border-border animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-surface-muted/50">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-control bg-primary text-white shadow-sm">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="m-0 text-base font-extrabold text-text">Keranjang Pesanan</h2>
              <p className="m-0 text-xs text-text-muted">{totalCount} item dipilih</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 items-center justify-center rounded-control text-text-muted transition hover:bg-surface-muted hover:text-text"
            aria-label="Tutup keranjang"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-success-bg text-success shadow-inner">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-text">Pesanan Berhasil Dibuat!</h3>
                <p className="mt-1 text-xs text-text-muted">
                  Tunjukkan nomor antrean ini ke kasir warung kantin saat membayar.
                </p>
              </div>

              <div className="w-full rounded-control border border-border bg-surface-muted p-4 space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">No. Pesanan:</span>
                  <span className="font-extrabold text-primary">{orderSuccess.orderId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Tujuan / Meja:</span>
                  <span className="font-semibold text-text">{orderSuccess.table}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Jumlah Menu:</span>
                  <span className="font-semibold text-text">{orderSuccess.itemsCount} item</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                  <span>Total Bayar:</span>
                  <span className="text-primary">{formatCurrency(orderSuccess.total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className={buttonClass('primary', 'w-full')}
              >
                Kembali ke Menu
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                <UtensilsCrossed className="size-7" aria-hidden="true" />
              </div>
              <p className="font-bold text-text text-base mb-0">Keranjang Masih Kosong</p>
              <p className="text-xs text-text-muted max-w-xs mb-0">
                Buka salah satu warung di halaman utama, lalu klik tombol "+ Pesan" pada menu makanan yang ingin kamu pesan.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="m-0 truncate text-sm font-bold text-text">{item.name}</p>
                      <p className="m-0 truncate text-[11px] text-text-muted">
                        Warung: {item.stallName}
                      </p>
                      <p className="mt-1 m-0 text-xs font-extrabold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex size-7 items-center justify-center rounded-control border border-border bg-surface-muted text-text transition hover:bg-border"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="size-3" aria-hidden="true" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex size-7 items-center justify-center rounded-control border border-border bg-surface-muted text-text transition hover:bg-border"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="size-3" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-1 flex size-7 items-center justify-center rounded-control text-danger transition hover:bg-danger-bg"
                        aria-label="Hapus item"
                        title="Hapus"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Pesanan (Nomor meja & catatan) */}
              <div className="rounded-control border border-border bg-surface-muted/40 p-3 space-y-3">
                <p className="text-xs font-bold text-text mb-0">Detail Pemesanan</p>
                <div>
                  <label htmlFor="cart-table" className="block text-[11px] font-semibold text-text-muted mb-1">
                    Nomor Meja / Ruang (Opsional)
                  </label>
                  <input
                    id="cart-table"
                    className={`${inputClass} h-8 text-xs`}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Contoh: Meja B-03 atau Ambil Sendiri"
                  />
                </div>
                <div>
                  <label htmlFor="cart-note" className="block text-[11px] font-semibold text-text-muted mb-1">
                    Catatan untuk Penjual (Opsional)
                  </label>
                  <input
                    id="cart-note"
                    className={`${inputClass} h-8 text-xs`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: Sambal dipisah, es sedikit"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && !orderSuccess ? (
          <div className="border-t border-border p-4 bg-surface space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total Pembayaran:</span>
              <span className="text-lg font-extrabold text-primary">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className={buttonClass('secondary', 'h-10 text-xs px-3')}
              >
                Kosongkan
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                className={buttonClass('primary', 'flex-1 h-10 text-xs')}
              >
                Pesan Sekarang ({totalCount})
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
