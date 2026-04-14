import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Activity {
  id?: string;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  duration?: string;
  price?: string;
  description?: string;
  image?: string;
  images?: string[];
  tags?: string[];
  category?: string;
  rating?: number;
  show_in_travel?: boolean;
  show_in_start_my_trip?: boolean;
}

export const useActivities = () => {
  const queryClient = useQueryClient();

  // Fetch all activities
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Activity[];
    },
  });

  // Create activity
  const createActivity = useMutation({
    mutationFn: async (activity: Omit<Activity, 'id'>) => {
      const { data, error } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activité créée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de l\'activité');
      console.error('Create activity error:', error);
    },
  });

  // Update activity
  const updateActivity = useMutation({
    mutationFn: async ({ id, ...activity }: Activity) => {
      const { data, error } = await supabase
        .from('activities')
        .update(activity)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activité mise à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour de l\'activité');
      console.error('Update activity error:', error);
    },
  });

  // Delete activity
  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activité supprimée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de l\'activité');
      console.error('Delete activity error:', error);
    },
  });

  return {
    activities,
    isLoading,
    error,
    createActivity: createActivity.mutate,
    updateActivity: updateActivity.mutate,
    deleteActivity: deleteActivity.mutate,
    isCreating: createActivity.isPending,
    isUpdating: updateActivity.isPending,
    isDeleting: deleteActivity.isPending,
  };
};