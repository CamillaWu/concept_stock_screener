import React, { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  onSearchFocus?: () => void;
  onClosePanel?: () => void;
  onColumnSwitch?: (direction: 'left' | 'right') => void;
  onListNavigation?: (direction: 'up' | 'down') => void;
  onOpenDetails?: () => void;
  onEscape?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onSearchFocus,
  onClosePanel,
  onColumnSwitch,
  onListNavigation,
  onOpenDetails,
  onEscape
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

    if (cmdOrCtrl && event.key === 'k') {
      event.preventDefault();
      onSearchFocus?.();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onColumnSwitch?.('left');
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onColumnSwitch?.('right');
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      onListNavigation?.('up');
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      onListNavigation?.('down');
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onOpenDetails?.();
    }
  }, [onSearchFocus, onClosePanel, onColumnSwitch, onListNavigation, onOpenDetails, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

export default KeyboardShortcuts;
