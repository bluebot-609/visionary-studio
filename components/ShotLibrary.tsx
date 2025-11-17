'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, CheckSquare, Square } from 'lucide-react';
import { getUserShots, deleteShots, type SavedShot } from '../services/shotLibrary';
import { Button } from './ui/button';
import { Card } from './ui/card';
import Modal from './Modal';

interface ShotLibraryProps {
  userId: string;
  refreshTrigger?: number;
}

const ShotLibrary: React.FC<ShotLibraryProps> = ({ userId, refreshTrigger }) => {
  const [shots, setShots] = useState<SavedShot[]>([]);
  const [selectedShots, setSelectedShots] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewingShot, setViewingShot] = useState<SavedShot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadShots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 ShotLibrary: Starting to load shots for user:', userId);
      const userShots = await getUserShots(userId);
      console.log('✅ ShotLibrary: Loaded', userShots.length, 'shots');
      setShots(userShots);
    } catch (err) {
      console.error('❌ ShotLibrary: Failed to load shots:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
        
        // Check for specific errors
        if (err.message.includes('index')) {
          setError('Firestore index required. Check console for the link to create it.');
        } else if (err.message.includes('permission') || err.message.includes('PERMISSION_DENIED')) {
          setError('Permission denied. Please check Firebase security rules (see FIREBASE_SETUP.md)');
        } else {
          setError(`Failed to load shots: ${err.message}`);
        }
      } else {
        setError('Failed to load shots. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadShots();
  }, [loadShots, refreshTrigger]);

  const toggleShotSelection = (e: React.MouseEvent, shotId: string) => {
    e.stopPropagation(); // Prevent card click from triggering
    setSelectedShots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(shotId)) {
        newSet.delete(shotId);
      } else {
        newSet.add(shotId);
      }
      return newSet;
    });
  };

  const viewShot = (shot: SavedShot) => {
    setViewingShot(shot);
  };

  const selectAll = () => {
    setSelectedShots(new Set(shots.map((s) => s.id)));
  };

  const deselectAll = () => {
    setSelectedShots(new Set());
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteShots(userId, Array.from(selectedShots), shots);
      setShots((prev) => prev.filter((s) => !selectedShots.has(s.id)));
      setSelectedShots(new Set());
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete shots:', err);
      setError('Failed to delete shots. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 animate-pulse rounded-full bg-accent/30" />
          <p className="text-xs md:text-sm text-white/60">Loading your shot library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl md:rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm text-red-200">
        {error}
        <Button
          variant="secondary"
          size="sm"
          onClick={loadShots}
          className="ml-3 text-xs md:text-sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (shots.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 md:gap-6 rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
        <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/[0.05] text-white/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 md:h-10 md:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="font-display text-lg md:text-xl text-white mb-2">No shots saved yet</h3>
          <p className="text-xs md:text-sm text-white/60 max-w-md">
            Generate your first campaign visual in the Studio, and it will automatically appear here in your Shot Library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Action Bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 md:gap-4 rounded-2xl md:rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-xs md:text-sm text-white/70">
            {shots.length} shot{shots.length !== 1 ? 's' : ''} saved
          </span>
          {selectedShots.size > 0 && (
            <span className="text-xs md:text-sm text-accent">
              · {selectedShots.size} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {selectedShots.size === 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={selectAll}
              className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
            >
              <CheckSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
              Select All
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={deselectAll}
                className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
              >
                <Square className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Deselect All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 md:gap-2 bg-red-500 hover:bg-red-600 text-xs md:text-sm"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Delete ({selectedShots.size})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Shot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {shots.map((shot) => {
          const isSelected = selectedShots.has(shot.id);
          return (
            <Card
              key={shot.id}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl border-2 p-0 transition cursor-pointer ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.06]'
              }`}
              onClick={() => viewShot(shot)}
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={shot.imageUrl}
                  alt={`Shot ${shot.fileName}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter: `hue-rotate(${shot.hue}deg) saturate(${shot.saturation}%)`,
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                  <span className="text-xs md:text-sm text-white/90 font-semibold uppercase tracking-wider">
                    Click to view
                  </span>
                </div>
                
                {/* Checkbox */}
                <div
                  onClick={(e) => toggleShotSelection(e, shot.id)}
                  className={`absolute left-2 top-2 md:left-3 md:top-3 flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-lg transition z-10 ${
                    isSelected
                      ? 'bg-accent text-slate-950'
                      : 'bg-black/60 text-white/70 backdrop-blur hover:bg-black/80'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Square className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="px-3 py-2 md:px-4 md:py-3">
                <p className="text-[10px] md:text-xs text-white/50 truncate">
                  {new Date(shot.timestamp.toDate()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Selected Shots?"
        >
          <div className="space-y-4 md:space-y-6">
            <p className="text-xs md:text-sm text-white/80">
              You are about to permanently delete {selectedShots.size} shot
              {selectedShots.size !== 1 ? 's' : ''} from your library. This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 text-xs md:text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-xs md:text-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Shot Modal */}
      {viewingShot && (
        <Modal
          isOpen={!!viewingShot}
          onClose={() => setViewingShot(null)}
          title="Shot Preview"
          size="3xl"
        >
          <div className="space-y-3 md:space-y-4">
            <img
              src={viewingShot.imageUrl}
              alt={`Shot ${viewingShot.fileName}`}
              className="w-full h-auto rounded-lg md:rounded-xl object-contain max-h-[70vh] md:max-h-[80vh]"
              style={{
                filter: `hue-rotate(${viewingShot.hue}deg) saturate(${viewingShot.saturation}%)`,
              }}
            />
            <div className="flex items-center justify-between text-xs md:text-sm text-white/60">
              <span>
                {new Date(viewingShot.timestamp.toDate()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = viewingShot.imageUrl;
                  link.download = viewingShot.fileName;
                  link.click();
                }}
                className="flex items-center gap-1.5 md:gap-2 rounded-full text-xs md:text-sm"
              >
                <svg
                  className="h-3.5 w-3.5 md:h-4 md:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ShotLibrary;

