
export enum SectionId {
  INTRO = 'introduccion',
  PRINCIPIOS = 'principios',
  MODALIDADES = 'modalidades',
  PURIFI = 'purifi',
  PRIMING = 'priming',
  INDICACIONES = 'indicaciones',
  PRESCRIPCION = 'prescripcion'
}

export interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
