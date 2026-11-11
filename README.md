# Pixel Derby
A responsive, playable 8-horse arcade racing game. Virtual credits only.

## Run
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`

## Structure
- `src/game.ts`: horse configurations, seeded simulation, bet validation and payout calculation.
- `src/pixel.ts`: procedural pixel-art sprites and layered racecourse renderer.
- `src/main.tsx`: React interface, Canvas animation, local persistence and Web Audio effects.
- `src/style.css`: responsive racing-terminal design.
- `src/game.test.ts`: deterministic simulation and betting tests.

New players receive 10,000 credits. Confirmed bets reserve credits immediately and may be removed or edited before racing. The displayed decimal odds include stake return. Each new race receives a random seed; the simulation precomputes monotonic 50ms position samples and crossing times used by both the animation and settlement. Replays never settle bets again. Progress is saved locally on this browser. Audio is opt-in and starts following user interaction.

## Local Friends Mode
Choose **FRIENDS MODE / CUSTOM HORSES** on the title screen or **CUSTOMIZE** above the race. Add up to eight named players; each new wallet starts at 10,000 virtual credits. Rename all eight horses, or use **NAME HORSES AFTER PLAYERS** to copy your player names to the first horses. Switch player tabs to place bets from individual wallets, mark players ready, and start a shared race. Results show each player's stake, return, and net gain/loss. Removing a player is blocked while they have pending bets. Profiles, custom horse names, wallets, and pending bets save locally. This is pass-and-play on one device, not an online room.

`src/party.ts` handles multi-wallet settlement, with regression coverage in `src/party.test.ts`.
