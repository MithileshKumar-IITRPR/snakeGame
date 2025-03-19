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
  userTopScores:any;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    const userIdx:any = localStorage.getItem('userId');
    this.gameService.getScores().subscribe((data:any) => {
      this.scores = data;
    },(error: any) => {
      alert('Something went wrong!');
    });
    if(userIdx) {
      this.gameService.getModeWiseTopScore(userIdx).subscribe((data:any) => {
        this.userTopScores = data;
      },(error: any) => {
        alert('Something went wrong!');
      });
    }
  }

  playGame(mode:string) {
    if (['easy', 'medium', 'hard'].includes(mode)) {
      this.router.navigate(['/game', mode]);
    }
  }

  getTopScores(mode: string) {
    return this.scores
      .filter(score => score.mode === mode)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
}
