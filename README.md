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
