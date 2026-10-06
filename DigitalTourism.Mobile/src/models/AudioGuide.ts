export interface AudioSegment {
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string; // transcription text for this segment
}

export interface AudioGuide {
  id: string;
  title: string; // e.g., "Main Tour", "Architecture Details", "History Deep Dive"
  description?: string; // Short description of what this guide covers
  url: string;
  duration: number; // in seconds
  transcription: AudioSegment[];
  language: string; // ISO 639-1 code (e.g., 'en', 'bg')
  fileSize: number; // in bytes
  hasDRM: boolean;
  isLocalAsset?: boolean; // true if bundled with app for offline use
  order: number; // Order within the section
}

export interface AudioGuideSection {
  id: string;
  title: string; // e.g., "Overview", "Detailed Tours", "Special Features"
  description?: string; // Description of the section
  guides: AudioGuide[]; // Multiple audio guides in this section
  order: number; // Order of sections
}
