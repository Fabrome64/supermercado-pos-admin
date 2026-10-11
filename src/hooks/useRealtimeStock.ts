import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Producto } from '../types/pos';

/**
 * Escucha cambios en tiempo real vía WebSockets de Supabase en la tabla 'productos'
 * e invalida/actualiza instantáneamente los datos de stock e inventario.
 */
export function useRealtimeStock() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-stock-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productos',
        },
        (payload) => {
          const updatedProduct = payload.new as Producto;

          // Invalida las consultas activas para forzar render fresco
          queryClient.invalidateQueries({ queryKey: ['productos'] });

          // Actualización optimista inmediata en memoria
          if (updatedProduct && updatedProduct.id) {
            queryClient.setQueriesData({ queryKey: ['productos'] }, (oldData: Producto[] | undefined) => {
              if (!oldData) return oldData;
              return oldData.map((prod) =>
                prod.id === updatedProduct.id
                  ? { ...prod, stock_actual: updatedProduct.stock_actual, precio_venta: updatedProduct.precio_venta }
                  : prod
              );
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
