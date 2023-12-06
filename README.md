# install

npm install -g ts-node typescript '@types/node'

# run

npx ts-node 2023/day1.ts

(if more memory needed)
npx --node-options="--max-old-space-size=16000" ts-node ./2023/day1.ts