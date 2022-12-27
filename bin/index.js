#!/usr/bin/env node

const yargs = require("yargs");
const { exec } = require("child_process");

let updateCommand = `git submodule foreach git pull || echo 'canceled' && git commit -am 'theme' && git pull ; git push`;
const sequence = [
  'cd themes/osuny-hugo-theme-aaa',
  'git checkout main',
  'git pull',
  'cd ../..',
  'git add .',
  'git commit -m "theme"',
  // 'git push'
]

function chain(commands) {

  exec(commands[0], (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    if (stdout) {
      console.log(`stdout:\n${stdout}`);
    }

    commands.shift()
    if (commands.length > 0) {
      chain(commands);
    }
  });
}

const options = yargs
  .usage('$0 <cmd> [args]')
  .command('update [path]', "update website's theme", (yargs) => {
    yargs.positional('path', {
      type: 'string',
      describe: 'path to website'
    })
  }, (argv) => {

    if (argv.path) {
      updateCommand = `cd ${argv.path} && ${updateCommand}`
    }

    exec(updateCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
  
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
  
      if (stdout) {
        console.log(`stdout:\n${stdout}`);
      }
    });
  })
  .help(true)
  .argv;