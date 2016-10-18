local-sync-frontify
===================

This package provides automatic synchronisation between patterns and assets folder to a Frontify project


## Installation
---------------

Installing globally will give you access to the `local-sync-frontify` command anywhere on your system
```
npm install -g local-sync-frontify
```

You can also add `local-sync-frontify` to your `package.json` file
```
npm install local-sync-frontify --save-dev
```

## Options
------------------

`local-sync-frontify` comes with a few **options**.

|Option  | Type | Optional | Notes |
:------------- | :------------------------- | :-----------| :-----------|
| configuration  | String | true | Current path of configuration file
| projectId | String | false | Project id to synchronize |
| accessToken | String | false | Access token provided by Frontify |
| patterns  | String | false | Set the patterns directory to synchronize |
| assets | Array of glob &#124; glob | false | Set the assets directories to synchronize |
| cwd | String  | true | Set the current working directory for local assets |
| target | String  | true | Set the target directory for assets in Frontify project |
| dryRun | Boolean | true | Nothing will be synchronized but prints patterns or assets that will be updated |

## Usage
------------------

Just require the package and pass options to the function
```
var sync = require('local-sync-frontify');
var options = {
  accessToken: "your_frontify_access_token",
  projectId: "your_frontify_project_id",
  patterns: "./patterns",
  assets: "./assets",
}

sync(options);
```

Additionally, you can use a configuration file that can contains all possible options (except `configuration` of course)


```
#configuration.json
{
  "accessToken": "your_frontify_access_token",
  "projectId": "your_frontify_project_id",
  "patterns": "./patterns",
  "assets": "./assets",
}
```
```
var sync = require('local-sync-frontify');
var options = {
  configuration: "./configuration.json",
}

sync(options);
```