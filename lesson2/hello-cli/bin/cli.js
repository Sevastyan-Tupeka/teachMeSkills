#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");
const pkg = require("../package.json");

const argv = process.argv.slice(2);
const [command, ...rest] = argv;

const CONFIG_PATH = path.join(os.homedir(), ".hello-cli.json");

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), "utf-8");
}

function printHelp() {
  console.log("Использование:");
  console.log(" hello <комнада> [опции]\n");
  console.log("Команды");
  console.log(" help                    Показать помощь");
  console.log(" init                    Создать или обновить конфиг");
  console.log(" greet [--name | -n]     Поздороваться");
  console.log(" add [ a b c ...]        Сложить числа ");
  console.log(" now                     Показать текущие дату и время");
  console.log(" version                 Показать версию CLI");
  console.log(" config get              Показать конфиг");
  console.log(" config set <key><value> Показать значения в конфиге");
}

function parseFlags(args) {
  const flags = { _: [] };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-n" || a === "--name") {
      flags.name = args[i + 1];
      i++;
    } else if (a.startsWith("--name")) {
      flags.name = a.split("=")[1];
    } else if (a.startsWith("-")) {
      if (!flags.unknown) flags.unknown = [];
      flags.unknown.push(a);
    } else {
      flags._.push(a);
    }
  }
  return flags;
}

async function promt(quastion) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await new Promise((resolve) => rl.question(quastion, resolve));
  rl.close();
  return answer;
}

async function main() {
  if (
    !command ||
    command === " help" ||
    rest.includes("-h") ||
    rest.includes("--help")
  ) {
    return printHelp();
  }

  const flags = parseFlags(rest);
  if (flags.unknown && flags.unknown.length) {
    console.log(
      `Предупреждение: неизвестные флаги ${flags.unknown.join(", ")}`
    );
  }
  const cfg = loadConfig();

  switch (command) {
    case "version": {
      console.log(pkg.version);
      break;
    }
    case "now": {
      console.log(new Data().toString());
      break;
    }
    case "init": {
      let name = flags.name;
      if (!name) {
        name = await promt("Как к вам обращатся?");
      }
      const next = { ...cfg, name };
      saveConfig(next);
      console.log(`Готов Конфиг сохранён в ${CONFIG_PATH}`);
      break;
    }
    case "greet": {
      const name = flags.name || cfg.name || "пользователь";
      console.log(`Привет ${name}!`);

      if (!cfg.name && !flags.name) {
        console.log(
          "Подсказка: сохраните имя командой init `hello init --name Иван`"
        );
      }
      break;
    }

    case "add": {
      let nums = flags._.length ? flags._ : null;
      if (!nums) {
        const line = await promt("Введите числа через пробел: ");
        nums = line.split(/\s+/).filter(Boolean);
      }
      const values = nums.map(Number);
      if (values.some(Number.isNaN)) {
        console.error("Ошибка: все аргументы должны быть числами");
        process.exitCode = 1;
        return;
      }

      const sum = values.reduce((a, b) => a + b, 0);
      console.log(`Сумма :${sum}`);
      break;
    }
    case "config": {
      const subCom = rest[0];
      if (subCom === "get") {
        console.log(`Конфиг : ${JSON.stringify(cfg)}`);
      } else if (subCom === "set") {
        const [key, val] = rest.slice(1);
        cfg[key] = val;
        saveConfig(cfg);
        console.log(`Вы обновили значения в конфиге: ${key} = ${val}`);
      } else {
        console.error(`Неизвестная подкоманда: ${subCom}`);
      }
      break;
    }

    default: {
      console.log(`Неизвестная команда ${command}`);
      printHelp();
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.log(e.stack || String(e));
  process.exit();
});
