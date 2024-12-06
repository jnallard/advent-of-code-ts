# Install

npm install

# Create new day

npm run new [day] [year]

* `[day]` will be prompted if not set
* `[year]` will assume to be the current year if not set

Examples:

```console
npm run new

npm run new 5

npm run new 6 2024
```

# Run

npm run problem [day] [year]

* `[day]` will be prompted if not set
* `[year]` will assume to be the current year if not set

Examples:

```console
npm run problem

npm run problem 5

npm run problem 6 2024
```

# If more memory needed 

(if more memory needed)
npx --node-options="--max-old-space-size=16000" ts-node ./2023/day1.ts

TODO: add to run command option