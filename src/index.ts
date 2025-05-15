#!/usr/bin/env node

import { mainMenu } from "./menus";
import {startUssd} from "./ussd";

function main() {
  const menu = mainMenu('032 xx xxx xx', 0);
  startUssd(menu);
}

main();