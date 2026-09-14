import { DailyPracticeItem } from '../types';

export const DEFAULT_EXAM_DATE = '2026-12-05T08:30:00';

export const DEFAULT_DAILY_PRACTICE: DailyPracticeItem[] = [
  {
    id: 'daily-1',
    lessonId: '7s-u1-l1',
    title: '《春》',
    author: '朱自清',
    genre: '现代写景抒情散文',
    bookName: '七年级上册',
    completed: true,
    date: '2026-09-14'
  },
  {
    id: 'daily-2',
    lessonId: '7x-u4-l17',
    title: '《短文两篇（陋室铭/爱莲说）》',
    author: '刘禹锡/周敦颐',
    genre: '文言文',
    bookName: '七年级下册',
    completed: false,
    date: '2026-09-14'
  },
  {
    id: 'daily-3',
    lessonId: '8s-u4-l14',
    title: '《背影》',
    author: '朱自清',
    genre: '叙事散文/小说',
    bookName: '八年级上册',
    completed: false,
    date: '2026-09-14'
  },
  {
    id: 'daily-4',
    lessonId: '8s-u5-l18',
    title: '《中国石拱桥》',
    author: '茅以昇',
    genre: '说明文/新闻/活动',
    bookName: '八年级上册',
    completed: false,
    date: '2026-09-14'
  },
  {
    id: 'daily-5',
    lessonId: '9s-u3-l11',
    title: '《岳阳楼记》',
    author: '范仲淹',
    genre: '文言文',
    bookName: '九年级上册',
    completed: false,
    date: '2026-09-14'
  }
];
