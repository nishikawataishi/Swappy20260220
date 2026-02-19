export interface Question {
  id: number;
  text: string;
  icon: string;
  L: {
    label: string;
    sub: string;
  };
  R: {
    label: string;
    sub: string;
  };
}

export interface TMDbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

export type ResultItem = {
  title: string;
  desc: string;
  image: string;
  matchRate: number;
  tmdbId?: number; // Optional ID for linking 
};

export type SwipeDirection = 'left' | 'right' | 'up';

export interface SwipeAction {
  direction: SwipeDirection;
  questionId: number;
}

export type GameMode = 'select' | 'random';