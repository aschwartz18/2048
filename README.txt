README.txt
Allison Schwartz
Assignment 4
CompSci 20
Prof. Ming Chow

----------------------------------------------------------------------------------------

1. Sections that have been implemented:
	GET /scores.json API
	/ root API

   Sections that have not been implemented:
	POST /submit.json API
	Enabling cross-origin resource sharing
	Deploying to Heroku

2. Discussed the assignment with multiple TA's (Jasper, Conner)

3. Spent approximately 10 hours completing the assignment.

5. Storage:
	Score and grid are both stored and called in the game_manager.js file
	Both are stored in the object GameManager.prototype
	Score is stored as GameManager.prototype.score
	Grid is stored as GameManager.prototype.grid

6. Modifications to the source code:
	Modifications to index.html:
		Added script reference to JQuery in head

	Modifications to game_manager.js:
		After line 37, inserted Ajax post request. Sample code:
		    $.post( "http://localhost:3000/submit.json", {
        		username: usr,
        		score: this.score,
        		grid: this.grid,
      		});

