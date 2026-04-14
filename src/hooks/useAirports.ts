import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Airport {
  id?: string;
  name: string;
  code: string;
  location: string;
  description?: string;
  images?: string[];
  advantages?: string[];
  latitude?: number;
  longitude?: number;
  region?: string;
  is_active?: boolean;
}

export const useAirports = () => {
  const queryClient = useQueryClient();

  // Fetch all active airports
  const { data: airports = [], isLoading, error } = useQuery({
    queryKey: ['airports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airports')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Airport[];
    },
  });

  // Create airport
  const createAirport = useMutation({
    mutationFn: async (airport: Omit<Airport, 'id'>) => {
      const { data, error } = await supabase
        .from('airports')
        .insert([airport])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      toast.success('Airport created successfully');
    },
    onError: (error) => {
      toast.error('Error creating airport');
      console.error('Create airport error:', error);
    },
  });

  // Update airport
  const updateAirport = useMutation({
    mutationFn: async ({ id, ...airport }: Airport) => {
      const { data, error } = await supabase
        .from('airports')
        .update(airport)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      toast.success('Airport updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating airport');
      console.error('Update airport error:', error);
    },
  });

  // Delete airport
  const deleteAirport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('airports')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      toast.success('Airport deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting airport');
      console.error('Delete airport error:', error);
    },
  });

  return {
    airports,
    isLoading,
    error,
    createAirport: createAirport.mutate,
    updateAirport: updateAirport.mutate,
    deleteAirport: deleteAirport.mutate,
    isCreating: createAirport.isPending,
    isUpdating: updateAirport.isPending,
    isDeleting: deleteAirport.isPending,
  };
};