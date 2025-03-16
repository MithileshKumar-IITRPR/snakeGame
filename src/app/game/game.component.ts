import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  boardSize = 20;
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = 'RIGHT';
  gameInterval: any;
  score = 0;
  user: any;

  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.router.navigate(['/login']);
    }
    this.spawnFood();
    this.startGame();
  }

  startGame() {
    this.gameInterval = setInterval(() => this.moveSnake(), 200);
  }

  @HostListener('window:keydown', ['$event'])
  changeDirection(event: KeyboardEvent) {
    const keyMap: { [key: string]: string } = { 
      ArrowUp: 'UP', 
      ArrowDown: 'DOWN', 
      ArrowLeft: 'LEFT', 
      ArrowRight: 'RIGHT' 
    };
    if (keyMap[event.key]) {
      this.direction = keyMap[event.key];
    }
  }

  moveSnake() {
    let head = { ...this.snake[0] };
    if (this.direction === 'UP') head.y--;
    if (this.direction === 'DOWN') head.y++;
    if (this.direction === 'LEFT') head.x--;
    if (this.direction === 'RIGHT') head.x++;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    if (this.checkCollision(head)) {
      clearInterval(this.gameInterval);
      alert('Game Over! Your score: ' + this.score);
      // this.gameService.saveScore(this.user.id, this.score).subscribe(() => {
        this.router.navigate(['/score-board']);
      // });

    } else {
      this.snake.unshift(head);
    }
  }

  checkCollision(head: any): boolean {
    return (
      head.x < 0 || head.x >= this.boardSize ||
      head.y < 0 || head.y >= this.boardSize ||
      this.snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
  }

  spawnFood() {
    let newFoodPosition = { x: 0, y: 0 };
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * this.boardSize),
        y: Math.floor(Math.random() * this.boardSize)
      };
    } while (this.isSnakeBody(newFoodPosition.x, newFoodPosition.y));
    this.food = newFoodPosition;
  }

  isSnakeBody(x: number, y: number): boolean {
    return this.snake.some(segment => segment.x === x && segment.y === y);
  }

  isFood(x: number, y: number): boolean {
    return this.food.x === x && this.food.y === y;
  }

  get rows() {
    return Array(this.boardSize).fill(0);
  }

  get cols() {
    return Array(this.boardSize).fill(0);
  }
}
