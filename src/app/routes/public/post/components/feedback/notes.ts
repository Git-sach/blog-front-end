interface Note {
  name: string;
  svgPath: string;
  isActive: boolean;
}

export const NOTES: Note[] = [
  {
    name: 'Désastreux',
    svgPath: 'assets/svg/desastreux.svg',
    isActive: false,
  },
  {
    name: 'Pas térible',
    svgPath: 'assets/svg/pasterible.svg',
    isActive: false,
  },
  {
    name: 'Bien',
    svgPath: 'assets/svg/bien.svg',
    isActive: false,
  },
  {
    name: 'Très bien',
    svgPath: 'assets/svg/tresbien.svg',
    isActive: false,
  },
  {
    name: 'Incroyable',
    svgPath: 'assets/svg/incroyable.svg',
    isActive: true,
  },
];
