import type {Context, Menu} from "./types";

export const mainMenu = (
  phoneNumber: string,
  currentSold: number
): Menu => {
  const title = [
    `Numero: ${phoneNumber}`,
    `Compte principal: ${currentSold.toLocaleString()}Ar`,
    'Vos soldes au #321#'
  ].join('\n');

  return {
    title,
    options: [
      {
        name: 'Recharger',
        action: (context) => context.openMenu(rechargeMenu())
      },
      {
        name: 'Mon compte',
        action: (context) => context.openMenu(accountMenu())
      },
    ]
  }
}

export const creditCardCharge = (): Menu => {
  return {
    title: 'Entrez le code à 14 chiffres',
    options: [
      {
        name: 'code',
        action: (context, input) => {
          if(input === undefined) return;
          const value = Number.parseInt(input!.trim()).toString();
          if (value.length === 14) {
            context.stop("Vous avez été crédité de 1000Ar");
          } else {
            context.stop();
          }
        }
      }
    ]
  }
}

export const debtPackageOffer = (): Menu => {
  const action = (context: Context) => context.stop('Votre demande a été confirmé');

  return {
    title: 'Choisissez un solde',
    options: [
      {
        name: '200Ar',
        action
      },
      {
        name: '500Ar',
        action
      },
      {
        name: '1000Ar',
        action
      },
      {
        name: '3000Ar',
        action
      }
    ]
  }
}

export const rechargeMenu = (): Menu => {
  return {
    title: 'Rechargez votre crédit',
    options: [
      {
        name: 'Par carte a gratter',
        action: (context) => context.openMenu(creditCardCharge())
      },
      {
        name: 'Lany credit',
        action: (context) => context.openMenu(debtPackageOffer())
      }
    ]
  }
}

export const accountMenu = (): Menu => {
  return {
    title: 'Votre compte',
    onLoad: (context) => context.removeData('transferTarget'),
    options: [
      {
        name: 'Voir mon solde',
        action: (context) => context.stop('Vous êtes foché')
      },
      {
        name: "Transférer de l'argent",
        action: (context) => context.openMenu(transferMenu())
      },
    ]
  }
}

const transferMenu = (): Menu => {
  return {
    title: 'Entrez le numero du destinataire',
    onLoad: (context) => context.removeData('transferCode'),
    options: [
      {
        name: 'numero',
        action: (context, input) => {
          if (input === undefined) {
            context.stop();
            return;
          }

          try {
            const number = Number.parseInt(input!);
            context.register({ transferTarget: number });
            return context.openMenu(secretCodeMenu());
          }catch {
            context.stop();
          }
        }
      }
    ]
  }
}

const secretCodeMenu = (): Menu => {
  return {
    title: 'Entrez votre code secret',
    options: [
      {
        name: 'code',
        action: (context, input) => {
          if (input === undefined) {
            context.stop();
            return;
          }

          input = input?.trim() ?? '';
          if (input.length === 0) {
            context.stop();
            return;
          }

          context.register({ transferCode: input });
          return context.openMenu(transferMoney());
        }
      }
    ]
  }
}

const transferMoney = (): Menu => {
  return {
    title: 'Entrez le montant à transferer',
    options: [
      {
        name: 'montant',
        action: (context, input) => {
          if (input === undefined) {
            context.stop();
            return;
          }
          try {
            const target = context.getData('transferTarget');
            const code = context.getData('transferCode');
            const amount = Number.parseInt(input);
            if (target !== undefined && code !== undefined) {
              context.stop(`Une transaction faite vers ${target}, avec un montant de ${amount.toLocaleString()}Ar`);
            } else {
              context.stop();
            }
          } catch {
            context.stop();
          }
        }
      }
    ]
  }
}