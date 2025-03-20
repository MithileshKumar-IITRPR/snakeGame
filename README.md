# Snake Game Frontend

## Overview
This frontend is built with Angular and provides the user interface for the 2D Snake Game. It handles user login, displays a scoreboard, and allows users to choose a game mode (easy, medium, hard) before starting the game. In medium mode, speed of snake increases as score increases. In hard mode, along with dynamic speed of snake, new random walls are generated dynamically on every food consumption.

## Tech Stack
- **Angular** (v15+)
- **TypeScript**
- **HTML/CSS**
- **Angular Router** for navigation
- **Angular Guards & Interceptors** for route protection and JWT handling

## Architecture & Design Patterns
- **Component-Based Architecture:** The UI is modularized into components (Login, Scoreboard, Game).
- **Routing & Guards:** The app uses Angular Router to navigate between pages with an AuthGuard to restrict access.
- **HTTP Interceptors:** Automatically attach JWT tokens to all outgoing HTTP requests.
- **Service Layer:** A centralized GameService handles all API calls.

## Assumptions
- Users log in with just a name.
- JWT tokens are stored in localStorage and used for subsequent API calls.
- The game mode (easy, medium, hard) is passed via routing to the game component.
- Hard mode dynamically generates walls that avoid the snake and the three cells immediately in front of the snake’s head.

## Features Supported
- **Login:** Simple form that logs in the user and stores the JWT token.
- **Scoreboard:** Displays top scores with player names and game modes.
- **Game Modes:**  
  - **Easy:** Constant speed.
  - **Medium:** Speed increases as the score increases.
  - **Hard:** Dynamic wall generation on every food consumption.
- **Route Protection:** AuthGuard ensures that only logged-in users can access the scoreboard and game.

## How to Run
1. **Install Dependencies:**
   - Navigate to the `frontend` folder.
   - Run:
     ```bash
     npm install
     ```
2. **Run the Application:**
   - Start the Angular development server:
     ```bash
     ng serve
     ```
   - Open your browser and go to [http://localhost:4200](http://localhost:4200).