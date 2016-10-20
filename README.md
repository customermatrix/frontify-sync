local-sync-frontify
===================

This package provides automatic synchronisation between local patterns and assets folders to a Frontify project.


## Installation
---------------

Installing globally will give you access to the `local-sync-frontify` command anywhere on your system:  

```
npm install -g local-sync-frontify
```

You can also add `local-sync-frontify` to your `package.json` file:  

```
npm install local-sync-frontify --save-dev
```

## Options
------------------

`local-sync-frontify` comes with a few **options**.    
It's possible to sync only `assets` or `patterns`, but at least one of these options must be set.  

|Option  | Type | Command | Optional | Notes |
:------------- | :------------------------- | :------------------------- | :-----------| :-----------|
| configuration  | String | -c, --configuration | true | Set configuration file source path
| projectId | String | -P, --project-id | false | Set project id |
| accessToken | String | -A, --access-token | false | Set access token |
| patterns  | String | -p, --patterns | false if missing `assets` | Set patterns directory source path |
| assets | Array of glob &#124; glob | -a, --assets | false if missing `patterns` | Set assets directory source path |
| cwd | String  | -C, --cwd | true | Set the current working directory for local assets |
| target | String  | -T, --target | true | Set the target directory for assets in Frontify project |
| dryRun | Boolean | -D, --dry-run | true | Run a fake synchronisation to check for updated items |

## Usage
------------------

#### As a module
------------------

Just require the package and pass options to the function:  

```
var sync = require('local-sync-frontify');
var options = {
  accessToken: "your_frontify_access_token",
  projectId: "your_frontify_project_id",
  patterns: "./patterns",
  assets: "./assets/**/*.*",
}

sync(options);
```

Additionally, you can use a configuration file that can contains all possible options (except `configuration` of course). Please note that options in configuration file will always be overwritten by regular options.  

```
#configuration.json
{
  "accessToken": "your_frontify_access_token",
  "projectId": "your_frontify_project_id",
  "patterns": "./patterns",
  "assets": "./assets/**/*.*",
}
```
```
var sync = require('local-sync-frontify');
var options = {
  configuration: "./configuration.json"
}

sync(options);
```

#### From command line interface
------------------

```
$ local-sync-frontify -A "your_frontify_access_token" -P "your_frontify_project_id" -p "./patterns" -a "./assets/**/*.*"
```

As well, you can set only a configuration file path:  

```
$ local-sync-frontify -c "./configuration.json"
```
