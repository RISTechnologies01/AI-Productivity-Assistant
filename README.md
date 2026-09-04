# Capable AI Assistant

Build a modern, responsive AI-powered workplace productivity web application called Capable.

PRODUCT OVERVIEW

Capable is an AI productivity assistant designed for students, interns, graduates, and young professionals who are developing their careers and need help managing everyday academic and workplace tasks.

The platform should combine multiple AI-powered productivity tools into one cohesive dashboard, rather than feeling like separate mini-applications.

The product tagline is:

“Work smarter. Grow capable.”

The overall experience should feel like a polished modern SaaS productivity platform: professional, youthful, intelligent, approachable, and practical.

BRAND IDENTITY

Application name:

Capable

Brand personality:

Intelligent

Professional

Confident

Modern

Helpful

Youthful

Ambitious

Approachable

Primary brand colours:

Vermillion: #E34234

Black: #0A0A0A

Emerald Green: #009B77

Use these colours intentionally rather than covering the entire interface in colour.

Design direction:

Black/dark elements for strong contrast and navigation

Vermillion for primary actions, important highlights, and calls to action

Emerald green for success states, completed tasks, positive indicators, and secondary accents

White/off-white surfaces where appropriate for readability

Clean typography

Rounded cards

Subtle shadows

Generous spacing

Modern SaaS aesthetic

Professional but not corporate or boring

Avoid excessive gradients, excessive glassmorphism, cluttered layouts, cartoonish illustrations, or overly flashy animations.

TARGET USERS

Design specifically for:

University and college students

Interns

Recent graduates

Young professionals

Early-career employees

The interface should be easy enough for a first-time user to understand immediately.

APPLICATION STRUCTURE

Create a responsive application with:

Sidebar Navigation

Display the Capable logo/name at the top.

Navigation:

MAIN

Dashboard

PRODUCTIVITY

Email Studio

Meeting Intelligence

Task Planner

AI TOOLS

Research Assistant

Capable AI

SYSTEM

Settings

Help

The sidebar should remain visible on desktop and collapse into a mobile navigation menu on smaller screens.

DASHBOARD

Create a welcoming dashboard.

Header:

Good morning, [User Name] 👋

Subheading:

What would you like to accomplish today?

Include a prominent AI input/search area:

“What can I help you with?”

Example prompts:

“Write an email to my manager asking for leave.”

“Summarize my meeting notes.”

“Help me plan my day.”

“Explain this topic.”

“Help me prepare for an interview.”

Create feature cards for the five AI tools.

Dashboard cards:

Email Studio
“Create professional emails in seconds.”

Meeting Intelligence
“Turn messy meeting notes into clear summaries and action items.”

Task Planner
“Organize your workload and prioritize what matters.”

Research Assistant
“Understand topics faster with AI-powered research support.”

Capable AI
“Your general-purpose workplace AI assistant.”

Each card should have an icon, short description, and clear CTA.

Also include a small productivity overview section with useful visual indicators such as:

Tasks completed

Emails generated

Meetings summarized

These can initially use realistic placeholder/demo data if persistent analytics are not implemented.

FEATURE 1: EMAIL STUDIO

Create a professional AI email generation interface.

Page title:

Email Studio

Subtitle:

Write better workplace emails in less time.

Inputs:

Recipient / Context

Optional field describing who the email is for.

What do you want to say?

Large text area where the user describes the purpose of the email in natural language.

Example:
“I need to ask my manager if I can work remotely on Friday because I have an appointment.”

Tone

Allow the user to select:

Formal

Friendly

Persuasive

Concise

Apologetic

Length

Short

Medium

Detailed

Generate Email

After generation, display:

Generated Email

Subject

Email body

The generated output must be editable.

Buttons:

Copy

Regenerate

Clear

The AI should produce professional communication while preserving the user's intended meaning.

The AI must not invent important details such as dates, names, commitments, or facts that were not provided.

FEATURE 2: MEETING INTELLIGENCE

Create a meeting notes summarization tool.

Page title:

Meeting Intelligence

Subtitle:

Turn meeting notes into clear, actionable information.

Provide a large text area:

Paste your meeting notes

Allow users to paste long or unstructured notes.

Include a button:

Summarize Meeting

The AI output should be structured into:

Meeting Summary

A concise overview.

Key Decisions

Important decisions made during the meeting.

Action Items

Display as a structured list or table containing:

Task

Responsible person

Deadline

Important Discussion Points

Key topics discussed.

Unresolved Questions

Items requiring further discussion.

Deadlines

Clearly identified deadlines.

If information such as a responsible person or deadline is not provided, display:

Not specified

Do not fabricate missing information.

Allow users to:

Copy summary

Regenerate

Edit output

Clear notes

FEATURE 3: TASK PLANNER

Create an AI-powered task planning interface.

Page title:

Task Planner

Subtitle:

Turn your workload into a realistic plan.

Allow users to enter multiple tasks.

Each task can optionally include:

Task name

Deadline

Estimated duration

Priority

Also allow a simple natural-language input such as:

“I have a report due Friday, a presentation next week, three emails to answer, and a meeting at 10 AM.”

Button:

Build My Plan

The AI should:

Identify individual tasks

Prioritize them

Consider deadlines

Consider estimated effort where available

Organize the tasks into a realistic schedule

Avoid creating impossible schedules

Clearly identify urgent tasks

Display:

Today's Plan

with time blocks.

Also display:

Priority Breakdown

High

Medium

Low

And:

AI Planning Notes

Briefly explain why certain tasks were prioritized.

Allow users to:

Edit tasks

Mark tasks complete

Delete tasks

Regenerate plan

Use emerald green for completed tasks and appropriate visual indicators for priority.

FEATURE 4: RESEARCH ASSISTANT

Create an AI research assistant designed for students and young professionals.

Page title:

Research Assistant

Subtitle:

Understand complex topics faster.

Provide:

Research Topic

Text input.

What do you need?

Allow the user to select:

Explain a topic

Summarize information

Compare concepts

Identify key insights

Generate recommendations

Create study notes

Provide an optional large text area for the user to paste an article, document text, or research material.

Button:

Research with AI

The AI output should be structured into:

Overview

Key Insights

Important Concepts

Opportunities / Applications

Risks or Limitations

Recommendations

When information is uncertain, the AI should clearly communicate uncertainty.

Do not present generated information as verified fact.

Include a visible reminder:

Always verify important information using reliable sources.

FEATURE 5: CAPABLE AI

Create a conversational AI assistant.

Page title:

Capable AI

Subtitle:

Your AI workplace assistant.

Create a clean chat interface with:

User messages

AI responses

Message input

Send button

Clear conversation button

Suggested prompts:

“Help me prepare for a job interview.”

“Help me write a professional LinkedIn message.”

“Explain this technical concept simply.”

“Help me prepare for a presentation.”

“Help me improve my CV.”

“Help me organize my workload.”

The assistant should behave as a workplace productivity assistant.

It should provide practical, concise, professional responses.

AI PROMPT ENGINEERING

Use structured prompts for every AI feature.

Prompts should clearly define:

AI role

User objective

Context

Instructions

Constraints

Expected output format

Safety considerations

Use structured output wherever appropriate.

AI should:

Never knowingly fabricate information

Clearly indicate uncertainty

Not invent missing names, dates, deadlines, sources, or facts

Preserve the user's intended meaning

Avoid making high-stakes professional decisions on the user's behalf

Encourage human review of generated content

RESPONSIBLE AI

Include a visible responsible AI disclaimer throughout the application, preferably in the footer and/or settings/help area.

Use the following message:

Responsible AI Notice

“Capable uses artificial intelligence to generate suggestions and content. AI-generated information may contain errors or inaccuracies. Always review and verify important information before using it for professional, academic, financial, legal, medical, or other important decisions.”

For generated workplace content, clearly communicate that the user remains responsible for reviewing and approving the final output.

UX REQUIREMENTS

The application must be:

Responsive

Mobile-friendly

Desktop-friendly

Accessible

Easy to navigate

Keyboard-friendly

Visually consistent

Every AI feature should follow a consistent structure:

Input → AI Processing → Structured Output → Edit/Copy/Regenerate

Include appropriate:

Loading states

Empty states

Error states

Success states

Disabled button states

Helpful validation messages

Do not allow users to submit completely empty AI requests.

NAVIGATION AND INTERACTION

All sidebar navigation should work.

Feature cards on the dashboard should navigate to the appropriate tool.

Buttons should perform meaningful actions.

Avoid decorative buttons that do nothing.

Users should be able to move between features without losing the overall application context.

VISUAL DESIGN

Create a polished SaaS dashboard.

Use:

Strong visual hierarchy

Clean cards

Consistent spacing

Rounded corners

Modern icons

Clear typography

Subtle hover effects

Smooth but restrained transitions

Use Vermillion primarily for primary actions and important highlights.

Use Emerald Green for:

Completed tasks

Success states

Positive indicators

Secondary accents

Use Black/dark tones for:

Sidebar

Headings

Strong visual anchors

Maintain sufficient colour contrast and accessibility.

The application should look like a real product that could be presented to an employer or investor, not a classroom prototype.

SETTINGS

Create a basic Settings page containing:

Profile name

Theme preference

AI response preferences

Responsible AI information

About Capable

The settings do not need complex backend functionality unless necessary.

HELP

Create a simple Help page explaining:

What Capable does

How each AI tool works

How to write effective prompts

Why users should verify AI-generated information

Responsible AI principles

TECHNICAL EXPECTATIONS

Build the application using a modern, maintainable web architecture.

Keep components modular and reusable.

Use reusable UI components for:

Buttons

Cards

Inputs

Text areas

Navigation

AI output containers

Alerts

Loading states

Modals

Ensure the application can be connected to an AI API/backend where required.

Do not expose API keys or other secrets in client-side code.

DEMO DATA

Include realistic example/demo content so the application looks useful immediately.

However, clearly distinguish demo content from actual user-generated content.

FINAL PRODUCT EXPERIENCE

The final application should feel like one unified platform.

The user should be able to arrive at the dashboard and immediately understand:

What Capable is
→ An AI productivity assistant.

Who it is for
→ Students, interns, graduates, and young professionals.

What it does
→ Helps users communicate, summarize, plan, research, and solve workplace tasks.

The final result should demonstrate:

Practical AI implementation

Strong prompt engineering

Real-world problem solving

Responsible AI usage

Modern UI/UX design

Responsive design

Multiple AI capabilities integrated into one platform

Do not create separate websites for each feature.

Build one cohesive application called Capable.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://grow-capable-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ad1817f4-a733-47e7-b7f8-dfe541ccaf15).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
