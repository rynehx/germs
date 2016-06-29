#Germs

[game_view][link]
[link]: http://rynehx.github.io/germs/

##Overview

Germs is a 2D interactive game coded in javascript. The purpose of the game is too absorb smaller particles by coming in contact and avoid being absorbed by larger particles. The game ends either when the player has absorbed all other entities on the screen or the player is absorbed. Each time the  player increases his/her movement speed, particles are ejected, thus making the player germ smaller.

![show]
[show]: https://s3-us-west-1.amazonaws.com/germ/germs+-+show.png

##Controls

The controls are WASD or directional keys to move. Press r at any time to restart.

##Graphics

The graphics are rendered using HTML canvas. Each individual germ is made using canvas `arc()` method. The background is an image loaded from Amazon's CDN.

##Implementation

The main feature of the game is absorbing other germs. Each time two germs come in contact the bigger germ takes mass (area) from the smaller germ. In order to conserve the transfer of mass (area), the amount of radius change must reflect the mass (area) exchanged from the two germs.

The code below handles the mass balance in the game logic.

`ball1.radius = Math.sqrt(Math.pow(ball1.radius,2) + massExchange);`
`ball2.radius = Math.sqrt(Math.pow(ball2.radius,2) - massExchange);`

Because the both areas are circles, `π` is not needed in the equation.

The germ objects store only the radius. Each time collision occurs, the above equations transfers both to areas and add/subtract the mass exchange quantity from the two areas. The germs are updated with an radius calculated from the resulting area.

##Win

The game is won when all the green germs are absorbed. Each time the player moves, part of the player is ejected. This makes it dangerous to do a lot of maneuvering, as losing size makes other bigger germs threats. The eject particles are blue which do not count toward the green germ count but can be absorbed by other green germs and even absorb the player! The goal is to absorb all the green germs and not be absorb!

The screen shot below shows a scenario where the player almost won.

![almost_won]
[almost_won]: http://rynehx.github.io/germs/
