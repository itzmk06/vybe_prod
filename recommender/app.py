import streamlit as st
import pickle
import requests  
import gzip
movies = pickle.load(gzip.open('movie_list.pkl.gz', 'rb'))
similarity = pickle.load(gzip.open('similarity.pkl.gz', 'rb'))

def fetch_poster(movie_id):
    api_key = st.secrets["TMDB_API_KEY"]
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US"
    data = requests.get(url).json()
    return "https://image.tmdb.org/t/p/w500" + data['poster_path']

def recommend(movie):
    index = movies[movies['title'] == movie].index[0]
    distances = sorted(list(enumerate(similarity[index])), key=lambda x: x[1], reverse=True)
    recommended_movie_names = []
    recommended_movie_posters = []
    recommended_movie_ids = []  # List to store movie IDs

    for i in distances[1:21]:
        movie_id = movies.iloc[i[0]].movie_id
        recommended_movie_names.append(movies.iloc[i[0]].title)
        recommended_movie_posters.append(fetch_poster(movie_id))
        recommended_movie_ids.append(movie_id)  # Save the movie ID for generating the URL

    return recommended_movie_names, recommended_movie_posters, recommended_movie_ids

st.set_page_config(page_title="Vybe.ai", page_icon="🎬", layout="wide")
st.markdown("<h1 style='font-family: Merienda, cursive; color: #ff6f61;'>Vybe.ai</h1>", unsafe_allow_html=True)

movie_list = movies['title'].values
selected_movie = st.selectbox("Type or select a movie from the list", movie_list)

if st.button("Show Recommendations"):
    recommended_movie_names, recommended_movie_posters, recommended_movie_ids = recommend(selected_movie)

    # Get the searched movie's info to display it first
    searched_movie_id = movies[movies['title'] == selected_movie].iloc[0].movie_id
    searched_poster = fetch_poster(searched_movie_id)

    movie_cards = f"""
        <div class="movie-card searched-card">
            <div class="searched-badge">Your Pick</div>
            <img src="{searched_poster}" alt="{selected_movie}" class="movie-poster">
            <div class="text-overlay">
                <div class="movie-title">{selected_movie}</div>
            </div>
        </div>
        """

    for i, (name, poster, movie_id) in enumerate(zip(recommended_movie_names, recommended_movie_posters, recommended_movie_ids)):
        movie_cards += f"""
        <div class="movie-card">
            <img src="{poster}" alt="{name}" class="movie-poster">
            <div class="text-overlay">
                <div class="movie-title">{name}</div>
            </div>
        </div>
        """

    st.components.v1.html(f"""
    <style>
        .movie-container {{
            display: flex;
            flex-wrap: wrap;
            gap: 70px;
            justify-content: center;
            margin-top: 50px;
            margin-bottom: 100px;
            position: relative;
        }}

        .movie-card {{
            width: 250px;
            height: 420px;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            background: linear-gradient(145deg, #2c3e50, #3498db);
            cursor: pointer;
            transition: transform 0.6s ease, opacity 0.5s ease, filter 0.5s ease, box-shadow 0.5s ease;
            background-clip: padding-box;
            opacity: 0;
            filter: blur(5px);
        }}

        .movie-card:hover {{
            transform: scale(1.1);
            opacity: 1;
            filter: blur(0);
        }}

        .movie-poster {{
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease-in-out;
            border-radius: 20px;
        }}

        .text-overlay {{
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: white;
            font-family: 'Merienda', cursive;
            transition: all 0.5s ease;
            opacity: 0;
            padding: 10px;
        }}

        .movie-title {{
            font-size: 1.6rem;
            font-weight: bold;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }}

        .searched-card {{
            box-shadow: 0 0 30px , 0 0 60px !important;
            border: 2px solid rgba(255, 111, 97, 0.8);
        }}

        .searched-badge {{
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff6f61, #ff4d44);
            color: white;
            font-family: 'Merienda', cursive;
            font-size: 0.85rem;
            font-weight: bold;
            padding: 6px 18px;
            border-radius: 20px;
            z-index: 10;
            box-shadow: 0 4px 15px rgba(255, 111, 97, 0.5);
            letter-spacing: 1px;
        }}

        .searched-card .movie-title {{
            background: linear-gradient(135deg, #ff6f61, #ff4d44);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}

.movie-card:hover .text-overlay {{
            opacity: 1;
        }}

        .movie-card:hover .movie-title {{
            opacity: 1;
            transform: translateY(0);
        }}
    </style>

    <div class="movie-container">
        {movie_cards}
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

    <script>
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.movie-card').forEach((card, i) => {{
            let isSearched = card.classList.contains('searched-card');
            let direction = ['top', 'bottom', 'left', 'right'][Math.floor(Math.random() * 4)];
            let startPos = {{ top: 0, bottom: 0, left: -300, right: 300 }}[direction];

            if (isSearched) {{
                // Special entrance for the searched movie
                gsap.fromTo(card,
                    {{ opacity: 0, scale: 0.5, rotateY: 180, filter: "blur(10px)" }},
                    {{
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        duration: 1.5,
                        delay: 0,
                        ease: "elastic.out(1, 0.5)",
                        filter: "blur(0)",
                        scrollTrigger: {{
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }}
                    }}
                );
            }} else {{
                gsap.fromTo(card,
                    {{ opacity: 0, [direction]: startPos, filter: "blur(5px)" }},
                    {{
                        opacity: 1,
                        [direction]: 0,
                        duration: 1.2,
                        delay: i * 0.3,
                        ease: "expo.out",
                        filter: "blur(0)",
                        scrollTrigger: {{
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }}
                    }}
                );
            }}
        }});

        gsap.utils.toArray('.movie-title').forEach((title) => {{
            gsap.fromTo(title,
                {{ opacity: 0, y: 30 }},
                {{
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "back.out(2)"
                }}
            );
        }});

gsap.utils.toArray('.movie-card').forEach((card) => {{
            card.addEventListener("mouseover", () => {{
                gsap.to(card, {{
                    background: "linear-gradient(145deg, #8e44ad, #f39c12)",
                    duration: 0.5
                }});
            }});

            card.addEventListener("mouseout", () => {{
                gsap.to(card, {{
                    background: "linear-gradient(145deg, #2c3e50, #3498db)",
                    duration: 0.5
                }});
            }});
        }});
    </script>
    """, height=1500)