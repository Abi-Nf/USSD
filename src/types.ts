export type Data = string | number | boolean;

export interface Context {
  stop(message?: string): void
  reset(): void
  openMenu(menu: Menu): Promise<void>
  goBack(): void
  goToInitial(): void
  set<T = Data>(key: string, defaultValue: T, callback: (prev: T) => T): void;
  removeData(key: string): void;
  register(data: Record<string, Data>): void
  getData(key: string): Data | undefined
}

export type Option = {
  name: string;
  action: (context: Context, input?: string) => void | Promise<void>;
}

export type Menu = {
  title: string;
  onLoad?: (context: Context) => void;
  options: Option[];
};