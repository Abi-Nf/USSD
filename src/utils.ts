import type {Menu, Option} from "./types";

const displayOptions = (options: Option[]): string => {
  switch (options.length) {
    case 0:
    case 1:
      return '';
    default:
      return '\n' + options
      .map((option, index) => `${index + 1}. ${option.name}`)
      .join('\n')
  }
}

export const displayMenu = (menu: Menu): string => {
  return `${menu.title}${displayOptions(menu.options)}`;
}

export const extraPrompt = (
  length: number,
  optionsLength: number,
  backInputNavigation: string,
  initialInputNavigation: string
): string => {
  if (length === 1 || optionsLength === 1) return '';
  const display = [
    '---',
    `${backInputNavigation}. Précedent`
  ];

  if (length > 2) {
    display.push(`${initialInputNavigation}. Menu principal`);
  }

  return '\n' + display.join('\n');
}