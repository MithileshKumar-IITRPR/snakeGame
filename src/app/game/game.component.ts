import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  boardSize = 20;
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = 'RIGHT';
  gameInterval: any;
  score = 0;
  userName: any;
  userId: any;
  mode: string = 'easy'; // will be set from route parameter
  baseSpeed = 200; // base interval in milliseconds
  walls: Array<{ x: number, y: number }> = [];

  constructor(private router: Router, private gameService: GameService, private route: ActivatedRoute) { }

  ngOnInit() {
    const userStr = localStorage.getItem('userName');
    const userIdStr = localStorage.getItem('userId');
    if (userStr && userIdStr) {
      this.userName = JSON.parse(userStr);
      this.userId = JSON.parse(userIdStr);
    } else {
      this.router.navigate(['/login']);
    }

    // Get mode from route parameter
    this.route.paramMap.subscribe(params => {
      const modeParam = params.get('mode');
      if (modeParam && ['easy', 'medium', 'hard'].includes(modeParam)) {
        this.mode = modeParam;
      }
    });

    this.spawnFood();
    this.startGame();
  }

  startGame() {
    this.gameInterval = setInterval(() => this.moveSnake(), this.getCurrentSpeed());
  }

  resetGameInterval() {
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.moveSnake(), this.getCurrentSpeed());
  }

  // Speed is constant for easy, decreases (faster game) as score increases for medium and hard
  getCurrentSpeed(): number {
    if (this.mode === 'easy') {
      return this.baseSpeed;
    } else {
      return Math.max(50, this.baseSpeed - this.score * 10);
    }
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
      // In hard mode, generate new walls on every food eat
      if (this.mode === 'hard') {
        this.generateWalls();
      }

      this.spawnFood();

      if (this.mode !== 'easy') {
        this.resetGameInterval();
      }
    } else {
      this.snake.pop();
    }

    // For hard mode, check collision with walls
    if (this.mode === 'hard' && this.walls.some(w => w.x === head.x && w.y === head.y)) {
      this.endGame();
      return;
    }

    if (this.checkCollision(head)) {
      this.endGame();
      return;
    }
    this.snake.unshift(head);
  }

  checkCollision(head: any): boolean {
    return (
      head.x < 0 || head.x >= this.boardSize ||
      head.y < 0 || head.y >= this.boardSize ||
      this.snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
  }

  spawnFood() {
    if (this.mode === 'hard') {
      this.generateWalls();
    }
    let newFoodPosition = { x: 0, y: 0 };
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * this.boardSize),
        y: Math.floor(Math.random() * this.boardSize)
      };
    } while (this.isSnakeBody(newFoodPosition.x, newFoodPosition.y) ||
      (this.mode === 'hard' && this.walls.some(w => w.x === newFoodPosition.x && w.y === newFoodPosition.y))
    );
    this.food = newFoodPosition;
  }

  generateWalls() {
    this.walls = [];
    const numWalls = 5;
    const head = this.snake[0];

    let forbiddenCells: Array<{ x: number, y: number }> = [];
    if (this.direction === 'UP') {
      forbiddenCells = [
        { x: head.x, y: head.y - 1 },
        { x: head.x, y: head.y - 2 },
        { x: head.x, y: head.y - 3 }
      ];
    } else if (this.direction === 'DOWN') {
      forbiddenCells = [
        { x: head.x, y: head.y + 1 },
        { x: head.x, y: head.y + 2 },
        { x: head.x, y: head.y + 3 }
      ];
    } else if (this.direction === 'LEFT') {
      forbiddenCells = [
        { x: head.x - 1, y: head.y },
        { x: head.x - 2, y: head.y },
        { x: head.x - 3, y: head.y }
      ];
    } else if (this.direction === 'RIGHT') {
      forbiddenCells = [
        { x: head.x + 1, y: head.y },
        { x: head.x + 2, y: head.y },
        { x: head.x + 3, y: head.y }
      ];
    }

    for (let i = 0; i < numWalls; i++) {
      let wall: any;
      let attempts = 0;
      do {
        wall = {
          x: Math.floor(Math.random() * this.boardSize),
          y: Math.floor(Math.random() * this.boardSize)
        };
        attempts++;
        if (attempts > 100) break;
      } while (
        this.snake.some(s => s.x === wall.x && s.y === wall.y) ||
        forbiddenCells.some(fc => fc.x === wall.x && fc.y === wall.y)
      );
      this.walls.push(wall);
    }
  }

  endGame() {
    clearInterval(this.gameInterval);
    alert('Game Over! Your score: ' + this.score);
    this.gameService.saveScore(this.userId, this.score, this.mode).subscribe(() => {
      this.router.navigate(['/score-board']);
    });
  }

  isSnakeBody(x: number, y: number): boolean {
    return this.snake.some(segment => segment.x === x && segment.y === y);
  }

  isFood(x: number, y: number): boolean {
    return this.food.x === x && this.food.y === y;
  }


  isWall(x: number, y: number): boolean {
    if (this.mode !== 'hard') return false;
    return this.walls.some(w => w.x === x && w.y === y);
  }

  get rows() {
    return Array(this.boardSize).fill(0);
  }

  get cols() {
    return Array(this.boardSize).fill(0);
  }
}
