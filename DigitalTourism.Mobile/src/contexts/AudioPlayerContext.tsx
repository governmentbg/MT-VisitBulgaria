import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Event, useTrackPlayerEvents, State } from 'react-native-track-player';
import { createMMKV } from 'react-native-mmkv';
import * as AudioService from '../services/audioPlayerService';
import type { AudioTrack } from '../services/audioPlayerService';
import type { Attraction } from '../models/Attraction';
import type { AudioGuide } from '../models/AudioGuide';

// MMKV storage for persisting playback position
const audioStorage = createMMKV({
  id: 'audio-player-storage',
  mode: 'multi-process',
  readOnly: false,
});

/**
 * Audio Player Context State
 */
interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  currentAttraction: Attraction | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  playbackState: State;
  queueSize: number;
  currentTrackIndex: number | null;
  hasPreviousTrack: boolean;
  hasNextTrack: boolean;
}

/**
 * Audio Player Context Actions
 */
interface AudioPlayerActions {
  playTrack: (attraction: Attraction, audioGuide?: AudioGuide) => Promise<void>;
  playAttractionQueue: (attraction: Attraction, sectionId?: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  skipForward: (seconds?: number) => Promise<void>;
  skipBackward: (seconds?: number) => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

/**
 * Combined Context Type
 */
type AudioPlayerContextType = AudioPlayerState & AudioPlayerActions;

const defaultState: AudioPlayerState = {
  currentTrack: null,
  currentAttraction: null,
  isPlaying: false,
  isLoading: false,
  position: 0,
  duration: 0,
  playbackState: State.None,
  queueSize: 0,
  currentTrackIndex: null,
  hasPreviousTrack: false,
  hasNextTrack: false,
};

// Events to subscribe to
const trackPlayerEvents = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackActiveTrackChanged,
];

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

/**
 * Audio Player Provider Component
 */
export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AudioPlayerState>(defaultState);
  const [isSetup, setIsSetup] = useState(false);
  const positionIntervalRef = useRef<number | null>(null);
  const trackIdRef = useRef<string | null>(null);
  const positionRef = useRef(0);
  const durationRef = useRef(0);

  // Setup player on mount
  useEffect(() => {
    const setup = async () => {
      const success = await AudioService.setupPlayer();
      setIsSetup(success);
    };
    setup();

    return () => {
      // Cleanup interval on unmount
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, []);

  // Update position periodically when playing
  // UI updates every 1s; MMKV persistence every 5s to reduce battery drain
  const persistCounterRef = useRef(0);
  useEffect(() => {
    trackIdRef.current = state.currentTrack?.id ?? null;
    if (state.isPlaying) {
      if (!trackIdRef.current) return;
      persistCounterRef.current = 0;
      positionIntervalRef.current = setInterval(async () => {
        const position = await AudioService.getPosition();
        const duration = await AudioService.getDuration();

        // Only update state when values change meaningfully
        const posChanged = Math.abs(position - positionRef.current) > 0.5;
        const durChanged = duration > 0 && duration !== durationRef.current;
        if (posChanged || durChanged) {
          positionRef.current = position;
          if (durChanged) durationRef.current = duration;
          setState(prev => ({
            ...prev,
            position,
            duration: duration || prev.duration,
          }));
        }

        // Persist position for resume (every 5th tick = every 5s)
        persistCounterRef.current += 1;
        if (persistCounterRef.current >= 5) {
          persistCounterRef.current = 0;
          const currentTrackId = trackIdRef.current;
          if (currentTrackId) {
            audioStorage.set(`position_${currentTrackId}`, position.toString());
          }
        }
      }, 1000);
    } else {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
        positionIntervalRef.current = null;
      }
      // Persist final position on pause
      if (trackIdRef.current) {
        AudioService.getPosition().then(pos => {
          audioStorage.set(`position_${trackIdRef.current}`, pos.toString());
        });
      }
    }

    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [state.isPlaying, state.currentTrack?.id]);

  // Listen for track player events
  useTrackPlayerEvents(trackPlayerEvents, async event => {
    if (event.type === Event.PlaybackState) {
      const playbackState = event.state as State;
      const isPlaying = playbackState === State.Playing;

      setState(prev => ({
        ...prev,
        playbackState,
        isPlaying,
        isLoading:
          playbackState === State.Loading || playbackState === State.Buffering,
      }));
    } else if (event.type === Event.PlaybackActiveTrackChanged) {
      const track = await AudioService.getCurrentTrack();
      if (track) {
        const duration = await AudioService.getDuration();
        setState(prev => ({
          ...prev,
          currentTrack: track,
          duration,
        }));
      }
    } else if (event.type === Event.PlaybackError) {
      console.error('Playback error:', event);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
      }));
    }
  });

  /**
   * Play a track from an attraction
   * If audioGuide is provided, plays that specific guide
   * Otherwise plays the first guide from the first section
   */
  const playTrack = useCallback(
    async (attraction: Attraction, audioGuide?: AudioGuide) => {
      if (!isSetup) {
        console.warn('Player not setup yet');
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const track = audioGuide
        ? await AudioService.loadTrackFromGuide(attraction, audioGuide)
        : await AudioService.loadTrack(attraction);
        
      if (track) {
        // Start from beginning when user explicitly plays a track
        setState(prev => ({
          ...prev,
          currentTrack: track,
          currentAttraction: attraction,
          duration: track.duration,
          position: 0,
          isLoading: false,
        }));

        // Clear any saved position and start fresh
        audioStorage.set(`position_${track.id}`, '0');
        await AudioService.seekTo(0);
        await AudioService.play();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    [isSetup],
  );

  /**
   * Play all audio guides in a queue (optionally filtered by section)
   */
  const playAttractionQueue = useCallback(
    async (attraction: Attraction, sectionId?: string) => {
      if (!isSetup) {
        console.warn('Player not setup yet');
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const tracks = await AudioService.loadAttractionQueue(attraction, sectionId);
      
      if (tracks.length > 0) {
        const firstTrack = tracks[0];
        
        // Always start queue from the beginning of the first track
        setState(prev => ({
          ...prev,
          currentTrack: firstTrack,
          currentAttraction: attraction,
          duration: firstTrack.duration,
          position: 0,
          isLoading: false,
        }));

        // Clear saved position for all tracks in queue and start fresh
        tracks.forEach(track => audioStorage.set(`position_${track.id}`, '0'));
        await AudioService.seekTo(0);
        await AudioService.play();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    [isSetup],
  );

  /**
   * Resume playback
   */
  const play = useCallback(async () => {
    await AudioService.play();
  }, []);

  /**
   * Pause playback
   */
  const pause = useCallback(async () => {
    await AudioService.pause();
  }, []);

  /**
   * Stop playback and clear track
   */
  const stop = useCallback(async () => {
    await AudioService.stop();
    setState(prev => ({
      ...defaultState,
      playbackState: prev.playbackState,
    }));
  }, []);

  /**
   * Seek to position (in seconds)
   */
  const seekTo = useCallback(async (position: number) => {
    await AudioService.seekTo(position);
    setState(prev => ({ ...prev, position }));
  }, []);

  /**
   * Skip forward
   */
  const skipForward = useCallback(async (seconds: number = 15) => {
    await AudioService.skipForward(seconds);
    const position = await AudioService.getPosition();
    setState(prev => ({ ...prev, position }));
  }, []);

  /**
   * Skip backward
   */
  const skipBackward = useCallback(async (seconds: number = 15) => {
    await AudioService.skipBackward(seconds);
    const position = await AudioService.getPosition();
    setState(prev => ({ ...prev, position }));
  }, []);

  /**
   * Skip to next track in queue
   */
  const skipToNext = useCallback(async () => {
    await AudioService.skipToNext();
    // Update state will be handled by PlaybackActiveTrackChanged event
  }, []);

  /**
   * Skip to previous track in queue
   */
  const skipToPrevious = useCallback(async () => {
    await AudioService.skipToPrevious();
    // Update state will be handled by PlaybackActiveTrackChanged event
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (state.isPlaying) {
      await AudioService.pause();
    } else {
      await AudioService.play();
    }
  }, [state.isPlaying]);

  // Update queue info periodically
  useEffect(() => {
    const updateQueueInfo = async () => {
      if (state.currentTrack) {
        const queueSize = await AudioService.getQueueSize();
        const currentTrackIndex = await AudioService.getCurrentTrackIndex();
        setState(prev => ({
          ...prev,
          queueSize,
          currentTrackIndex,
          hasPreviousTrack: queueSize > 1 && currentTrackIndex !== null && currentTrackIndex > 0,
          hasNextTrack: queueSize > 1 && currentTrackIndex !== null && currentTrackIndex < queueSize - 1,
        }));
      }
    };

    updateQueueInfo();
  }, [state.currentTrack]);

  const contextValue: AudioPlayerContextType = {
    ...state,
    playTrack,
    playAttractionQueue,
    play,
    pause,
    stop,
    seekTo,
    skipForward,
    skipBackward,
    skipToNext,
    skipToPrevious,
    togglePlayPause,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

/**
 * Hook to access the audio player context
 */
export function useAudioPlayer(): AudioPlayerContextType {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      'useAudioPlayer must be used within an AudioPlayerProvider',
    );
  }
  return context;
}

/**
 * Hook to check if mini player should be visible
 */
export function useMiniPlayerVisible(): boolean {
  const { currentTrack } = useAudioPlayer();
  return currentTrack !== null;
}
