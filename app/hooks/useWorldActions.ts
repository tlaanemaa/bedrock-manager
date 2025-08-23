import { useState, useCallback } from 'react';

export function useWorldActions() {
  const [exportingWorld, setExportingWorld] = useState<string | null>(null);

  const handleExportWorld = useCallback(async (worldId: string, worldName: string) => {
    setExportingWorld(worldId);
    try {
      const response = await fetch(`/api/worlds/${worldId}/export`);
      if (response.ok) {
        // Create a download link for the exported file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${worldName}.mcworld`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('Failed to export world:', errorData.error);
        alert(`Failed to export world: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error exporting world:', error);
      alert('Error exporting world. Please try again.');
    } finally {
      setExportingWorld(null);
    }
  }, []);

  return { handleExportWorld, exportingWorld };
}
