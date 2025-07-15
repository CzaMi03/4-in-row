# Completed Tasks

- Initial Connect Four game implementation (board, logic, UI)
- Added nickname modal and fixed game start logic
- Show winner's nickname in win notification
- Improved bot logic (bot tries to win or block)
- Added toggle for bot enable/disable in nickname modal

# Tasks to do

- create system highscore when game is over and the one of player win the game then in the database saved thee score the player who win and his nickname (score this is number movements he did). To UI add tabel highscore witch is sorted from min to max number (history movemenst must be download from db). Use postgre and API, avoid using queries in the code.
- player must randomly start the game, like no only first player who is a red but you start the game and you dont know who start

- save only min higscore moves player with the same nickname, dont save all of moves

- when players choose the nicknames on the left site create tabel with top 5 players with the best highscore 

- after win show the players for 10 seconds gameboard with they moves and after 10 seconds show this tabel with highscore 

- create meter of moves for the players to show how many moves they do

- create the second gamemode with limit time for 2 minuts to each players for win the game. When the times out this player who use all of time lose the game.

- create the line to connect the circles after win to show how player win the game