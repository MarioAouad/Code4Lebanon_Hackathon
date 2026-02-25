<<<<<<< HEAD
# NUMŪ National Monitoring & Analytics Dashboard

## About the Project
[cite_start]This repository contains a web prototype designed to act as a survey-driven analytics engine for the NUMŪ upskilling program[cite: 7, 13]. [cite_start]The primary goal of this system is to help the Ministry understand learner demographics, program discovery channels, learning motivations, and geographic distribution[cite: 8]. 

[cite_start]Rather than just showing charts, this project was built to demonstrate how data can guide national partnerships, outreach strategies, and policy decisions regarding tech and AI upskilling[cite: 9, 253]. 

## Architecture
[cite_start]The system follows a two-tier architecture (backend + frontend) to ensure a scalable and logical data flow[cite: 70, 99]. 

* [cite_start]**Backend (Data Pipeline & Aggregation):** The backend connects to the provided Survey Mock API to fetch the full raw dataset[cite: 27, 28]. [cite_start]It normalizes learner profiles and aggregates the data to support specific frontend filters by dissemination channel, track, learner profile, and region[cite: 29, 30, 31, 32, 33]. [cite_start]It also cross-references secondary data from Microsoft and Oracle to track completion rates and certificate obtention[cite: 23, 24, 25].
* [cite_start]**Frontend (Visualization):** The frontend consumes the processed data from the backend to display actionable insights for policy decision-makers[cite: 99].

## Key Dashboard Features
[cite_start]The dashboard focuses on Policy and Program Monitoring through four main sections[cite: 39]:

* [cite_start]**Dissemination Performance:** Visualizes registrations by channel (Universities, Syndicates, Public Sector, NGOs, Employers) to identify which entities are driving the most traffic[cite: 40, 42, 44].
* [cite_start]**Interest & Strategy Insights:** Analyzes demand for specific tracks (like AI Fundamentals and GenAI) and visualizes learner motivations and challenges[cite: 46, 47, 49, 50].
* [cite_start]**Geographic Insights:** Displays regional distribution to identify underrepresented regions for equity and inclusion tracking[cite: 51, 52, 53].
* [cite_start]**Unified Learner Profile:** A comprehensive view combining survey demographics with training provider status badges[cite: 55, 59, 61].

## The Learning Journey
Building this prototype was a hands-on exercise in structuring data pipelines, handling JSON normalization, and practicing public-sector product thinking. We are actively learning how to build robust data architectures, and this hackathon provided a fantastic opportunity to translate raw mock survey data into a structured format that could genuinely support national policy decisions. 

## Setup Instructions
*(Note: Update this section with your specific commands once your code is finalized!)*

1. Clone the repository:
   `git clone https://github.com/yourusername/numu-analytics-dashboard.git`
2. Navigate to the backend directory and install dependencies:
   `cd backend`
   `pip install -r requirements.txt` *(assuming Python)*
3. Run the backend server.
4. Navigate to the frontend directory, install dependencies, and start the development server.
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> master
