import { useCallback, useEffect, useState } from 'react';
import type { LessonStatus, LessonSummary, Module } from '@/types/lesson';
import { getModulesWithLessons } from '../services/lessonsService';
import { getAllProgress } from '../services/progressService';

export interface RoadmapLesson extends LessonSummary {
  status: LessonStatus;
}

export interface RoadmapModule {
  module: Module;
  lessons: RoadmapLesson[];
}

interface RoadmapState {
  modules: RoadmapModule[];
  isLoading: boolean;
}

/**
 * The first lesson with status other than 'completed' is the one
 * "Continue learning" should resume — including the very first lesson
 * overall when nothing has been started yet. Exported standalone so the
 * Home dashboard can reuse it without subscribing to the rest of the
 * roadmap's render state.
 */
export function findNextLesson(modules: RoadmapModule[]): RoadmapLesson | null {
  for (const { lessons } of modules) {
    const next = lessons.find((lesson) => lesson.status !== 'completed');
    if (next) return next;
  }
  return null;
}

export function useRoadmap(refreshKey: number = 0) {
  const [state, setState] = useState<RoadmapState>({ modules: [], isLoading: true });

  const load = useCallback(async () => {
    const [modulesWithLessons, progressMap] = await Promise.all([
      getModulesWithLessons(),
      getAllProgress(),
    ]);

    const modules: RoadmapModule[] = modulesWithLessons.map(({ module, lessons }) => ({
      module,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        status: progressMap.get(lesson.id)?.status ?? 'not_started',
      })),
    }));

    return modules;
  }, []);

  useEffect(() => {
    let isMounted = true;

    load().then((modules) => {
      if (!isMounted) return;
      setState({ modules, isLoading: false });
    });

    return () => {
      isMounted = false;
    };
  }, [load, refreshKey]);

  const reload = useCallback(() => {
    load().then((modules) => {
      setState({ modules, isLoading: false });
    });
  }, [load]);

  return { ...state, reload };
}
