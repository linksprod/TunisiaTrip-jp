import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GuestHouse {
  id?: string;
  name: string;
  location: string;
  price_per_night?: string;
  description?: string;
  image?: string;
  images?: string[];
  amenities?: string[];
  rating?: number;
  breakfast?: boolean;
  latitude?: number;
  longitude?: number;
}

export const useGuestHouses = () => {
  const queryClient = useQueryClient();

  // Fetch all guesthouses
  const { data: guestHouses = [], isLoading, error } = useQuery({
    queryKey: ['guesthouses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guesthouses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GuestHouse[];
    },
  });

  // Create guesthouse
  const createGuestHouse = useMutation({
    mutationFn: async (guesthouse: Omit<GuestHouse, 'id'>) => {
      const { data, error } = await supabase
        .from('guesthouses')
        .insert([guesthouse])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guesthouses'] });
      toast.success('Guest house created successfully');
    },
    onError: (error) => {
      toast.error('Error creating guest house');
      console.error('Create guesthouse error:', error);
    },
  });

  // Update guesthouse
  const updateGuestHouse = useMutation({
    mutationFn: async ({ id, ...guesthouse }: GuestHouse) => {
      const { data, error } = await supabase
        .from('guesthouses')
        .update(guesthouse)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guesthouses'] });
      toast.success('Guest house updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating guest house');
      console.error('Update guesthouse error:', error);
    },
  });

  // Delete guesthouse
  const deleteGuestHouse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('guesthouses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guesthouses'] });
      toast.success('Guest house deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting guest house');
      console.error('Delete guesthouse error:', error);
    },
  });

  return {
    guestHouses,
    isLoading,
    error,
    createGuestHouse: createGuestHouse.mutate,
    updateGuestHouse: updateGuestHouse.mutate,
    deleteGuestHouse: deleteGuestHouse.mutate,
    isCreating: createGuestHouse.isPending,
    isUpdating: updateGuestHouse.isPending,
    isDeleting: deleteGuestHouse.isPending,
  };
};