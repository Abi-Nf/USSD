import * as console from "node:console";
import * as process from "node:process";
import {clear, prompt} from "./cli";
import type {Context, Data, Menu, Option} from "./types";
import {displayMenu, extraPrompt} from "./utils";

const handleMenu = (
  context: Context,
  input: string,
  options: Option[],
  backInputNavigation: string,
  initialInputNavigation: string
) => {
  input = input.trim();
  if (input.length === 0) return;

  if (options.length === 0) return;

  if (options.length === 1) {
    options[0]?.action(context, input);
    return;
  }

  if (input === backInputNavigation && options.length) {
    context.goBack();
    return;
  }

  if (input === initialInputNavigation) {
    context.goToInitial();
    return;
  }

  const index = Number.parseInt(input) - 1;
  options[index]?.action(context, input);
}

class Ussd implements Context {
  private history: Menu[] = [];
  private data: Record<string, Data> = {};

  constructor(
    private backInputNavigation: string,
    private initialInputNavigation: string
  ) {}

  getData(key: string): Data | undefined {
    return this.data[key];
  }

  goToInitial(): void {
    clear();
    const values = this.history.splice(0);
    if (values.length === 0) return;
    this.openMenu(values[0]!);
  }

  goBack(): void {
    clear();
    this.history.pop();
    const value = this.history.pop();
    if (value === undefined) return;
    this.openMenu(value);
  }

  async openMenu(menu: Menu): Promise<void> {
    try {
      clear();
      this.history.push(menu);
      menu?.onLoad?.(this);

      const promptMsg = displayMenu(menu) +
        extraPrompt(
          this.history.length,
          menu.options.length,
          this.backInputNavigation,
          this.initialInputNavigation
        );

      const input = await prompt(promptMsg);

      handleMenu(
        this,
        input,
        menu.options,
        this.backInputNavigation,
        this.initialInputNavigation
      );
    } catch {
      this.stop();
    }
  }

  register(data: Record<string, Data>): void {
    this.data = Object.assign(this.data, data);
  }

  reset(): void {
    this.history = [];
    this.data = {};
  }

  stop(message?: string): void {
    clear();
    this.reset();
    if (message !== undefined) {
      console.log(message);
    }
    process.exit(0);
  }

  set<T = Data>(key: string, defaultValue: T, callback: (prev: T) => T) {
    const value = this.data[key] ?? defaultValue;
    this.data[key] = callback(value as T) as Data;
  }

  removeData(key: string) {
    this.data[key] = undefined as unknown as Data;
  }
}

export const startUssd = (menu: Menu) => {
  const ussd = new Ussd(
    '0',
    '00'
  );

  ussd.openMenu(menu);
}
