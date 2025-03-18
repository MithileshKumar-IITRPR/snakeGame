import { Component } from '@angular/core';
import { GameService } from '../service/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent {
  scores: any[] = [];

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.gameService.getScores().subscribe((data:any) => {
      this.scores = data;
    },(error: any) => {
      alert('Something went wrong!');
    });
  }

  playGame(mode:string) {
    if (['easy', 'medium', 'hard'].includes(mode)) {
      this.router.navigate(['/game', mode]);
    }
  }
}
