<div align="center">
  <h1>🚀 Vybe 🎬🍿</h1>
  <p><strong>AI-Powered Movie & TV Show Recommendation Platform</strong></p>
  <p>Full-Stack • Dockerized • Production Ready</p>
</div>

---

## 📁 About This Repo

This is the **combined, dockerized version** of Vybe that bundles Frontend, Backend, and ML Engine into a single repository for seamless local development and deployment.

> **Legacy individual repos:**
> - 🔗 [itzmk06/vybe-react-auth-ver](https://github.com/itzmk06/vybe-react-auth-ver) — Frontend
> - 🔗 [itzmk06/vybe-express](https://github.com/itzmk06/vybe-express) — Backend

---

## 🚀 Quick Start

```bash
git clone https://github.com/itzmk06/vybe_prod.git
cd vybe_prod
docker-compose up --build
```

| Service | Local URL |
|---------|-----------|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| ML Recommender | http://localhost:8501 |

---

## 🌍 Live Deployment

- **ML Recommender:** [jet15fuze-vybe.hf.space](https://jet15fuze-vybe.hf.space/)

---

## 🔑 Environment Variables

Create `.env` in `server/`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=your_redis_url
```

---

## 🛠️ Tech Stack

<div align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />

</div>

**Recommendation Engine:** Cosine Similarity (Content-Based Filtering)

---

**⭐ Star the repo if you find it useful!**
