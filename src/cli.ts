import { terminal } from 'terminal-kit';

terminal.grabInput(true);
terminal.on('key', (name: string) => {
  if (name === 'CTRL_C') {
    terminal.processExit(0);
  }
});

export function clear() {
  terminal.clear()
}

export function prompt(menu: string): Promise<string> {
  return new Promise((resolve, reject) => {
    terminal.blue(menu + '\n');
    terminal.inputField(
      {
        cancelable: true,
      },
      (_, value) => {
        if (value === undefined) {
          reject(new Error('Input is required'));
        } else {
          resolve(value);
        }
      }
    );
  });
}