import { usePolling, useApiAction } from '@/hooks/usePolling';
import { useNotifications, LoadingState, EmptyState } from '@/components/ErrorHandling';
import { agendaService, newsService, museumService } from '@/lib/api-services';

// Enhanced agenda list with real-time updates
export const useAgendaData = () => {
  return usePolling(
    () => agendaService.getAll(),
    { interval: 30000, enabled: true }
  );
};

// Enhanced news data with real-time updates  
export const useNewsData = () => {
  return usePolling(
    () => newsService.getAll(),
    { interval: 30000, enabled: true }
  );
};

// Enhanced museum data with real-time updates
export const useMuseumData = () => {
  return usePolling(
    () => museumService.getAll(), 
    { interval: 30000, enabled: true }
  );
};

export const useCrudOperations = (service: any, itemName: string) => {
  const notifications = useNotifications();
  const { execute, loading, error } = useApiAction();

  const create = async (data: any) => {
    return execute(
      () => service.create(data),
      () => notifications.success(`${itemName} created successfully`),
      (error) => notifications.error(`Failed to create ${itemName}`, error)
    );
  };

  const update = async (id: string, data: any) => {
    return execute(
      () => service.update(id, data),
      () => notifications.success(`${itemName} updated successfully`),
      (error) => notifications.error(`Failed to update ${itemName}`, error)
    );
  };

  const remove = async (id: string) => {
    return execute(
      () => service.delete(id),
      () => notifications.success(`${itemName} deleted successfully`),
      (error) => notifications.error(`Failed to delete ${itemName}`, error)
    );
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    return execute(
      () => service.update(id, { is_published: isPublished }),
      () => notifications.success(`${itemName} ${isPublished ? 'published' : 'unpublished'}`),
      (error) => notifications.error(`Failed to ${isPublished ? 'publish' : 'unpublish'} ${itemName}`, error)
    );
  };

  return {
    create,
    update,
    remove,
    togglePublish,
    loading,
    error,
  };
};