import { getMapState } from './src/app/game/actions';

async function test() {
  const state = await getMapState();
  console.log(JSON.stringify(state, null, 2));
}

test();
