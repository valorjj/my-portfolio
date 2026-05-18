export const profile = {
  name: 'Jeongjin Kim',
  role: 'Backend Developer',
  tagline:
    'Java & Kotlin backend developer — async composition, multi-tenant systems, and integrations with rigid upstream services.',
  email: 'valorjj@gmail.com',
  github: 'https://github.com/valorjj',
  linkedin: 'https://www.linkedin.com/in/jeongjin-kim/',
} as const;

export type Profile = typeof profile;
