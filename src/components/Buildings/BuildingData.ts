import { BuildingConfig } from "@/types/building";

export const BUILDINGS: BuildingConfig[] = [
  {
    id: "modcodes-hq",
    name: "MODCODES HQ",
    subtitle: "Flagship Project",
    position: [0, 0, 0],
    scale: [2.8, 4.5, 2.8],
    color: "#e8d5c4",
    emissive: "#ffd700",
    roofColor: "#8b7355",
    windowPattern: "grid",
    content: {
      title: "MODCODES",
      subtitle: "Flagship Product",
      paragraphs: [
        "MODCODES is not a project. It is a product.",
        "An AI-powered student productivity platform designed to solve real academic problems: missed assignments, deadline chaos, disorganized planning.",
        "Built with Python, FastAPI, SQLite, Ollama local LLMs, speech recognition, and text-to-speech.",
        "Currently in Beta. Not a prototype. Not a concept. A working product that students actually use.",
      ],
      tags: ["Python", "FastAPI", "SQLite", "Ollama", "Speech Recognition"],
      links: [
        { label: "Website Coming Soon", url: "#", icon: "rocket" },
      ],
    },
  },
  {
    id: "project-factory",
    name: "Project Factory",
    subtitle: "Shipped Work",
    position: [-6, 0, -3],
    scale: [3.5, 2.5, 2.2],
    color: "#d4c5b0",
    emissive: "#4a90d9",
    roofColor: "#6b5b45",
    windowPattern: "stripe",
    content: {
      title: "Project Factory",
      subtitle: "Real Products, Real Clients",
      paragraphs: [
        "Every project in this factory has been shipped, deployed, or delivered.",
        "Vishwanath Insurance Portfolio — a production website delivered to a real client with Google Sheets integration, responsive design, and a consultation workflow.",
        "CodeShortsBot v2 — an autonomous content pipeline that researches topics, generates scripts, creates assets, assembles videos, and prepares YouTube Shorts. No human involvement.",
        "These are not demos. These are products that exist in the real world.",
      ],
      tags: ["Next.js", "Google Sheets", "FFmpeg", "Playwright", "Ollama"],
      links: [
        {
          label: "View Vishwanath Insurance",
          url: "https://vishwanath-malusare.vercel.app",
          icon: "external",
        },
      ],
    },
  },
  {
    id: "achievement-tower",
    name: "Achievement Tower",
    subtitle: "Evidence & Recognition",
    position: [6, 0, -2],
    scale: [1.8, 5.5, 1.8],
    color: "#f0e6d8",
    emissive: "#ffd700",
    roofColor: "#a08060",
    windowPattern: "dots",
    content: {
      title: "Achievement Tower",
      subtitle: "What I Have Earned",
      paragraphs: [
        "Best Performing Intern at Kaevron Technologies — not for attendance, but for building automation systems, delivering projects, and demonstrating ownership.",
        "SIH-2025 Special Recognition — led a first-year team with zero prior hackathon experience to win recognition against senior competitors.",
        "1 client website delivered and deployed. Not planned. Not mocked. Delivered.",
        "Everything here is evidence. Not claims.",
      ],
      tags: [
        "Kaevron Technologies",
        "Best Intern",
        "SIH-2025",
        "Client Delivery",
      ],
      links: [],
    },
  },
];
