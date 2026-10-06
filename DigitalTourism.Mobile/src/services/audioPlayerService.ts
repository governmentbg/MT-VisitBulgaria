import TrackPlayer, {
  Capability,
  Event,
  State,
  RepeatMode,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import {Platform} from 'react-native';
import type {AudioGuide} from '../models/AudioGuide';
import type {Attraction} from '../models/Attraction';

// Package name for Android resource URLs
const ANDROID_PACKAGE = 'com.digitaltourism.bulgaria';

/**
 * Resolve audio URL, handling local assets
 * For bundled assets, converts asset:// URLs to platform-specific paths
 */
function resolveAudioUrl(audioGuide: AudioGuide): string {
  const {url, isLocalAsset} = audioGuide;

  if (!isLocalAsset || !url.startsWith('asset:///')) {
    return url;
  }

  // Extract filename from asset:///filename.mp3
  const filename = url.replace('asset:///', '').replace('.mp3', '').toLowerCase();

  if (Platform.OS === 'android') {
    // Android uses raw resources: android.resource://package/raw/filename
    return `android.resource://${ANDROID_PACKAGE}/raw/${filename}`;
  } else {
    // iOS uses bundle resources — TrackPlayer resolves bundle:// paths
    return `bundle:///${filename}.mp3`;
  }
}

/**
 * Track metadata for the audio player
 */
export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork?: string;
  duration: number;
  attractionId: string;
  attractionName: string;
  audioGuide: AudioGuide;
}

let isPlayerSetup = false;

/**
 * Initialize the TrackPlayer service
 * Should be called once when the app starts
 */
export async function setupPlayer(): Promise<boolean> {
  if (isPlayerSetup) {
    return true;
  }

  try {
    await TrackPlayer.setupPlayer({
      // Minimum buffer before playback starts (seconds)
      minBuffer: 15,
      // Maximum buffer size (seconds)
      maxBuffer: 50,
      // Time to buffer while paused (seconds)
      backBuffer: 30,
      // Auto-update now playing notification
      autoUpdateMetadata: true,
    });

    await TrackPlayer.updateOptions({
      // Behavior when app is killed
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      // Capabilities for the notification
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      // Capabilities shown in compact notification view
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      // Icons for the notification (Android)
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      
      progressUpdateEventInterval: 1,
    });

    // Set repeat mode to off by default
    await TrackPlayer.setRepeatMode(RepeatMode.Off);

    isPlayerSetup = true;
    return true;
  } catch (error) {
    console.error('Error setting up TrackPlayer:', error);
    return false;
  }
}

/**
 * Load a track from an attraction's audio guide
 * If the attraction has multiple audio guides, load the first guide from the first section
 * Use loadTrackFromGuide() to load a specific guide
 */
export async function loadTrack(
  attraction: Attraction,
): Promise<AudioTrack | null> {
  // Try new audioGuides structure first
  if (attraction.audioGuides && attraction.audioGuides.length > 0) {
    const firstSection = attraction.audioGuides[0];
    if (firstSection.guides && firstSection.guides.length > 0) {
      return loadTrackFromGuide(attraction, firstSection.guides[0]);
    }
  }

  // Fall back to legacy single audioGuide
  if (!attraction.audioGuide) {
    console.warn('Attraction has no audio guide');
    return null;
  }

  return loadTrackFromGuide(attraction, attraction.audioGuide);
}

/**
 * Load a specific audio guide track
 */
export async function loadTrackFromGuide(
  attraction: Attraction,
  audioGuide: AudioGuide,
): Promise<AudioTrack | null> {
  // Resolve the audio URL (handles local assets)
  const resolvedUrl = resolveAudioUrl(audioGuide);

  const track: AudioTrack = {
    id: audioGuide.id,
    url: resolvedUrl,
    title: audioGuide.title || `Audio Guide: ${attraction.name}`,
    artist: 'Visit Bulgaria',
    artwork: attraction.images?.[0],
    duration: audioGuide.duration,
    attractionId: attraction.id,
    attractionName: attraction.name,
    audioGuide: audioGuide,
  };

  try {
    // Reset the queue and add the new track
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    return track;
  } catch (error) {
    console.error('Error loading track:', error);
    return null;
  }
}

/**
 * Start playback
 */
export async function play(): Promise<void> {
  try {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    
    // If track is at the end (within 1 second), restart from beginning
    if (duration > 0 && Math.abs(position - duration) < 1) {
      await TrackPlayer.seekTo(0);
    }
    
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error playing:', error);
  }
}

/**
 * Pause playback
 */
export async function pause(): Promise<void> {
  try {
    await TrackPlayer.pause();
  } catch (error) {
    console.error('Error pausing:', error);
  }
}

/**
 * Stop playback and clear the queue
 */
export async function stop(): Promise<void> {
  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Error stopping:', error);
  }
}

/**
 * Seek to a specific position (in seconds)
 */
export async function seekTo(position: number): Promise<void> {
  try {
    await TrackPlayer.seekTo(position);
  } catch (error) {
    console.error('Error seeking:', error);
  }
}

/**
 * Skip forward by a number of seconds
 */
export async function skipForward(seconds: number = 15): Promise<void> {
  try {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    const newPosition = Math.min(position + seconds, duration);
    await TrackPlayer.seekTo(newPosition);
  } catch (error) {
    console.error('Error skipping forward:', error);
  }
}

/**
 * Skip backward by a number of seconds
 */
export async function skipBackward(seconds: number = 15): Promise<void> {
  try {
    const position = await TrackPlayer.getPosition();
    const newPosition = Math.max(position - seconds, 0);
    await TrackPlayer.seekTo(newPosition);
  } catch (error) {
    console.error('Error skipping backward:', error);
  }
}

/**
 * Get the current playback state
 */
export async function getState(): Promise<State> {
  return await TrackPlayer.getState();
}

/**
 * Get current position (in seconds)
 */
export async function getPosition(): Promise<number> {
  return await TrackPlayer.getPosition();
}

/**
 * Get track duration (in seconds)
 */
export async function getDuration(): Promise<number> {
  return await TrackPlayer.getDuration();
}

/**
 * Get the current track
 */
export async function getCurrentTrack(): Promise<AudioTrack | null> {
  const trackIndex = await TrackPlayer.getActiveTrackIndex();
  if (trackIndex === null || trackIndex === undefined) {
    return null;
  }
  const track = await TrackPlayer.getTrack(trackIndex);
  return track as AudioTrack | null;
}

/**
 * Get the current track index in the queue
 */
export async function getCurrentTrackIndex(): Promise<number | null> {
  const trackIndex = await TrackPlayer.getActiveTrackIndex();
  return trackIndex ?? null;
}

/**
 * Get the queue of tracks
 */
export async function getQueue(): Promise<AudioTrack[]> {
  try {
    const queue = await TrackPlayer.getQueue();
    return queue as AudioTrack[];
  } catch (error) {
    console.error('Error getting queue:', error);
    return [];
  }
}

/**
 * Get queue size
 */
export async function getQueueSize(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}

/**
 * Skip to next track in queue
 */
export async function skipToNext(): Promise<void> {
  try {
    await TrackPlayer.skipToNext();
  } catch (error) {
    console.error('Error skipping to next:', error);
  }
}

/**
 * Skip to previous track in queue
 */
export async function skipToPrevious(): Promise<void> {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (error) {
    console.error('Error skipping to previous:', error);
  }
}

/**
 * Check if a track is currently playing
 */
export async function isPlaying(): Promise<boolean> {
  const state = await TrackPlayer.getState();
  return state === State.Playing;
}

/**
 * Format time in seconds to MM:SS string
 */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * TrackPlayer events for external listeners
 */
export const AudioPlayerEvents = {
  PlaybackState: Event.PlaybackState,
  PlaybackError: Event.PlaybackError,
  PlaybackTrackChanged: Event.PlaybackActiveTrackChanged,
  PlaybackProgressUpdated: Event.PlaybackProgressUpdated,
  RemotePlay: Event.RemotePlay,
  RemotePause: Event.RemotePause,
  RemoteStop: Event.RemoteStop,
  RemoteSeek: Event.RemoteSeek,
  RemoteNext: Event.RemoteNext,
  RemotePrevious: Event.RemotePrevious,
};

/**
 * Export TrackPlayer state enum for convenience
 */
export {State as PlaybackState};

/**
 * Load a queue of tracks from an attraction's audio guides
 * Useful for playing multiple guides in sequence
 */
export async function loadAttractionQueue(
  attraction: Attraction,
  sectionId?: string,
): Promise<AudioTrack[]> {
  const tracks: AudioTrack[] = [];

  // Handle new audioGuides structure
  if (attraction.audioGuides && attraction.audioGuides.length > 0) {
    const sections = sectionId
      ? attraction.audioGuides.filter(s => s.id === sectionId)
      : attraction.audioGuides;

    for (const section of sections) {
      for (const guide of section.guides) {
        const resolvedUrl = resolveAudioUrl(guide);
        tracks.push({
          id: guide.id,
          url: resolvedUrl,
          title: guide.title || `${section.title} - ${attraction.name}`,
          artist: 'Visit Bulgaria',
          artwork: attraction.images?.[0],
          duration: guide.duration,
          attractionId: attraction.id,
          attractionName: attraction.name,
          audioGuide: guide,
        });
      }
    }
  }
  // Fall back to legacy single audioGuide
  else if (attraction.audioGuide) {
    const resolvedUrl = resolveAudioUrl(attraction.audioGuide);
    tracks.push({
      id: attraction.audioGuide.id,
      url: resolvedUrl,
      title: attraction.audioGuide.title || `Audio Guide: ${attraction.name}`,
      artist: 'Visit Bulgaria',
      artwork: attraction.images?.[0],
      duration: attraction.audioGuide.duration,
      attractionId: attraction.id,
      attractionName: attraction.name,
      audioGuide: attraction.audioGuide,
    });
  }

  if (tracks.length > 0) {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);
    } catch (error) {
      console.error('Error loading queue:', error);
    }
  }

  return tracks;
}
