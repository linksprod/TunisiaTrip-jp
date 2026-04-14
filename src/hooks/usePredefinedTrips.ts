import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PredefinedTrip {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  target_airport_id?: string;
  activity_ids: string[];
  hotel_ids: string[];
  guesthouse_ids: string[];
  price_estimate?: string;
  difficulty_level: string;
  theme?: string;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePredefinedTrips = () => {
  return useQuery({
    queryKey: ['predefined-trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predefined_trips')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        toast({
          title: "Error fetching predefined trips",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as PredefinedTrip[];
    },
  });
};

export const useAllPredefinedTrips = () => {
  return useQuery({
    queryKey: ['all-predefined-trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predefined_trips')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Error fetching predefined trips",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as PredefinedTrip[];
    },
  });
};

export const useCreatePredefinedTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (trip: Omit<PredefinedTrip, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('predefined_trips')
        .insert([trip])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predefined-trips'] });
      queryClient.invalidateQueries({ queryKey: ['all-predefined-trips'] });
      toast({
        title: "Trip created",
        description: "Predefined trip has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating trip",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePredefinedTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...trip }: Partial<PredefinedTrip> & { id: string }) => {
      const { data, error } = await supabase
        .from('predefined_trips')
        .update(trip)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predefined-trips'] });
      queryClient.invalidateQueries({ queryKey: ['all-predefined-trips'] });
      toast({
        title: "Trip updated",
        description: "Predefined trip has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating trip",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePredefinedTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('predefined_trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predefined-trips'] });
      queryClient.invalidateQueries({ queryKey: ['all-predefined-trips'] });
      toast({
        title: "Trip deleted",
        description: "Predefined trip has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting trip",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};