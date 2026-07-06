// TypeScript Types for CineVerse

export type Genre =
  | 'Hành động'
  | 'Tình cảm'
  | 'Hài hước'
  | 'Kinh dị'
  | 'Khoa học viễn tưởng'
  | 'Hoạt hình'
  | 'Phiêu lưu'
  | 'Tâm lý'
  | 'Tội phạm'
  | 'Chiến tranh'
  | 'Thể thao'
  | 'Lịch sử'
  | 'Âm nhạc'
  | 'Gia đình';

export type Country = 'Mỹ' | 'Hàn Quốc' | 'Nhật Bản' | 'Trung Quốc' | 'Anh' | 'Pháp' | 'Thái Lan' | 'Việt Nam' | 'Khác';
export type Quality = '4K' | '1080p' | '720p' | '480p';
export type SubtitleType = 'Vietsub' | 'Thuyết minh' | 'Lồng tiếng';
export type MovieType = 'movie' | 'series';
export type MovieStatus = 'completed' | 'ongoing';

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: number; // minutes
  videoUrl: string;
  thumbnail?: string;
  airDate?: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  type: MovieType;
  status: MovieStatus;
  poster: string;
  backdrop: string;
  trailer?: string;
  videoUrl?: string;
  description: string;
  genres: Genre[];
  country: Country;
  year: number;
  duration?: number; // minutes (for movies)
  totalEpisodes?: number; // for series
  currentEpisode?: number; // for ongoing series
  episodes?: Episode[];
  director?: string;
  cast: string[];
  imdbRating?: number;
  rottenRating?: number;
  cvRating: number; // CineVerse community rating
  totalRatings: number;
  totalViews: number;
  quality: Quality[];
  subtitles: SubtitleType[];
  tags: string[];
  isFeatured: boolean;
  isHot: boolean;
  isNew: boolean;
  relatedMovies?: string[]; // IDs
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google' | 'facebook';
  watchlist: string[]; // Movie IDs
  createdAt: string;
}

export interface WatchHistory {
  movieId: string;
  episodeId?: string;
  progress: number; // seconds
  duration: number; // seconds
  watchedAt: string;
}

export interface Comment {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  rating?: number;
  likes: number;
  createdAt: string;
}

export interface FilterOptions {
  genres: Genre[];
  countries: Country[];
  years: number[];
  type: MovieType | 'all';
  sortBy: 'newest' | 'popular' | 'rating' | 'year';
  minRating: number;
}

export type DeviceTier = 'high' | 'medium' | 'low';

export interface CharacterState {
  id: string;
  x: number;
  y: number;
  action: 'idle' | 'walking' | 'eating' | 'waving' | 'surprised' | 'sleeping';
  direction: 'left' | 'right';
  isHovered: boolean;
  showBubble: boolean;
  bubbleText: string;
  skinColor: string;
  hairColor: string;
  clothColor: string;
}
