import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userName: string = '';

  constructor(private router: Router, private gameService: GameService) {}
  ngOnInit(): void {
    const userStr = localStorage.getItem('userName');
    const userIdStr = localStorage.getItem('userId');
    if (userStr && userIdStr) {
      this.router.navigate(['/score-board']);
    }
  }

  login() {
    if (this.userName.trim()) {
      this.gameService.login(this.userName.trim()).subscribe((data)=>{
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', JSON.stringify(data.userName));
        localStorage.setItem('userId', JSON.stringify(data.id));
        this.router.navigate(['/score-board']);
      }, (error: any) => {
        alert('Something went wrong! Please try again.');
      })
    }
  }
}
